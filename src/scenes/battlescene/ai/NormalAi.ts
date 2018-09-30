class NormalAi {
	private _maxCoolDownTimes: number[];
	private _curCoolDownTimes: number[];
	private _fireNeeds: number[];
	private _skillList: number[];
	private _caster: Character;

	public constructor(caster: Character) {
		this._skillList = caster.manualSkillsId;
		this._caster = caster;
		let maxCoolDownTimes = [];
		let curCoolDownTimes = [];
		let fireNeeds = []
		for (let skillId of this._skillList) {
			let skillInfo = ManualSkillManager.getSkillInfo(skillId);
			maxCoolDownTimes.push(skillInfo['maxCd']);
			curCoolDownTimes.push(0);
			fireNeeds.push(skillInfo['fireNeed']);
		}
		this._maxCoolDownTimes = maxCoolDownTimes;
		this._curCoolDownTimes = curCoolDownTimes;
		this._fireNeeds = fireNeeds;
	}

	public run() {
		let scene = SceneManager.Ins.curScene as BattleScene;
		let skillManager = scene.mManualSkillManager;
		let castSkillId = -1;
		let maxCoolDownTimes = this._maxCoolDownTimes;
		let curCoolDownTimes = this._curCoolDownTimes;
		let maxFireNeed = -1;
		let fireNeeds = this._fireNeeds;
		let skillList = this._skillList
		for (let i in skillList){
			if (curCoolDownTimes[i] == 0 && fireNeeds[i] > maxFireNeed){
				castSkillId = skillList[i];
				maxFireNeed = fireNeeds[i];
			}
		}
		for (let i in curCoolDownTimes){
			curCoolDownTimes[i] = Math.max(0, curCoolDownTimes[i] - 1);
		}
		if (castSkillId != -1){
			scene.addToCastQueue(skillManager.newSkill(castSkillId, this._caster));
			let i = skillList.indexOf(castSkillId);
			curCoolDownTimes[i] = maxCoolDownTimes[i];
		}
	}

	public release(){
		this._caster = null;
		this._skillList = null;
		this._maxCoolDownTimes = null;
		this._curCoolDownTimes = null;
	}
}