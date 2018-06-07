class ManualSkill {
	// skill info
	private _skillName: string;
	private _fireNeed: number;
	private _description: string;
	private _skillId: number;
	private _skillsAfterId: number[];
	private _buffsIdToTarget: number[];
	private _targetSelectId: number;
	private _needPerformance: boolean;
	// can cast judge
	private _isSelectTargetCondition: boolean;
	private _targetNeedBelong: number;//0:noneed,1:self,2:enemy
	private _targetNeedStat: number;//0:noneed,1:alive,2:dead
	private _isSelfCondition: boolean;
	private _selfNeedStat: number;//0:noneed,1:alive,2:dead

	// real time
	private _caster: Character;
	private _camp: CharCamp;
	public mTargetSelect: TargetSelect;
	public mTargets: Character[];

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

		let scene = SceneManager.Ins.curScene as BattleScene;
		this.mTargetSelect = scene.mTargetSelectManager.getTargetSelect(targetSelectId);
	}


	public cast(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		// if gameover, return
		if (scene.mWinnerCamp) {
			return;
		}
		// if can't cast, return
		if (!this.canCast()[0]) {
			return;
		}
		this.mTargetSelect.select(this._camp, this._caster);
		if (this.mTargets.length == 0) {
			// if no proper target
			return;
		}
		// real affect of skill
		this.affect();
		// add performance to performanceQue of battlescene
		this.preparePerformance();

		// cast skill in castQue of BattleScene
		if (scene.mCastQueue.length > 0) {
			scene.mCastQueue.pop().cast();
		}
		// start performance
		scene.performStart();
	}

	private affect(): void {

	}

	private preparePerformance(): void {
		if (!this._needPerformance) {
			// if this skill don't need performance
			return;
		}
		let caster = this._caster;
		if (!caster) {
			// if no caster, return (will be extended in the future)
			return;
		}
		let scene = SceneManager.Ins.curScene as BattleScene;
		let targets = this.mTargets;
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
	private canCast(): [boolean, string] {
		let selectedChar = (SceneManager.Ins.curScene as BattleScene).mSelectedChar;
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
		this.mTargets = null;
	}
}