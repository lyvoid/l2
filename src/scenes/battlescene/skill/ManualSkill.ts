class ManualSkill {
	// skill basic info
	private _skillName: string;
	private _fireNeed: number;
	private _description: string;
	// affect info // enable when targetselect not 0
	private _targetSelectId: number;
	private _hurtIdToTarget: number;
	private _hurtIdToSelf: number;
	private _buffsIdToTarget: number[];
	private _buffsIdToSelf: number[];
	private _isNoPerformance: boolean;
	// can cast judge 
	private _isSelectInBattle: boolean;
	private _selectNeedBelong: number;//0:noneed,1:self,2:enemy
	private _selectNeedStat: number;//0:noneed,1:alive,2:dead
	private _selfNeedStat: number;//0:noneed,1:alive,2:dead
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

	public get skillName(): string { return this._skillName }
	public get fireNeed(): number { return this._fireNeed }
	public get description(): string { return this._description }
	public get caster(): Character { return this._caster }

	public initial(
		skillName: string,
		fireNeed: number = 0,
		description: string,
		buffsIdToTarget: number[],
		buffsIdToSelf: number[],
		hurtIdToTarget: number,
		hurtIdToSelf: number,
		targetSelectId: number = 0,
		isNoPerformance: boolean = false,
		isSelectInBattle: boolean,
		selectNeedBelong: number = 0,
		selectNeedStat: number = 0,
		selfNeedStat: number = 0,
		affectFunStrId: string,
		caster: Character,
		camp: CharCamp
	) {
		this._isSelectInBattle = isSelectInBattle;
		this._skillName = skillName;
		this._description = description;
		this._fireNeed = fireNeed;
		this._caster = caster;
		this._isNoPerformance = isNoPerformance;
		this._buffsIdToTarget = buffsIdToTarget;
		this._targetSelectId = targetSelectId;
		this._selectNeedStat = selectNeedStat;
		this._selectNeedBelong = selectNeedBelong;
		this._selfNeedStat = selfNeedStat;
		this._hurtIdToSelf = hurtIdToSelf;
		this._hurtIdToTarget = hurtIdToTarget;
		this._buffsIdToSelf = buffsIdToSelf;
		this._affectFunStrId = affectFunStrId;
		this._camp = camp;
		// initial custom affect function 
		this._cusAffFc = SKAFFLS[this._affectFunStrId];
	}

	public cast(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		// if gameover, return
		if (scene.mWinnerCamp != CharCamp.Neut) {
			return;
		}
		// if can't cast, return
		if (!this.canCast()[0]) {
			return;
		}
		// if targetselectid not 0, use default selecttarget()
		// and then cast hurt and buffs to targets
		if (this._targetSelectId != 0) {
			this.selectTarget();
			if (this._targets.length == 0) {
				// if no proper target
				return;
			}
			if (this._caster && this._hurtIdToSelf != 0) {
				let hurt = scene.mHurtManager.newHurt(
					this._hurtIdToSelf,
					this.caster
				);
				hurt.affect(this._caster);
			}
			if (this._caster) {
				for (let buffid of this._buffsIdToSelf) {
					let buff = scene.mBuffManager.newBuff(buffid);
					buff.attachToChar(this._caster);
				}
			}
			let hurt = null;
			if (this._hurtIdToTarget != 0) {
				hurt = scene.mHurtManager.newHurt(
					this._hurtIdToTarget,
					this.caster
				);
			}
			for (let target of this._targets) {
				if (hurt != null) hurt.affect(target);
				for (let buffid of this._buffsIdToTarget) {
					let buff = scene.mBuffManager.newBuff(buffid);
					buff.attachToChar(target);
				}
			}
		}

		// if no affectfunction, then use default function
		if (!this._cusAffFc) {
			this.dftAffFc();
		} else {
			this._cusAffFc();
		}

		// auto release after cast
		this.release();
	}

	// 采用默认处理方法时，必须拥有合法的targetselectid
	private dftAffFc(): void {
		this.dftPrPerf();
	}

	private selectTarget(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;;
		let targetSelect = scene.mTargetSelectManager.getTargetSelect(this._targetSelectId);
		this._targets = targetSelect.select(this._camp, this._caster);
	}

	// 默认演出
	private dftPrPerf(): void {
		if (this._isNoPerformance) {
			// if this skill don't need performance
			return;
		}
		let caster = this._caster;
		if (!caster) {
			// if no caster, return (will be extended in the future)
			return;
		}
		let scene = SceneManager.Ins.curScene as BattleScene;;
		let targets = this._targets;
		let casterCamp = caster.camp;
		let enemiesNum = 0;
		let minX = 1000;
		let nearestEnemy: Character;
		for (let char of targets) {
			// calculate proper position
			if (char.camp != casterCamp) {
				enemiesNum++;
				let distance = Math.abs(char.x - caster.x);
				if (distance < minX) {
					nearestEnemy = char;
					minX = distance;
				}
			}
		}

		let isMove: boolean = false;
		// if all target is enemy, then add move action
		if (enemiesNum == targets.length && enemiesNum > 0) {
			isMove = true;
		}

		let tw = egret.Tween.get(caster);

		if (isMove) tw.to(
			{ x: nearestEnemy.x + 100 * nearestEnemy.camp, y: nearestEnemy.y + 20 }, 200);
		
		tw.call(
			() => {
				caster.playDBAnim("attack1_+1", 1, "idle");
				caster.mArmatureDisplay.addEventListener(
					dragonBones.EventObject.COMPLETE,
					animEnd,
					this
				);
			}
		);

		// call when anim end event dispatched
		let animEnd = () => {
			caster.mArmatureDisplay.removeEventListener(
				dragonBones.EventObject.COMPLETE,
				animEnd,
				this
			);
			caster.playDBAnim("idle", 0);
			if (isMove) {
				let newP: { x: number, y: number } = caster.getPositon();
				egret.Tween.get(caster).to({ x: newP.x, y: newP.y }, 200).call(
					()=>egret.Tween.removeTweens(caster)
				);
			}
		}
	}

	// canCast
	public canCast(): [boolean, string] {
		let scene = SceneManager.Ins.curScene as BattleScene;;
		let selectedChar = scene.mSelectedChar;
		if (this._isSelectInBattle && !selectedChar.isInBattle) {
			return [false, "选中目标已从游戏中排除"];
		}
		if (this._selectNeedBelong == 1 && selectedChar.camp == CharCamp.Enemy) {
			return [false, "需要对我方单位释放"];
		}
		if (this._selectNeedBelong == 2 && selectedChar.camp == CharCamp.Player) {
			return [false, "需要对敌方单位释放"]
		}
		if (this._selectNeedStat == 1 && !selectedChar.alive) {
			return [false, "选中单位已死亡"];
		}
		if (this._selectNeedStat == 2 && selectedChar.alive) {
			return [false, "选中单位未死亡"]
		}

		if (this._caster) {
			if (!this._caster.isInBattle) {
				return [false, "释放者已被排除出游戏外"];
			}
			if (this._selfNeedStat == 1 && !this._caster.alive) {
				return [false, "释放者已死亡"];
			}
			if (this._selfNeedStat == 2 && this._caster.alive) {
				return [false, "释放者未死亡"];
			}
		}
		return [true, ""];
	}

	public release(): void {
		this._caster = null;
		this._targets = null;
		let scene = SceneManager.Ins.curScene as BattleScene;
		scene.mManualSkillManager.recycle(this);
	}
}