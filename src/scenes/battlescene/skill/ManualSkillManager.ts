class ManualSkillManager {
    private _skillPool: ManualSkill[];

    public constructor() {
        this._skillPool = [];
    }

    public newSkill(id: number, cast: Character = null, camp: CharCamp=CharCamp.Neut): ManualSkill {
        let skillPool = this._skillPool;
        let skill: ManualSkill;
        if (skillPool.length > 0) {
            skill = skillPool.pop();
        } else {
            skill = new ManualSkill();
        }
        // TODO: initial skill by skill id
        // skill.initial();
        return skill;
    }

    public release() {
        this._skillPool = null;
    }

}