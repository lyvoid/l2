class ManualSkillManager {
    private _skillPool: ManualSkill[];

    public constructor() {
        this._skillPool = [];
    }

    public newSkill(id: number, cast: Character = null, camp: CharCamp = null): ManualSkill {
        let skillPool = this._skillPool;
        let skill: ManualSkill;
        if (skillPool.length > 0) {
            skill = skillPool.pop();
        } else {
            skill = new ManualSkill();
        }
        if (camp == null) {
            camp = cast ? cast.mCamp : CharCamp.Neut;
        }
        let skillConfig = ConfigManager.Ins.mSkillConfig;
        let skillInfo = skillConfig[id];
        skill.initial(
            skillInfo["skillName"],
            skillInfo["fireNeed"],
            skillInfo["description"],
            skillInfo["iconName"],
            skillInfo["isRemovePosBuff"],
            skillInfo["isRemoveNegBuff"],
            skillInfo["buffsIdToTarget"],
            skillInfo["buffsIdToSelf"],
            skillInfo["hurtIdToTarget"],
            skillInfo["hurtIdToSelf"],
            skillInfo["targetSelectId"],
            skillInfo["isNoUseDefaultPerf"],
            skillInfo["isDefPerfMove"],
            skillInfo["isSelectInBattle"],
            skillInfo["selectNeedBelong"],
            skillInfo["selectNeedStat"],
            skillInfo["affectFunStrId"],
            cast,
            camp,
            skillInfo["defPerfAnim"] == "" ? "attack" : skillInfo["defPerfAnim"]
        )
        return skill;
    }

    public static getSkillInfo(skillId: number) {
        let skillConfig = ConfigManager.Ins.mSkillConfig;
        let skillInfo = skillConfig[skillId];
        return skillInfo;
    }

    public static isCusSelectTarget(skillId: number): boolean{
        return ManualSkillManager.getSkillInfo(skillId)['targetSelectId'] == 1;
    }

    public recycle(skill: ManualSkill): void {
        this._skillPool.push(skill);
    }

    public release() {
        let pool = this._skillPool;
        this._skillPool = null;
    }

}