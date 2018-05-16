var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ISkill = (function () {
    function ISkill() {
    }
    /**
     * 根据目标类型，填充目标容器
     */
    ISkill.prototype.chooseTarget = function () {
        var scene = SceneManager.Ins.curScene;
        switch (this.targetType) {
            case TargetType.Self:
                this.target = [this.caster];
                break;
            case TargetType.AllFriend:
                if (this.caster.camp == CharCamp.enemy) {
                    this.target = scene.enemies;
                }
                else {
                    this.target = scene.friends;
                }
                break;
            case TargetType.AllEnemy:
                if (this.caster.camp == CharCamp.enemy) {
                    this.target = scene.friends;
                }
                else {
                    this.target = scene.enemies;
                }
                break;
            case TargetType.SpecialEnemy:
                if (this.caster.camp == CharCamp.enemy) {
                    this.target = [this.caster.randomTarget()];
                }
                else {
                    this.target = [scene.selectEnemy];
                }
                break;
            case TargetType.SpecialFriend:
                if (this.caster.camp == CharCamp.enemy) {
                    this.target = [this.caster.randomFriend()];
                }
                else {
                    this.target = [scene.selectFriend];
                }
                break;
        }
    };
    return ISkill;
}());
__reflect(ISkill.prototype, "ISkill");
var TargetType;
(function (TargetType) {
    TargetType[TargetType["Self"] = 0] = "Self";
    TargetType[TargetType["AllFriend"] = 1] = "AllFriend";
    TargetType[TargetType["AllEnemy"] = 2] = "AllEnemy";
    TargetType[TargetType["SpecialFriend"] = 3] = "SpecialFriend";
    TargetType[TargetType["SpecialEnemy"] = 4] = "SpecialEnemy"; // 选定的敌方
})(TargetType || (TargetType = {}));
