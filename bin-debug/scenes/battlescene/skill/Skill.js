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
var SkillOneDamageWithOut = (function (_super) {
    __extends(SkillOneDamageWithOut, _super);
    function SkillOneDamageWithOut(caster, camp) {
        if (caster === void 0) { caster = null; }
        if (camp === void 0) { camp = CharCamp.Neut; }
        var _this = _super.call(this, caster, camp) || this;
        _this.targetType = TargetType.SpecialEnemy;
        _this.fireNeed = 2;
        _this.desc = "对敌方单体造成1*攻击的物理伤害，如果目标死亡则将其从游戏中排除";
        return _this;
    }
    SkillOneDamageWithOut.prototype.affect = function () {
        var scene = SceneManager.Ins.curScene;
        var hurt = new Hurt(HurtType.Pysic, this.caster);
        var affectResult = [];
        for (var _i = 0, _a = this.targets; _i < _a.length; _i++) {
            var char = _a[_i];
            var change = hurt.affect(char);
            if (!char.alive) {
                char.isInBattle = false;
                change.isInBattleNew = false;
            }
            affectResult.push(change);
        }
        return affectResult;
    };
    SkillOneDamageWithOut.prototype.performance = function (affectResult) {
        var _this = this;
        var damageFloatManage = SceneManager.Ins.curScene.damageFloatManager;
        egret.Tween.get(this.caster).to({
            x: this.targets[0].x + 100 * this.targets[0].camp,
            y: this.targets[0].y + 20
        }, 200).call(function () {
            IManualSkill.statePerformance(affectResult);
            _this.caster.play("attack1_+1", 1, "idle");
            _this.caster.armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, _this.casterAniEnd, _this);
        });
    };
    SkillOneDamageWithOut.prototype.casterAniEnd = function () {
        this.caster.armatureDisplay.removeEventListener(dragonBones.EventObject.COMPLETE, this.casterAniEnd, this);
        var newP = this.caster.getPositon();
        this.caster.play("idle", 0);
        egret.Tween.get(this.caster).to({
            x: newP.x,
            y: newP.y
        }, 200).call(function () {
            SceneManager.Ins.curScene.oneSkillperformEnd();
        });
    };
    return SkillOneDamageWithOut;
}(IManualSkill));
__reflect(SkillOneDamageWithOut.prototype, "SkillOneDamageWithOut");
