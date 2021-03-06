class ManualSkill {
	// skill basic info
	private _skillName: string;
	private _fireNeed: number;
	private _description: string;
	private _iconName: string;
	public get iconName(): string{return this._iconName}
	// affect info // enable when targetselect not 0
	private _targetSelectId: number;
	private _hurtIdToTarget: number;
	private _hurtIdToSelf: number;
	private _isCusSelect: boolean;
	public get isCustomSelect():boolean{return this._isCusSelect;}
	private _buffsIdToTarget: number[];
	private _buffsIdToSelf: number[];
	private _isNoUseDefaultPerf: boolean;
	private _isDefPerfMove: boolean;
	private _defPerfAnim: string;
	private _isRemovePosBuff: boolean;
	private _isRemoveNegBuff: boolean;
	// can cast judge 
	private _isSelectInBattle: boolean;
	private _selectNeedBelong: number;//0:noneed,1:self,2:enemy
	private _selectNeedStat: number;//0:noneed,1:alive,2:dead
	// affect
	private _affectFunStrId: string;


	// real time
	private _caster: Character;
	private _camp: CharCamp;
	private _targets: Character[];
	private _cusAffFc: () => void;
	// from external for custom affect function
	private _param: any;
	public setParam(input: any) { this._param = input; }
	private _preSetTargets: Character[];
	public setPreSettargets(input: Character[]) { this._preSetTargets = input; }
	// skillmanager
	private _manualSkillManager: ManualSkillManager;

	public get skillName(): string { return this._skillName }
	public get fireNeed(): number { return this._fireNeed }
	public get description(): string { return this._description }
	public get caster(): Character { return this._caster }

	public initial(
		skillName: string,
		fireNeed: number = 0,
		description: string,
		iconName: string,
		isRemovePosBuff: boolean,
		isRemoveNegBuff: boolean,
		buffsIdToTarget: number[],
		buffsIdToSelf: number[],
		hurtIdToTarget: number,
		hurtIdToSelf: number,
		targetSelectId: number,
		isCustomSelect: boolean,
		isNoUseDefaultPerf: boolean,
		isDefPerfMove: boolean,
		selectNeedBelong: number,
		selectNeedStat: number,
		affectFunStrId: string,
		caster: Character,
		camp: CharCamp,
		defPerfAnim: string
	) {
		this._isCusSelect = isCustomSelect;
		this._isRemoveNegBuff = isRemoveNegBuff;
		this._isRemovePosBuff = isRemovePosBuff;
		this._iconName = iconName;
		this._skillName = skillName;
		this._description = description;
		this._fireNeed = fireNeed;
		this._caster = caster;
		this._isNoUseDefaultPerf = isNoUseDefaultPerf;
		this._buffsIdToTarget = buffsIdToTarget;
		this._targetSelectId = targetSelectId;
		this._selectNeedStat = selectNeedStat;
		this._selectNeedBelong = selectNeedBelong;;
		this._hurtIdToSelf = hurtIdToSelf;
		this._hurtIdToTarget = hurtIdToTarget;
		this._buffsIdToSelf = buffsIdToSelf;
		this._affectFunStrId = affectFunStrId;
		this._camp = camp;
		this._isDefPerfMove = isDefPerfMove;
		this._defPerfAnim = defPerfAnim;
		// initial custom affect function 
		this._cusAffFc = SKAFFLS[this._affectFunStrId];
	}

	public cast(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		// if gameover, return
		if (scene.mWinnerCamp != CharCamp.Neut) {
			this.release();
			return;
		}
		// if can't cast, return
		if (!this.canCast()) {
			this.release();
			return;
		}
		// if targetselectid not 0, use default selecttarget()
		// and then cast hurt and buffs to targets
		if (this._preSetTargets) {
			this._targets = this._preSetTargets;
		} else if (this._targetSelectId != 0) {
			this.selectTarget();
			if (this._targets.length == 0) {
				// if no proper target
				this.release();
				return;
			}
		}

		// if target is a proper target ?
		let targesTmp = []
		for (let t of this._targets){
			if (!t.isInBattle) continue;
			if (t.alive && this._selectNeedStat==2) continue;
			if (!t.alive && this._selectNeedStat==1) continue;
			if (t.mCamp != this._camp && this._selectNeedBelong==1) continue;
			if (t.mCamp == this._camp && this._selectNeedBelong==2) continue;
			targesTmp.push(t);
		}
		if (targesTmp.length==0){
			this.release();
			return;
		}
		this._targets = targesTmp;

		// ----- if all condition pass
		// default performance
		if (!this._isNoUseDefaultPerf) {
			// if use default performance
			this.dftPrPerf();
		}

		// use special affect function
		if (this._cusAffFc) {
			this._cusAffFc();
		}

		// normal affect
		if (this._targets) {
			let hurt: Hurt = null;
			if (this._hurtIdToTarget != 0) {
				hurt = scene.mHurtManager.newHurt(
					this._hurtIdToTarget,
					this._caster
				);
			}
			for (let target of this._targets) {
				if (hurt != null) hurt.affect(target);
				for (let buffid of this._buffsIdToTarget) {
					let buff = scene.mBuffManager.newBuff(buffid);
					buff.attachToChar(target);
				}

				if (this._isRemoveNegBuff || this._isRemovePosBuff){
					target.removeAllBuff(this._isRemovePosBuff, this._isRemoveNegBuff);
				}
			}
			if (hurt) hurt.release();
		}

		if (this._caster && this._hurtIdToSelf != 0) {
			let hurt = scene.mHurtManager.newHurt(
				this._hurtIdToSelf,
				this._caster
			);
			hurt.affect(this._caster);
			if (hurt) hurt.release();
		}
		if (this._caster) {
			for (let buffid of this._buffsIdToSelf) {
				let buff = scene.mBuffManager.newBuff(buffid);
				buff.attachToChar(this._caster);
			}
		}

		// auto release after cast
		this.release();
	}

	private selectTarget(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;;
		this._targets = TargetSelect.selectTarget(this._targetSelectId, this._camp, this._caster);
	}

	// 默认演出
	private dftPrPerf(): void {
		let caster = this._caster;
		if (!caster) {
			// TODO: if no caster, return (will be extended in the future)
			return;
		}
		let scene = SceneManager.Ins.curScene as BattleScene;;
		let targets = this._targets;
		let casterCamp = caster.mCamp;
		let enemiesNum = 0;
		let minX = 3000;
		let nearestEnemy: Character;
		for (let char of targets) {
			// calculate proper position
			if (char.mCamp != casterCamp) {
				enemiesNum++;
				let distance = Math.abs(char.x - caster.x);
				if (distance < minX) {
					nearestEnemy = char;
					minX = distance;
				}
			}
		}

		let isMove: boolean = this._isDefPerfMove;
		// if not all target is enemy, don't move
		if (!(enemiesNum == targets.length && enemiesNum > 0)) {
			isMove = false;
		}

		if (isMove) {
			let newPos = { x: nearestEnemy.x + 100 * nearestEnemy.mCamp, y: nearestEnemy.y + 20 }
			caster.nextPerf({
				pType: PType.Move,
				param: { newP: newPos }
			})
		}

		caster.nextPerf({
			pType: PType.DBAnim,
			param: { animName: this._defPerfAnim }
		})

		// call when anim end event dispatched
		if (isMove) {
			let newPos: { x: number, y: number } = caster.getPositon();
			caster.nextPerf({
				pType: PType.Move,
				param: { newP: newPos }
			});
		}
	}

	public getRandomCusTarget(): boolean{
		let prepareTargets = [];
		let scene = SceneManager.Ins.curScene as BattleScene;
		for (let t of scene.mFriends.concat(scene.mEnemies)){
			if (t.isInBattle){
				if (!t.alive && this._selectNeedStat == 1){
					// if need alive but target is not alive
					continue;
				}
				if (t.alive && this._selectNeedStat == 2){
					// if need not alive but target is alive
					continue;
				}
				if (t.mCamp != this._camp && this._selectNeedBelong == 1){
					// if need self but not target not self
					continue;
				}
				if (t.mCamp == this._camp && this._selectNeedBelong == 2){
					// if need enemy but target is self
					continue;
				}
				prepareTargets.push(t);
			}
		}
		if (prepareTargets.length == 0){
			return false;
		}
		let i = Math.ceil(Math.random() * prepareTargets.length);
		i = Math.max(0, i-1);
		this._preSetTargets = [prepareTargets[i]];
		return true;
	}

	// canCast
	private canCast(): boolean {
		if (this._caster) {
			if (!this._caster.isInBattle || this.caster.isDiz) {
				return false;
			}
		}
		return true;
	}

	public release(): void {
		this._caster = null;
		this._targets = null;
		this._preSetTargets = null;
		let scene = SceneManager.Ins.curScene as BattleScene;
		scene.mManualSkillManager.recycle(this);
	}
}