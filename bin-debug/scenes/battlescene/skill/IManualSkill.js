var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var IManualSkill = (function () {
    function IManualSkill() {
    }
    /**
     * 获取该阵营对应的敌我双方信息
     */
    IManualSkill.prototype.setCampChar = function () {
        var scene = SceneManager.Ins.curScene;
        if (this.caster != null && this.caster.camp == CharCamp.Enemy) {
            // 如果是敌方单位，对应的敌我双方刚好相反
            this.enemies = scene.friends;
            this.friends = scene.enemies;
        }
        else {
            // 如果没有施法者统一看成我方施法
            this.enemies = scene.enemies;
            this.friends = scene.friends;
        }
    };
    /**
     * 根据目标类型，填充目标容器（主要目标）
     * 这里选出的目标会在玩家手动模式释放卡牌的时候使用
     * 最好重写
     */
    IManualSkill.prototype.manualChooseTarget = function () {
        var scene = SceneManager.Ins.curScene;
        switch (this.targetType) {
            case TargetType.Self:
                this.targets = [this.caster];
                break;
            case TargetType.AllFriend:
                this.targets = scene.friends;
                break;
            case TargetType.AllEnemy:
                this.targets = scene.enemies;
                break;
            case TargetType.SpecialEnemy:
                this.targets = [scene.selectedEnemy];
                break;
            case TargetType.SpecialFriend:
                this.targets = [scene.selectedFriend];
                break;
            case TargetType.NoTarget:
                break;
            case TargetType.All:
                this.targets = scene.enemies.concat(scene.friends);
                break;
        }
    };
    /**
     * 这里选出的目标主要用在自动模式下
     * 敌方的所有选择均使用这个
     */
    IManualSkill.prototype.autoChooseTarget = function () {
        this.setCampChar();
        switch (this.targetType) {
            case TargetType.Self:
                this.targets = [this.caster];
                break;
            case TargetType.AllFriend:
                this.targets = this.friends;
                break;
            case TargetType.AllEnemy:
                this.targets = this.enemies;
                break;
            case TargetType.SpecialEnemy:
                this.targets = [this.enemies[0]];
                break;
            case TargetType.SpecialFriend:
                this.targets = [this.friends[0]];
                break;
            case TargetType.NoTarget:
                break;
            case TargetType.All:
                this.targets = this.enemies.concat(this.friends);
                break;
        }
    };
    ;
    IManualSkill.prototype.release = function () {
        this.caster = null;
        this.targets = null;
        this.friends = null;
        this.enemies = null;
    };
    return IManualSkill;
}());
__reflect(IManualSkill.prototype, "IManualSkill");
var TargetType;
(function (TargetType) {
    TargetType[TargetType["Self"] = 0] = "Self";
    TargetType[TargetType["AllFriend"] = 1] = "AllFriend";
    TargetType[TargetType["AllEnemy"] = 2] = "AllEnemy";
    TargetType[TargetType["SpecialFriend"] = 3] = "SpecialFriend";
    TargetType[TargetType["SpecialEnemy"] = 4] = "SpecialEnemy";
    TargetType[TargetType["NoTarget"] = 5] = "NoTarget";
    TargetType[TargetType["All"] = 6] = "All"; // 所有
})(TargetType || (TargetType = {}));
