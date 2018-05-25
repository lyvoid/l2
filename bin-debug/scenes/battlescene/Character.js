var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
/**
 * 场景中的一个角色，该类的实例应该只会出现在BattleScene中
 */
var Character = (function (_super) {
    __extends(Character, _super);
    function Character(charactorName) {
        var _this = _super.call(this) || this;
        /**
         * 角色名
         */
        _this.charName = "还没有名字";
        /**
         * 简介
         */
        _this.feature = "特征是什么呢？";
        /**
         * 是否存在游戏中
         */
        _this._isInBattle = true;
        /**
         * 阵营
         */
        _this.camp = CharCamp.Player;
        /**
         * 前中后三排 站位
         */
        _this.col = CharColType.frontRow;
        /**
         * 位置 上中下三行
         */
        _this.row = CharRowType.mid;
        // 背景层
        var bg = new egret.DisplayObjectContainer();
        _this.bgLayer = bg;
        _this.addChild(bg);
        // 载入龙骨动画
        _this.loadArmature(charactorName);
        // 加属性
        _this.attr = new Attribute();
        _this.attr.char = _this;
        // 加血条
        var lifeBar = new egret.DisplayObjectContainer();
        lifeBar.x = -50;
        lifeBar.y = -210;
        var lifebarBg = new egret.Bitmap(RES.getRes("lifebarbg_jpg"));
        lifebarBg.alpha = 0.5;
        lifebarBg.width = 100;
        lifeBar.addChild(lifebarBg);
        var lifeBarFg = new egret.Bitmap(RES.getRes("lifebar_jpg"));
        lifeBarFg.width = 100;
        lifeBarFg.y = 1;
        lifeBar.addChild(lifeBarFg);
        _this.addChild(lifeBar);
        _this.lifeBar = lifeBar;
        _this.lifeBarFg = lifeBarFg;
        // 加buff条
        var buffLine = new egret.DisplayObjectContainer();
        buffLine.y = -12;
        _this.buffLine = buffLine;
        _this.lifeBar.addChild(buffLine);
        // 加护盾条
        var shieldBar = new egret.Bitmap(RES.getRes("lifebarbg_jpg"));
        shieldBar.height = 8;
        shieldBar.y = 13;
        shieldBar.width = 80 * _this.attr.shield / _this.attr.maxShield;
        lifeBar.addChild(shieldBar);
        _this.shieldBar = shieldBar;
        // 加技能
        _this.manualSkills = [];
        var skill1 = new SkillOneDamageWithOut(_this);
        _this.manualSkills.push(skill1);
        _this.passiveSkills = [];
        _this.buffs = [];
        return _this;
    }
    Object.defineProperty(Character.prototype, "desc", {
        /**
         * 人物当前状态描述，在长按中展示
         */
        get: function () {
            var color = "#000000";
            if (this.camp === CharCamp.Enemy) {
                color = "#EE2C2C";
            }
            else if (this.camp === CharCamp.Player) {
                color = "#7FFF00";
            }
            return "<b><font color=\"" + color + "\">" + this.charName + "</font></b>" +
                ("\n<font color=\"#3D3D3D\" size=\"15\">" + this.feature + "</font>\n\n" + this.attr.toString());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "skillDesc", {
        /**
         * 人物技能及当前buff描述，长按中展示
         */
        get: function () {
            var passiveSkillsDesc = "";
            var buffsDesc = "";
            var skillsDesc = "";
            for (var _i = 0, _a = this.manualSkills; _i < _a.length; _i++) {
                var skill = _a[_i];
                skillsDesc = skillsDesc + "<b>" + skill.skillName + ":</b>" + skill.desc + "\n";
            }
            return "<font color=\"#EE7942\"><b>\u88AB\u52A8\u6280\u80FD</b></font>\n<font color=\"#7FFF00\"><b>\u6FC0\u6012(2):</b></font> \u8BE5\u5355\u4F4D\u589E\u52A050%\u7684\u989D\u5916\u653B\u51FB\u529B\n\n<font color=\"#EE7942\"><b>\u5F53\u524D\u72B6\u6001</b></font>\n<font color=\"#7FFF00\"><b>\u6FC0\u6012(2):</b></font> \u8BE5\u5355\u4F4D\u589E\u52A050%\u7684\u989D\u5916\u653B\u51FB\u529B\n\n<font color=\"#EE7942\"><b>\u4E3B\u52A8\u6280\u80FD</b></font>\n" + skillsDesc;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "isInBattle", {
        get: function () {
            return this._isInBattle;
        },
        set: function (value) {
            // 如果角色本来在游戏中但被排除出游戏
            if (this._isInBattle && (!value)) {
                var scene = SceneManager.Ins.curScene;
                if (this.camp == CharCamp.Player) {
                    // 移除手牌中属于当前角色的牌
                    scene.cardBoard.removeCardOfChar(this);
                    // 移除SkillPool中归属于该角色的技能
                    var skillPools = scene.skillManualPool;
                    var skillsForDelete = [];
                    for (var _i = 0, skillPools_1 = skillPools; _i < skillPools_1.length; _i++) {
                        var skill = skillPools_1[_i];
                        if (skill.caster === this) {
                            skillsForDelete.push(skill);
                        }
                    }
                    for (var _a = 0, skillsForDelete_1 = skillsForDelete; _a < skillsForDelete_1.length; _a++) {
                        var skill = skillsForDelete_1[_a];
                        Util.deleteObjFromList(skillPools, skill);
                    }
                }
                // 更新排除出游戏状态
                this._isInBattle = value;
                // 如果选中的角色时当前角色，如果还有备选方案，选中者替换成其他人
                var newTarget = null;
                if (scene.selectedFriend === this) {
                    console.log("frient");
                    newTarget = IManualSkill.getFirstInBattle(scene.friends);
                }
                else if (scene.selectedEnemy === this) {
                    console.log("enemy");
                    newTarget = IManualSkill.getFirstInBattle(scene.enemies);
                }
                if (newTarget) {
                    scene.setSelectTarget(newTarget);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "alive", {
        /**
         * 是否存活
         */
        get: function () {
            return this.attr.hp != 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 播放血条动画，血条在1s内从之前的状态到达当前血量的状态
     */
    Character.prototype.lifeBarAnim = function (newHp) {
        if (!newHp) {
            newHp = this.attr.hp;
        }
        var lifeBarNewLen = 100 * newHp / this.attr.maxHp;
        return egret.Tween.get(this.lifeBarFg).to({
            width: lifeBarNewLen,
        }, 1000, egret.Ease.quintOut);
    };
    /**
     * 播放shield条动画
     */
    Character.prototype.lifeBarShieldAnim = function (newShield) {
        if (!newShield) {
            newShield = this.attr.shield;
        }
        var lifeBarNewLen = 80 * newShield / this.attr.maxHp;
        return egret.Tween.get(this.shieldBar).to({
            width: lifeBarNewLen,
        }, 1000, egret.Ease.quintOut);
    };
    Character.prototype.loadArmature = function (charactorName) {
        // 从当前场景中获取dbManager，因此在实例化charactor前
        var dbManager = SceneManager.Ins.curScene.dbManager;
        var armatureDisplay = dbManager.getArmatureDisplay(charactorName);
        // 设置龙骨动画资源大小
        var demandArmatureWidth = 100;
        var demandArmatureHeight = 200;
        armatureDisplay.scaleX = demandArmatureWidth / armatureDisplay.width;
        armatureDisplay.scaleY = demandArmatureHeight / armatureDisplay.height;
        armatureDisplay.width = demandArmatureWidth;
        armatureDisplay.height = demandArmatureHeight;
        // 增加动画点击事件
        armatureDisplay.touchEnabled = true;
        armatureDisplay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        // 龙骨动画添加到Character中
        this.addChild(armatureDisplay);
        this.armatureDisplay = armatureDisplay;
        // 绑定长按动作
        LongTouchUtil.bindLongTouch(armatureDisplay, this);
        // 绑定TouchBegin事件（发送TouchBegin消息）
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
    };
    /**
     * 播放龙骨动画
     */
    Character.prototype.playDBAnim = function (animationName, animationTimes, animationNameBack) {
        if (animationTimes === void 0) { animationTimes = -1; }
        if (animationNameBack === void 0) { animationNameBack = "idle"; }
        if (this.armatureDisplay.animation.animationNames.indexOf(animationName) >= 0) {
            this.armatureDisplay.animation.play(animationName, animationTimes);
        }
        else {
            this.armatureDisplay.animation.play(animationNameBack, animationTimes);
        }
    };
    Character.prototype.onLongTouchEnd = function () {
        var scene = SceneManager.Ins.curScene;
        LayerManager.Ins.popUpLayer.removeChild(scene.charInfoPopupUI);
    };
    Character.prototype.onLongTouchBegin = function () {
        var scene = SceneManager.Ins.curScene;
        scene.charInfoPopupUI.setDescFlowText(this.desc);
        scene.charInfoPopupUI.setSkillDescFlowText(this.skillDesc);
        LayerManager.Ins.popUpLayer.addChild(scene.charInfoPopupUI);
    };
    /**
     * 停止龙骨动画
     */
    Character.prototype.stopDBAnim = function () {
        this.armatureDisplay.animation.stop();
    };
    // 点击的时候播放外发光滤镜动画
    Character.prototype.onTouchBegin = function () {
        SceneManager.Ins.curScene.filterManager.setOutGlowHolderWithAnim(this.armatureDisplay);
    };
    /**
     * 点击时触发
     * 将选中框移动到该角色的bgLayer中，
     * 同时将scene下的selectEnemy及Friend调整为合适的对象
     */
    Character.prototype.onTouchTap = function () {
        SceneManager.Ins.curScene.setSelectTarget(this);
    };
    /**
     * 隐藏生命条
     */
    Character.prototype.lifeBarHide = function () {
        this.lifeBar.visible = false;
    };
    /**
     * 显示生命条
     */
    Character.prototype.lifeBarShow = function () {
        this.lifeBar.visible = true;
    };
    /**
     * 生命条开始闪烁
     */
    Character.prototype.lifeBarBlink = function () {
        egret.Tween.get(this.lifeBar, { loop: true }).to({ alpha: 0 }, 300).to({ alpha: 1 }, 300);
    };
    /**
     * 停止生命条闪烁
     */
    Character.prototype.lifeBarUnBlink = function () {
        egret.Tween.removeTweens(this.lifeBar);
        this.lifeBar.alpha = 1;
    };
    /**
     * 将角色设置为应该在的位置
     */
    Character.prototype.setPosition = function () {
        // 修改动画朝向为正确朝向
        this.armatureDisplay.scaleX = Math.abs(this.armatureDisplay.scaleX) * this.camp;
        // 修改动画位置
        var newP = this.getPositon();
        this.x = newP.x;
        this.y = newP.y;
    };
    /**
     * 获取角色应该在的位置
     */
    Character.prototype.getPositon = function () {
        var y = 300 + 65 * this.row + Math.random() * 30;
        var x = 120 + this.col * 130 + this.row * 20 + Math.random() * 10;
        if (this.camp == CharCamp.Enemy) {
            x = LayerManager.Ins.stageWidth - x;
        }
        return { x: x, y: y };
    };
    /**
     * db动画闪烁
     */
    Character.prototype.armatureBlink = function () {
        egret.Tween.get(this.armatureDisplay, { loop: true }).to({ alpha: 0 }, 300).to({ alpha: 1 }, 300);
    };
    /**
     * 获取对比后的属性改动信息
     */
    /**
     * db动画停止闪烁
     */
    Character.prototype.armatureUnBlink = function () {
        egret.Tween.removeTweens(this.armatureDisplay);
    };
    Character.prototype.release = function () {
        LongTouchUtil.unbindLongTouch(this.armatureDisplay, this);
        this.armatureDisplay.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        this.armatureDisplay.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.armatureDisplay = null;
        for (var _i = 0, _a = this.manualSkills; _i < _a.length; _i++) {
            var skill = _a[_i];
            skill.release();
        }
        this.manualSkills = null;
        this.attr = null;
        this.lifeBarFg = null;
        this.bgLayer = null;
        this.lifeBar = null;
        this.shieldBar = null;
    };
    return Character;
}(egret.DisplayObjectContainer));
__reflect(Character.prototype, "Character");
var CharCamp;
(function (CharCamp) {
    CharCamp[CharCamp["Player"] = 1] = "Player";
    CharCamp[CharCamp["Neut"] = 0] = "Neut";
    CharCamp[CharCamp["Enemy"] = -1] = "Enemy";
})(CharCamp || (CharCamp = {}));
var CharColType;
(function (CharColType) {
    CharColType[CharColType["frontRow"] = 0] = "frontRow";
    CharColType[CharColType["midRow"] = 1] = "midRow";
    CharColType[CharColType["backRow"] = 2] = "backRow";
})(CharColType || (CharColType = {}));
var CharRowType;
(function (CharRowType) {
    CharRowType[CharRowType["up"] = 0] = "up";
    CharRowType[CharRowType["mid"] = 1] = "mid";
    CharRowType[CharRowType["down"] = 2] = "down";
})(CharRowType || (CharRowType = {}));
