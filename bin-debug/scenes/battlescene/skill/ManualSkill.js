var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ManualSkill = (function () {
    function ManualSkill() {
    }
    Object.defineProperty(ManualSkill.prototype, "skillName", {
        get: function () { return this._skillName; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ManualSkill.prototype, "fireNeed", {
        get: function () { return this._fireNeed; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ManualSkill.prototype, "description", {
        get: function () { return this._description; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ManualSkill.prototype, "caster", {
        get: function () { return this._caster; },
        enumerable: true,
        configurable: true
    });
    ManualSkill.prototype.initial = function (skillName, description, skillId, skillsAfterId, buffsIdToTarget, targetSelectId, fireNeed, needPerformance, isSelectTargetCondition, targetNeedBelong, targetNeedStat, isSelfCondition, selfNeedStat, caster, camp) {
        if (fireNeed === void 0) { fireNeed = 0; }
        if (needPerformance === void 0) { needPerformance = false; }
        if (isSelectTargetCondition === void 0) { isSelectTargetCondition = false; }
        if (targetNeedBelong === void 0) { targetNeedBelong = 0; }
        if (targetNeedStat === void 0) { targetNeedStat = 0; }
        if (isSelfCondition === void 0) { isSelfCondition = false; }
        if (selfNeedStat === void 0) { selfNeedStat = 0; }
        if (caster === void 0) { caster = null; }
        if (camp === void 0) { camp = CharCamp.Neut; }
        this._skillId = skillId;
        this._skillName = skillName;
        this._description = description;
        this._fireNeed = fireNeed;
        this._caster = caster;
        this._skillsAfterId = skillsAfterId;
        this._needPerformance = needPerformance;
        this._buffsIdToTarget = buffsIdToTarget;
        this._targetSelectId = targetSelectId;
        this._isSelectTargetCondition = isSelectTargetCondition;
        this._targetNeedStat = targetNeedStat;
        this._targetNeedBelong = targetNeedBelong;
        this._isSelfCondition = isSelfCondition;
        this._selfNeedStat = selfNeedStat;
        // set camp
        if (caster) {
            this._camp = caster.camp;
        }
        else {
            this._camp = camp;
        }
        var scene = SceneManager.Ins.curScene;
        this.mTargetSelect = scene.mTargetSelectManager.getTargetSelect(targetSelectId);
    };
    ManualSkill.prototype.cast = function () {
        var scene = SceneManager.Ins.curScene;
        // if gameover, return
        if (scene.mWinnerCamp) {
            return;
        }
        // if can't cast, return
        if (!this.canCast()[0]) {
            return;
        }
        this.mTargetSelect.select(this._camp, this._caster);
        if (this.mTargets.length == 0) {
            // if no proper target
            return;
        }
        // real affect of skill
        this.affect();
        // add performance to performanceQue of battlescene
        this.preparePerformance();
        // cast skill in castQue of BattleScene
        if (scene.mCastQueue.length > 0) {
            scene.mCastQueue.pop().cast();
        }
        // start performance
        scene.performStart();
    };
    ManualSkill.prototype.affect = function () {
        // TODO:add affect logic
    };
    ManualSkill.prototype.preSelectTarget = function () {
        return this.mTargetSelect.selectAll(this._camp, this._caster);
    };
    ManualSkill.prototype.preparePerformance = function () {
        var _this = this;
        if (!this._needPerformance) {
            // if this skill don't need performance
            return;
        }
        var caster = this._caster;
        if (!caster) {
            // if no caster, return (will be extended in the future)
            return;
        }
        var scene = SceneManager.Ins.curScene;
        var targets = this.mTargets;
        var casterCamp = caster.camp;
        var enemiesNum = 0;
        var minX = 1000;
        var nearestEnemy;
        for (var _i = 0, targets_1 = targets; _i < targets_1.length; _i++) {
            var char = targets_1[_i];
            // calculate proper position
            if (char.camp != casterCamp) {
                enemiesNum++;
                var distance = Math.abs(char.x - caster.x);
                if (distance < minX) {
                    nearestEnemy = char;
                    minX = distance;
                }
            }
        }
        var isMove = false;
        // if all target is enemy, then add move action
        if (enemiesNum == targets.length && enemiesNum > 0) {
            isMove = true;
        }
        // call when anim end event dispatched
        var animEnd = function () {
            caster.mArmatureDisplay.removeEventListener(dragonBones.EventObject.COMPLETE, animEnd, _this);
            scene.onePerformEnd();
        };
        if (isMove) {
            // if need move, push moving to nearestEnemy to queue
            scene.mPerformQueue.push({
                performance: function () {
                    egret.Tween.get(caster).to({
                        x: nearestEnemy.x + 100 * nearestEnemy.camp,
                        y: nearestEnemy.y + 20
                    }, 200).call(scene.onePerformEnd);
                }
            });
        }
        scene.mPerformQueue.push({
            // push skill anim to queue
            // TODO: replace the name of skill anim
            performance: function () {
                caster.playDBAnim("attack1_+1", 1, "idle");
                caster.mArmatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, animEnd, _this);
            }
        });
        if (isMove) {
            // if need move, push move back to queue
            scene.mPerformQueue.push({
                performance: function () {
                    var newP = caster.getPositon();
                    caster.playDBAnim("idle", 0);
                    egret.Tween.get(caster).to({
                        x: newP.x,
                        y: newP.y
                    }, 200).call(scene.onePerformEnd);
                }
            });
        }
    };
    // canCast
    ManualSkill.prototype.canCast = function () {
        var selectedChar = SceneManager.Ins.curScene.mSelectedChar;
        if (this._isSelectTargetCondition) {
            if (!selectedChar.isInBattle) {
                return [false, "选中目标已从游戏中排除"];
            }
            if (this._targetNeedBelong == 1 && selectedChar.camp == CharCamp.Enemy) {
                return [false, "需要对我方单位释放"];
            }
            if (this._targetNeedBelong == 2 && selectedChar.camp == CharCamp.Player) {
                return [false, "需要对敌方单位释放"];
            }
            if (this._targetNeedStat == 1 && !selectedChar.alive) {
                return [false, "选中单位已死亡"];
            }
            if (this._targetNeedStat == 2 && selectedChar.alive) {
                return [false, "选中单位未死亡"];
            }
        }
        if (this._isSelfCondition && this._caster) {
            if (!this._caster.isInBattle) {
                return [false, "释放者已被排除出游戏外"];
            }
            if (this._selfNeedStat == 1 && !this._caster.alive) {
                return [false, "释放者已死亡"];
            }
            if (this._selfNeedStat == 2 && this._caster.alive) {
                return [false, "释放者未死亡"];
            }
        }
        return [true, ""];
    };
    ManualSkill.prototype.release = function () {
        this._caster = null;
        this.mTargets = null;
    };
    return ManualSkill;
}());
__reflect(ManualSkill.prototype, "ManualSkill");
