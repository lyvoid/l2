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
var SkillTmp = (function (_super) {
    __extends(SkillTmp, _super);
    function SkillTmp() {
        var _this = _super.call(this) || this;
        _this.target = [];
        _this.targetType = TargetType.SpecialEnemy;
        _this.fireNeed = 2;
        return _this;
    }
    SkillTmp.prototype.setCaster = function (char) {
        this.caster = char;
    };
    SkillTmp.prototype.casterAniEnd = function () {
        this.caster.armatureDisplay.removeEventListener(dragonBones.EventObject.COMPLETE, this.casterAniEnd, this);
        var newP = this.caster.getPositon();
        this.caster.armatureDisplay.animation.play("idle");
        egret.Tween.get(this.caster).to({
            x: newP.x,
            y: newP.y
        }, 200);
        for (var _i = 0, _a = this.target; _i < _a.length; _i++) {
            var char = _a[_i];
            if (!char.isAlive) {
                try {
                    char.parent.removeChild(char);
                }
                catch (e) { }
            }
        }
    };
    SkillTmp.prototype.useSkill = function () {
        var _this = this;
        var fireboard = SceneManager.Ins.curScene.playerFireBoard;
        for (var i = 0; i < this.fireNeed; i++) {
            fireboard.removeFire();
        }
        this.chooseTarget();
        for (var _i = 0, _a = this.target; _i < _a.length; _i++) {
            var char = _a[_i];
            var ht = new Hurt();
            ht.hurtNumber = this.caster.attr.ap;
            ht.hurtType = HurtType.ABS;
            char.hurt(ht);
        }
        egret.Tween.get(this.caster).to({
            x: this.target[0].x + 100 * this.target[0].camp,
            y: this.target[0].y + 20
        }, 200).call(function () {
            var t = _this.target[0];
            egret.Tween.get(t.lifeBar).to({
                width: 100 * (t.attr.chp / t.attr.mhp),
            }, 1000).call(function () { console.log(t.lifeBar.x); });
            _this.caster.armatureDisplay.animation.play("attack1_+1", 1);
            _this.caster.armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, _this.casterAniEnd, _this);
        });
    };
    return SkillTmp;
}(ISkill));
__reflect(SkillTmp.prototype, "SkillTmp");
