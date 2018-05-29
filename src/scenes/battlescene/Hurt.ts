/**
 * 表示一个伤害或治疗效果
 */
class Hurt {
	private hurtType: HurtType; // 伤害类型（物理/魔法/治疗生命/增加护盾）
	private fromChar: Character; // 伤害来源
	public rate: number; // 伤害倍率
	private isAbs: boolean; // 是否绝对伤害（不考虑护甲）
	private absValue: number;// 绝对伤害对应的值是多少
	private isPericeShield: boolean;// 是否穿透护盾（无视护盾，直接伤血）  治疗效果时无效
	private isDoubleShield: boolean;// 是否破盾（对有护盾的单位造成双倍伤害） 治疗效果时无效
	private isResurgence: boolean;// 是否复活 （仅治愈生命类型有效）
	public isRemoveFromGameWhenDie: boolean;// 是否死亡移除游戏
	public isRemoveFromGame: boolean; //是否直接移除游戏

	public constructor(
		hurtType: HurtType,
		fromChar: Character = null,
		rate: number = 1,
		isAbs: boolean = false,
		absValue: number = 10,
		isPericeShield: boolean = false,
		isDoubleShield: boolean = false,
		isResurgence: boolean = false
	) {
		this.fromChar = fromChar;
		this.hurtType = hurtType;
		this.rate = rate;
		this.isAbs = isAbs;
		this.absValue = absValue;
		this.isPericeShield = isPericeShield;
		this.isDoubleShield = isDoubleShield;
		this.isResurgence = isResurgence;
	}

	public affect(target: Character) {
		let aliveBefore = target.alive;
		let change = this.affectWithoutPerm(target);;
		if (!change.aliveNew && this.isRemoveFromGameWhenDie) {
			target.isInBattle = false;
			change.isInBattleNew = false;
		}
		if (this.isRemoveFromGame) {
			target.isInBattle = false;
			change.isInBattleNew = false;
		}
		let scene = SceneManager.Ins.curScene as BattleScene;
		scene.performQue.push([
			{ performance: Hurt.statePerformance },
			change
		]);
		// 移除buff
		if (!target.alive) {
			for (let buff of target.buffs.concat(target.hideBuffs
			).concat(target.passiveSkills)) {
				if (buff.isDeadRemove) {
					buff.removeFromChar();
				}
			}
		}

		if (!target.isInBattle) {
			for (let buff of target.buffs.concat(target.hideBuffs
			).concat(target.passiveSkills)) {
				buff.removeFromChar();
			}
		}

		scene.judge();
		scene.performStart();
	}

	/**
	 * 施加伤害，返回收到影响的属性列表
	 */
	public affectWithoutPerm(target: Character): IAttrChange {

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
		if (this.isAbs) {
			harm = this.absValue;
		} else {
			let fromAttr = this.fromChar.attr;
			if (this.hurtType == HurtType.Pysic || this.hurtType == HurtType.Magic) {
				let ar = this.hurtType == HurtType.Pysic ? targetAttr.arPys : targetAttr.arMagic;
				ar -= fromAttr.pierceAr;
				ar = ar > 0 ? ar : 0;
				harm = fromAttr.ap - ar;
				harm = harm > 0 ? harm : (fromAttr.ap / 10);
			}
			else if (this.hurtType == HurtType.HealHp || this.hurtType == HurtType.HealShield) {
				harm = fromAttr.ap;
			}
		}

		// 处理倍率
		harm *= this.rate;
		harm = Math.floor(harm);

		let isAliveChange = false;
		// 处理治疗生命
		if (this.hurtType == HurtType.HealHp && (target.alive || this.isResurgence)) {
			isAliveChange = !target.alive;
			let newHp = targetAttr.hp + harm;
			newHp = newHp > targetAttr.maxHp ? targetAttr.maxHp : newHp;
			let healValue = newHp - targetAttr.hp;
			targetAttr.hp = newHp;
			mm.sendMessage(
				MessageType.HealHp,
				[this.fromChar, target, healValue]
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
		if (this.hurtType == HurtType.HealShield) {
			let newShield = targetAttr.shield + harm;
			newShield = newShield > targetAttr.maxShield ? targetAttr.maxShield : newShield;
			let healValue = newShield - targetAttr.shield;
			targetAttr.shield = newShield;
			mm.sendMessage(
				MessageType.HealShield,
				[this.fromChar, target, healValue]
			);
			return Hurt.fullNewAttrToChange(changeInfo, target);
		}

		// 处理破盾
		if (targetAttr.shield > 0 && this.isDoubleShield) {
			harm *= 2;
		}

		// 处理最终增伤
		if (this.hurtType == HurtType.Magic) {
			harm = harm - targetAttr.magicDamageReduceAbs;
			harm = harm > 0 ? harm : 0;
			harm = harm * (1 - targetAttr.magicDamageReducePerc)
			harm = harm > 0 ? Math.ceil(harm) : 0;
		} else if (this.hurtType == HurtType.Pysic) {
			harm = harm - targetAttr.pysDamageReduceAbs;
			harm = harm > 0 ? harm : 0;
			harm = harm * (1 - targetAttr.pysDamageReducePerc)
			harm = harm > 0 ? Math.ceil(harm) : 0;
		}

		// 处理非穿盾
		let harmRemain = harm;
		if (!this.isPericeShield) {
			harmRemain = harm - targetAttr.shield;
			if (harmRemain <= 0) {
				targetAttr.shield = -harmRemain;
				mm.sendMessage(
					MessageType.HarmShield,
					[this.fromChar, target, harm]
				);
				return Hurt.fullNewAttrToChange(changeInfo, target);
			}
			mm.sendMessage(
				MessageType.HarmShield,
				[this.fromChar, target, targetAttr.shield]
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
			[this.fromChar, target, targetAttr.hp - newTargetHp]
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
	public static statePerformance(change: IAttrChange) {
		(SceneManager.Ins.curScene as BattleScene).onePerformEnd();
		let damageFloatManage = (SceneManager.Ins.curScene as BattleScene).damageFloatManager;
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
						(SceneManager.Ins.curScene as BattleScene).filterManager.addGreyFilter(target.armatureDisplay);
					}
					if (change.isInBattleNew == false) {
						// 如果扣血后移除
						Hurt.removeFromGamePerform(target);
					}
				}
			);
			// 飘字
			damageFloatManage.newFloat(target, change.hpOld, change.hpNew, "生命");
		} else if (change.isInBattleNew == false) {
			// 如果直接被排除出游戏
			Hurt.removeFromGamePerform(target);
		}
	}

	private static removeFromGamePerform(target: Character) {
		egret.Tween.get(target.armatureDisplay).to({
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