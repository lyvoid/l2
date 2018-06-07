var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ManualSkillManager = (function () {
    function ManualSkillManager() {
        this._skillPool = [];
    }
    ManualSkillManager.prototype.newSkill = function (id, cast, camp) {
        if (cast === void 0) { cast = null; }
        if (camp === void 0) { camp = CharCamp.Neut; }
        var skillPool = this._skillPool;
        var skill;
        if (skillPool.length > 0) {
            skill = skillPool.pop();
        }
        else {
            skill = new ManualSkill();
        }
        // TODO: initial skill by skill id
        // skill.initial();
        return skill;
    };
    ManualSkillManager.prototype.release = function () {
        this._skillPool = null;
    };
    return ManualSkillManager;
}());
__reflect(ManualSkillManager.prototype, "ManualSkillManager");
