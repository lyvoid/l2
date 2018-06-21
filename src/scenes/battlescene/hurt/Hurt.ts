class Hurt {
	// info
	private _hurtType: HurtType; // 伤害类型（物理/魔法/治疗生命/增加护盾）
	private _rate: number; // 伤害倍率
	private _isAbs: boolean; // 是否绝对伤害（不考虑护甲）
	private _absValue: number;// 绝对伤害对应的值是多少
	private _isPericeShield: boolean;// 是否穿透护盾（无视护盾，直接伤血）  治疗效果时无效
	private _isDoubleShield: boolean;// 是否破盾（对有护盾的单位造成双倍伤害） 治疗效果时无效
	private _isResurgence: boolean;// 是否复活 （仅治愈生命类型有效）
	private _isRemoveFromGameWhenDie: boolean;// 是否死亡移除游戏
	private _isRemoveFromGame: boolean; //是否直接移除游戏

	// real time
	private _fromChar: Character; // 伤害来源

	public initial(
		hurtType: HurtType,
		rate: number,
		isAbs: boolean,
		absValue: number,
		isPericeShield: boolean,
		isDoubleShield: boolean,
		isResurgence: boolean,
		isRemoveFromGame: boolean,
		isRemoveFromGameWhenDie: boolean,
		fromChar: Character
	) {
		this._fromChar = fromChar;
		this._hurtType = hurtType;
		this._rate = rate;
		this._isAbs = isAbs;
		this._absValue = absValue;
		this._isPericeShield = isPericeShield;
		this._isDoubleShield = isDoubleShield;
		this._isResurgence = isResurgence;
		this._isRemoveFromGame = isRemoveFromGame;
		this._isRemoveFromGameWhenDie = isRemoveFromGameWhenDie;
	}

	public release(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		this._fromChar = null;
		scene.mHurtManager.recycle(this);
	}

	public affect(target: Character) {
		let aliveBefore = target.alive;
		let hurtResult = this.affectWithoutPerfrom(target);
		if (((!target.alive) && this._isRemoveFromGameWhenDie) || this._isRemoveFromGame) {
			target.isInBattle = false;
		}
		hurtResult = Hurt.fullNewAttrToResult(hurtResult, target);
		let scene = SceneManager.Ins.curScene as BattleScene;
		Hurt.statePerformance(hurtResult);
		// judge after every hurt affect
		scene.judge();
		// release hurt after affect
		this.release();
		// send hurt affect message
		MessageManager.Ins.sendMessage(
			MessageType.HurtAffect,
			hurtResult
		);
	}

	private affectWithoutPerfrom(target: Character): HurtResult {
		let targetAttr = target.mAttr;
		let harm = 0;
		let hurtResult: HurtResult = new HurtResult();
		hurtResult.fromChar = this._fromChar;
		hurtResult.targetChar = target;
		Hurt.fullOldAttrToResult(hurtResult, target);

		// armor
		if (this._isAbs) {
			harm = this._absValue;
		} else {
			let fromAttr = this._fromChar.mAttr;
			if (this._hurtType == HurtType.Pysic || this._hurtType == HurtType.Magic) {
				let ar = this._hurtType == HurtType.Pysic ? targetAttr.arPys : targetAttr.arMagic;
				ar -= fromAttr.pierceAr;
				ar = ar > 0 ? ar : 0;
				harm = fromAttr.ap - ar;
				harm = harm > 0 ? harm : (fromAttr.ap / 10);
			}
			else if (this._hurtType == HurtType.HealHp || this._hurtType == HurtType.HealShield) {
				harm = fromAttr.ap;
			}
		}

		// rate
		harm *= this._rate;
		harm = Math.floor(harm);

		// HealHp
		if (this._hurtType == HurtType.HealHp && (target.alive || this._isResurgence)) {
			let newHp = targetAttr.hp + harm;
			targetAttr.hp = newHp;
			return hurtResult;
		}

		// if target is dead, no affect beside heal hp
		if (!target.alive) {
			return hurtResult;
		}

		// HealShield
		if (this._hurtType == HurtType.HealShield) {
			let newShield = targetAttr.shield + harm;
			newShield = newShield > targetAttr.maxShield ? targetAttr.maxShield : newShield;
			let healValue = newShield - targetAttr.shield;
			targetAttr.shield = newShield;
			return hurtResult;
		}

		// double shield
		if (targetAttr.shield > 0 && this._isDoubleShield) {
			harm *= 2;
		}

		// damage reduce
		if (this._hurtType == HurtType.Magic) {
			harm = harm - targetAttr.magicDamageReduceAbs;
			harm = harm > 0 ? harm : 0;
			harm = harm * (1 - targetAttr.magicDamageReducePerc)
			harm = harm > 0 ? Math.ceil(harm) : 0;
		} else if (this._hurtType == HurtType.Pysic) {
			harm = harm - targetAttr.pysDamageReduceAbs;
			harm = harm > 0 ? harm : 0;
			harm = harm * (1 - targetAttr.pysDamageReducePerc)
			harm = harm > 0 ? Math.ceil(harm) : 0;
		}

		let harmRemain = harm;
		// if not perice shield, need take out shield first
		if (!this._isPericeShield) {
			harmRemain = harm - targetAttr.shield;
			// if shield can counteract all harm
			if (harmRemain <= 0) {
				targetAttr.shield = -harmRemain;
				return hurtResult;
			}
			// if shield can not counteract all harm
			targetAttr.shield = 0;
		}

		// harm to hp
		let newTargetHp = targetAttr.hp - harmRemain;
		targetAttr.hp = newTargetHp;

		return hurtResult;
	}

	private static fullNewAttrToResult(
		hurtResult: HurtResult,
		char: Character,
	): HurtResult {
		let newAttr = char.mAttr;
		hurtResult.hpNew = newAttr.hp;
		hurtResult.aliveNew = char.alive;
		hurtResult.shieldNew = newAttr.shield;
		hurtResult.isInBattleNew = char.isInBattle;
		return hurtResult;
	}

	private static fullOldAttrToResult(
		hurtResult: HurtResult,
		char: Character
	): HurtResult {
		let oldAttr = char.mAttr;
		hurtResult.hpOld = oldAttr.hp;
		hurtResult.aliveOld = char.alive;
		hurtResult.shieldOld = oldAttr.shield;
		hurtResult.isInBattleOld = char.isInBattle;
		return hurtResult;
	}

	// 对血量护盾复活死亡排除出游戏进行表现
	private static statePerformance(change: HurtResult) {
		let target = change.targetChar;
		if (change.shieldNew != change.shieldOld) {
			target.nextPerf(
				{
					pType: PType.ShieldBar,
					param: {
						shieldOld: change.shieldOld,
						shieldNew: change.shieldNew
					}
				}
			);
		}

		if (change.hpOld != change.hpNew) {
			target.nextPerf(
				{ 
					pType: PType.LifeBar, 
					param: {
						hpNew: change.hpNew,
						hpOld: change.hpOld
					} 
				}
			);
		}
		if (change.isInBattleOld && !change.isInBattleNew) {
			// if die
			target.nextPerf({ pType: PType.Die });
		}
		if (change.isInBattleNew && !change.isInBattleOld) {
			target.nextPerf({ pType: PType.Resurgence });
		}
		if (change.isInBattleOld && !change.isInBattleNew) {
			target.nextPerf({ pType: PType.RemoveFromBattle });
		}
	}
}

/**
 * 伤害类型
 * 治疗生命于增加护盾必须于abs类型的伤害一起使用
 */
enum HurtType {
	Pysic,// 物理伤害
	Magic, // 魔法伤害
	HealHp, // 治疗生命
	HealShield // 增加护盾
}

class HurtResult {
	targetChar: Character;
	fromChar: Character;
	shieldOld: number;
	shieldNew: number;
	hpOld: number;
	hpNew: number;
	aliveNew: boolean;
	aliveOld: boolean;
	isInBattleNew: boolean;
	isInBattleOld: boolean;
}