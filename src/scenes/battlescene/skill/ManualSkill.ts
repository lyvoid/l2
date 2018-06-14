class ManualSkill {
	// 从外部传入这个参数用来做其他用
	private _param: any;
	public setParam(input: any) { this._param = input; }
	// skill info
	private _skillName: string;
	private _fireNeed: number;
	private _description: string;
	private _skillId: number;
	private _skillsAfterId: number[];
	private _buffsIdToTarget: number[];
	private _targetSelectId: number; // 0时不启用
	private _needPerformance: boolean;
	// affect info
	private _hurtId: number;
	// can cast judge
	private _isSelectTargetCondition: boolean;
	private _targetNeedBelong: number;//0:noneed,1:self,2:enemy
	private _targetNeedStat: number;//0:noneed,1:alive,2:dead
	private _isSelfCondition: boolean;
	private _selfNeedStat: number;//0:noneed,1:alive,2:dead
	// affect
	private _affectFunStrId: string;

	// real time
	private _caster: Character;
	private _camp: CharCamp;
	private _targets: Character[];
	private _castQueue: Queue<{ cast: () => void }>;
	private _affectFunction: () => void;

	public get skillName(): string { return this._skillName }
	public get fireNeed(): number { return this._fireNeed }
	public get description(): string { return this._description }
	public get caster(): Character { return this._caster }

	public initial(
		skillName: string,
		description: string,
		skillId: number,
		skillsAfterId: number[],
		buffsIdToTarget: number[],
		targetSelectId: number,
		fireNeed: number = 0,
		needPerformance: boolean = false,
		isSelectTargetCondition: boolean = false,
		targetNeedBelong: number = 0,
		targetNeedStat: number = 0,
		isSelfCondition: boolean = false,
		selfNeedStat: number = 0,
		caster: Character = null,
		camp: CharCamp = CharCamp.Neut
	) {
		this._skillId = skillId;
		this._skillName = skillName;
		this._description = description;
		this._fireNeed = fireNeed;
		this._caster = caster;
		this._skillsAfterId = skillsAfterId;
		this._needPerformance = needPerformance;
		this._buffsIdToTarget = buffsIdToTarget;
		this._targetSelectId = targetSelectId;
		this._isSelectTargetCondition = isSelectTargetCondition;
		this._targetNeedStat = targetNeedStat;
		this._targetNeedBelong = targetNeedBelong;
		this._isSelfCondition = isSelfCondition;
		this._selfNeedStat = selfNeedStat;

		// set camp
		if (caster) {
			this._camp = caster.camp;
		} else {
			this._camp = camp;
		}

		// set scene
		this._castQueue = new Queue<{ cast: () => void }>();

		this._affectFunction = SKAFLS[this._affectFunStrId];
	}

	private cast(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		// if gameover, return
		if (scene.mWinnerCamp) {
			return;
		}
		// if can't cast, return
		if (!this.canCast()[0]) {
			return;
		}
		// 如果选择目标ID非0，采用默认选择目标方式进行选择
		if (this._targetSelectId != 0) {
			this.selectTarget();
			if (this._targets.length == 0) {
				// if no proper target
				return;
			}
		}
		// 如果没有处理方法则采用默认处理
		if (!this._affectFunction){
			this.defaultAffectFunc();
		} else {
			this._affectFunction();
		}
		let skillCastQue = this._castQueue;
		for (let id of this._skillsAfterId) {
			let skill = scene.mManualSkillManager.newSkill(
				id,
				this._caster,
				this._camp
			);
			skill._targets = this._targets;
			skillCastQue.push(
				skill
			);
		}

		// cast skill in castQue of BattleScene
		if (skillCastQue.length > 0) {
			let skill = skillCastQue.pop();
			skill.cast();
		}

		// start performance
		scene.performStart();
		this.release();
	}

	// 采用默认处理方法时，必须拥有合法的targetselectid
	private defaultAffectFunc(): void{
		let scene = SceneManager.Ins.curScene as BattleScene;
		let hurt = scene.mHurtManager.newHurt(this._hurtId);
		for (let target of this._targets) {
			hurt.affect(target);
			for (let buffid of this._buffsIdToTarget) {
				let buff = scene.mBuffManager.newBuff(buffid);
				buff.attachToChar(target);
			}
		}
		this.deftPrePerf();
	}

	private selectTarget(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;;
		let targetSelect = scene.mTargetSelectManager.getTargetSelect(this._targetSelectId);
		this._targets = targetSelect.select(this._camp, this._caster);
	}

	// 默认演出
	private deftPrePerf(): void {
		if (!this._needPerformance) {
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

		// call when anim end event dispatched
		let animEnd = () => {
			caster.mArmatureDisplay.removeEventListener(
				dragonBones.EventObject.COMPLETE,
				animEnd,
				this
			);
			scene.onePerformEnd();
		}

		if (isMove) {
			// if need move, push moving to nearestEnemy to queue
			scene.mPerformQueue.push({
				performance: () => {
					egret.Tween.get(caster).to({
						x: nearestEnemy.x + 100 * nearestEnemy.camp,
						y: nearestEnemy.y + 20
					}, 200).call(scene.onePerformEnd)
				}
			})
		}

		scene.mPerformQueue.push({
			// push skill anim to queue
			// TODO: replace the name of skill anim
			performance: () => {
				caster.playDBAnim("attack1_+1", 1, "idle");
				caster.mArmatureDisplay.addEventListener(
					dragonBones.EventObject.COMPLETE,
					animEnd,
					this
				);
			}
		});

		if (isMove) {
			// if need move, push move back to queue
			scene.mPerformQueue.push({
				performance: () => {
					let newP: { x: number, y: number } = caster.getPositon();
					caster.playDBAnim("idle", 0);
					egret.Tween.get(caster).to({
						x: newP.x,
						y: newP.y
					}, 200).call(scene.onePerformEnd)
				}
			});
		}
	}

	// canCast
	public canCast(): [boolean, string] {
		let scene = SceneManager.Ins.curScene as BattleScene;;
		let selectedChar = scene.mSelectedChar;
		if (this._isSelectTargetCondition) {
			if (!selectedChar.isInBattle) {
				return [false, "选中目标已从游戏中排除"];
			}
			if (this._targetNeedBelong == 1 && selectedChar.camp == CharCamp.Enemy) {
				return [false, "需要对我方单位释放"];
			}
			if (this._targetNeedBelong == 2 && selectedChar.camp == CharCamp.Player) {
				return [false, "需要对敌方单位释放"]
			}
			if (this._targetNeedStat == 1 && !selectedChar.alive) {
				return [false, "选中单位已死亡"];
			}
			if (this._targetNeedStat == 2 && selectedChar.alive) {
				return [false, "选中单位未死亡"]
			}
		}
		if (this._isSelfCondition && this._caster) {
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
		this._castQueue = null;
		let scene = SceneManager.Ins.curScene as BattleScene;
		scene.mManualSkillManager.recycle(this);
	}
}