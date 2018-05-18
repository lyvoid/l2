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
 * 临时技能，单纯用来测试
 */
var SkillTmp = (function (_super) {
    __extends(SkillTmp, _super);
    function SkillTmp(caster) {
        if (caster === void 0) { caster = null; }
        var _this = _super.call(this) || this;
        _this.targetType = TargetType.SpecialEnemy;
        _this.fireNeed = 2;
        _this.desc = "对指定单位造成攻击的伤害";
        _this.caster = caster;
        return _this;
    }
    SkillTmp.prototype.useSkill = function () {
        // 判断技能是不是需要释放
        this.manualChooseTarget();
        var target = this.targets[0];
        if (!target.alive) {
            return;
        }
        // 运行实际效果
        var affectResult = this.affect();
        // 确实需要释放时，将演出加到预演出列表
        var scene = SceneManager.Ins.curScene;
        scene.performQue.push([this, affectResult]);
        // 没次加入新的表现序列都调用一次应该是没错的
        MessageManager.Ins.sendMessage(MessageType.PerformanceChainStart);
        // 运行在在SkillToDo中的技能
        if (scene.skillTodoQue.length > 0) {
            scene.skillTodoQue.pop().useSkill();
        }
    };
    SkillTmp.prototype.affect = function () {
        var hurt = new Hurt(HurtType.Pysic, this.caster);
        var affectResult = [];
        for (var _i = 0, _a = this.targets; _i < _a.length; _i++) {
            var char = _a[_i];
            var change = hurt.affect(char);
            affectResult.push([char, change]);
        }
        return affectResult;
    };
    SkillTmp.prototype.performance = function (affectResult) {
        var _this = this;
        egret.Tween.get(this.caster).to({
            x: this.targets[0].x + 100 * this.targets[0].camp,
            y: this.targets[0].y + 20
        }, 200).call(function () {
            var _loop_1 = function (result) {
                var target = result[0];
                var change = result[1];
                if (change.hp != null) {
                    target.lifeBarAnim(change.hp).call(
                    // 血条变化完之后如果此次人物还死亡了的话
                    function () {
                        if (!change.alive && change.isAliveChange) {
                            target.addChild(new eui.Label("死亡"));
                        }
                    });
                }
                if (change.shield != null) {
                    target.lifeBarShieldAnim(change.shield);
                }
            };
            for (var _i = 0, affectResult_1 = affectResult; _i < affectResult_1.length; _i++) {
                var result = affectResult_1[_i];
                _loop_1(result);
            }
            _this.caster.armatureDisplay.animation.play("attack1_+1", 1);
            _this.caster.armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, _this.casterAniEnd, _this);
        });
    };
    SkillTmp.prototype.casterAniEnd = function () {
        this.caster.armatureDisplay.removeEventListener(dragonBones.EventObject.COMPLETE, this.casterAniEnd, this);
        var newP = this.caster.getPositon();
        this.caster.armatureDisplay.animation.play("idle");
        egret.Tween.get(this.caster).to({
            x: newP.x,
            y: newP.y
        }, 200).call(function () { return MessageManager.Ins.sendMessage(MessageType.PerformanceEnd); });
    };
    return SkillTmp;
}(IManualSkill));
__reflect(SkillTmp.prototype, "SkillTmp");
