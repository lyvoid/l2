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
		fromChar: Character = null,
		rate: number = 1,
		isAbs: boolean = false,
		absValue: number = 10,
		isPericeShield: boolean = false,
		isDoubleShield: boolean = false,
		isResurgence: boolean = false,
		isRemoveFromGame: boolean = false,
		isRemoveFromGameWhenDie: boolean = false
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
		this._fromChar = null;
	}

	private affectNoReCycle(target: Character) {
		let aliveBefore = target.alive;
		let change = this.affectWithoutPerfrom(target);;
		if (!change.aliveNew && this._isRemoveFromGameWhenDie) {
			target.isInBattle = false;
			change.isInBattleNew = false;
		}
		if (this._isRemoveFromGame) {
			target.isInBattle = false;
			change.isInBattleNew = false;
		}
		let scene = SceneManager.Ins.curScene as BattleScene;
		scene.mPerformQueue.push({ performance: () => Hurt.statePerformance(change) });
		// 移除buff
		if (!target.isInBattle) {
			for (let buff of target.mBuffs.concat(target.mHideBuffs
			).concat(target.mPassiveSkills)) {
				buff.removeFromChar();
			}
		} else if (!target.alive) {
			for (let buff of target.mBuffs.concat(target.mHideBuffs
			).concat(target.mPassiveSkills)) {
				if (buff.isDeadRemove) {
					buff.removeFromChar();
				}
			}
		}

		scene.judge();
		scene.performStart();
	}

	public affect(target: Character): void {
		this.affectNoReCycle(target);
		let scene = SceneManager.Ins.curScene as BattleScene;
		scene.mHurtManager.recycle(this);
	}

	/**
	 * 施加伤害，返回收到影响的属性列表
	 */
	public affectWithoutPerfrom(target: Character): IAttrChange {

		let mm = MessageManager.Ins;

		let targetAttr = target.attr;
		let harm = 0;

		let changeInfo: IAttrChange = {
			char: target,
			shieldOld: targetAttr.shield,
			shieldNew: 0,
			hpOld: targetAttr.hp,
			hpNew: 0,
			aliveOld: target.alive,
			aliveNew: false,
			isInBattleOld: target.isInBattle,
			isInBattleNew: target.isInBattle
		};

		// 处理护甲
		if (this._isAbs) {
			harm = this._absValue;
		} else {
			let fromAttr = this._fromChar.attr;
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

		// 处理倍率
		harm *= this._rate;
		harm = Math.floor(harm);

		let isAliveChange = false;
		// 处理治疗生命
		if (this._hurtType == HurtType.HealHp && (target.alive || this._isResurgence)) {
			isAliveChange = !target.alive;
			let newHp = targetAttr.hp + harm;
			newHp = newHp > targetAttr.maxHp ? targetAttr.maxHp : newHp;
			let healValue = newHp - targetAttr.hp;
			targetAttr.hp = newHp;
			mm.sendMessage(
				MessageType.HealHp,
				[this._fromChar, target, healValue]
			);

			// 发送复活信息
			if (isAliveChange) {
				mm.sendMessage(
					MessageType.Resurgence,
					target
				);
			}

			return Hurt.fullNewAttrToChange(changeInfo, target);
		}

		// 非治疗状态下，对已死亡单位无效
		if (!target.alive) {
			return Hurt.fullNewAttrToChange(changeInfo, target);
		}

		// 处理增加护盾
		if (this._hurtType == HurtType.HealShield) {
			let newShield = targetAttr.shield + harm;
			newShield = newShield > targetAttr.maxShield ? targetAttr.maxShield : newShield;
			let healValue = newShield - targetAttr.shield;
			targetAttr.shield = newShield;
			mm.sendMessage(
				MessageType.HealShield,
				[this._fromChar, target, healValue]
			);
			return Hurt.fullNewAttrToChange(changeInfo, target);
		}

		// 处理破盾
		if (targetAttr.shield > 0 && this._isDoubleShield) {
			harm *= 2;
		}

		// 处理最终增伤
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

		// 处理非穿盾
		let harmRemain = harm;
		if (!this._isPericeShield) {
			harmRemain = harm - targetAttr.shield;
			if (harmRemain <= 0) {
				targetAttr.shield = -harmRemain;
				mm.sendMessage(
					MessageType.HarmShield,
					[this._fromChar, target, harm]
				);
				return Hurt.fullNewAttrToChange(changeInfo, target);
			}
			mm.sendMessage(
				MessageType.HarmShield,
				[this._fromChar, target, targetAttr.shield]
			);
			targetAttr.shield = 0;

		}

		// 伤害到hp
		let newTargetHp = targetAttr.hp - harmRemain;
		// 生命归零，角色死亡
		if (newTargetHp <= 0) {
			newTargetHp = 0;
			isAliveChange = true;
			// 如果死亡那么shield也要归0
			targetAttr.shield = 0;
			// 发送角色死亡消息
			mm.sendMessage(
				MessageType.CharDie,
				target
			);
		}
		mm.sendMessage(
			MessageType.HarmHp,
			[this._fromChar, target, targetAttr.hp - newTargetHp]
		);
		targetAttr.hp = newTargetHp;
		return Hurt.fullNewAttrToChange(changeInfo, target);

	}

	/**
	 * 辅助函数，把char中的属性填充到attrChange中
	 */
	private static fullNewAttrToChange(
		attrChange: IAttrChange,
		char: Character
	): IAttrChange {
		let newAttr = char.attr;
		attrChange.hpNew = newAttr.hp;
		attrChange.aliveNew = char.alive;
		attrChange.shieldNew = newAttr.shield;
		return attrChange;
	}

	/**
	 * 状态表现
	 * 对血量护盾复活死亡排除出游戏进行表现
	 */
	private static statePerformance(change: IAttrChange) {
		(SceneManager.Ins.curScene as BattleScene).onePerformEnd();
		let damageFloatManage = (SceneManager.Ins.curScene as BattleScene).mDamageFloatManager;
		let target = change.char;
		if (change.shieldNew != change.shieldOld) {
			target.lifeBarShieldAnim(change.shieldNew);
			damageFloatManage.newFloat(target, change.shieldOld, change.shieldNew, "护盾");
		}

		if (change.hpOld != change.hpNew) {
			target.lifeBarAnim(change.hpNew).call(
				// 血条变化完之后如果此次人物还死亡了的话
				() => {
					if (change.aliveNew != change.aliveOld && !change.aliveNew) {
						target.stopDBAnim();
						(SceneManager.Ins.curScene as BattleScene).mFilterManager.addGreyFilter(target.mArmatureDisplay);
					}
					if (change.isInBattleNew == false) {
						// 如果扣血后移除
						Hurt.removeFromGamePerform(target);
					}
				}
			);
			// 飘字
			damageFloatManage.newFloat(target, change.hpOld, change.hpNew, "生命");
		} else if (change.isInBattleOld && !change.isInBattleNew) {
			// 如果直接被排除出游戏
			Hurt.removeFromGamePerform(target);
		}
	}

	private static removeFromGamePerform(target: Character) {
		egret.Tween.get(target.mArmatureDisplay).to({
			alpha: 0
		}, 1000).call(
			() => {
				target.parent.removeChild(target);
			}
			);
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