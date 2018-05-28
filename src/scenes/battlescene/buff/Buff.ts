class Buff {
	public constructor() {
		this.attrsAdd = Object.create(Attribute.AttrsTemplate);
		this.attrsMul = Object.create(Attribute.AttrsTemplate);
		// TODO: 待删除的测试数据
		this.buffName = "狂暴";
		this.desc = "增加10点ap，每回合对自己造成10点伤害"
		this.isAffect = true;
		this.remainAffectTime = 2;
		this.affectPhase = BuffAffectPhase.TargetRoundStart;
		this.affectHurt = new Hurt(HurtType.Pysic, this.char, 2, true, 10);
		this.remainRound = 2;
	}

	// buff归属
	public char: Character;

	// buff属性
	public id: number;
	public buffName: string;
	public buffIcon: egret.Bitmap;
	public desc: string;
	public layer: number = 1; //层数
	public isHide: boolean = false; // 是否是隐藏buff
	public isPassive: boolean = false; // 是否是被动
	public isNormal: boolean = true; // 是否是普通buff
	public isNegtive: boolean = false; // 是否是负面效果
	public maxLayer: number = 1;  // 最大得加层数
	public layId: number = 0;// 叠加id，相同的叠加id在一起计算maxLayer
	public remainRound: number = -1; // 剩余回合数，默认在归属单位的结束回合阶段--，-1表示无限
	// 属性加成
	public attrsAdd: number[];
	public attrsMul: number[];

	// 状态
	public isDiz: boolean = false;// 是否眩晕

	// 结算时机
	public isAffect: boolean = false; // 是否具有结算效果
	public remainAffectTime: number = -1; // 剩余结算次数，-1为无限
	public affectPhase: BuffAffectPhase; // 结算时机（条件）
	// 如果结算条件是某buff叠加至xx生效时有效，代表该角色
	public affectCaseBuffTargetType: AffectCaseBuffTargetType;
	public affectCaseBuffId: number;// 如果结算条件是某buff叠加至xx生效时有效，代表该buff
	public affectCaseBuffLayer: number; // 层数


	// 结算内容（走hurt
	public affectHurt: Hurt;


	public attachToChar(target: Character): void {
		// 如果叠加层数到上限，且没有相同id的buff就return
		// 如果存在相同id，该buff刷新一下时间
		let allBuff = target.passiveSkills.concat(target.buffs).concat(target.hideBuffs);
		let sameBuff: Buff;
		let buffLayNum = 0;
		for (let buff of allBuff) {
			if (buff.layId == this.layId) {
				buffLayNum += buff.layer;
			}
			if (buff.id == this.id) {
				sameBuff = buff;
			}
		}
		if (buffLayNum >= this.maxLayer) {
			if (sameBuff) {
				sameBuff.remainRound = this.remainRound;
				sameBuff.remainAffectTime = this.remainAffectTime;
			}
			return;
		}

		// 如果存在相同buff id 同时没到上限
		if (sameBuff) {
			sameBuff.layer += 1;
		} else {
			// 给target上buff
			this.char = target;
			if (this.isHide) {
				target.hideBuffs.push(this);
			}
			if (this.isPassive) {
				target.passiveSkills.push(this);
			}
			if (this.isNormal) {
				target.buffs.push(this);
				this.buffIcon = new egret.Bitmap(RES.getRes("bufficontest_png"));
				let index = target.buffs.indexOf(this);
				target.buffLine.addChild(this.buffIcon);
				this.adjustIconPosition();
			}
		}

		// 增加属性
		let attrAdd = this.attrsAdd;
		let attrMul = this.attrsMul;
		let targetAttr = target.attr;
		for (let attrId in attrAdd) {
			let index = parseInt(attrId);
			if (attrAdd[index] > 0) {
				targetAttr.setAttrAddition(index, attrAdd[attrId], AttrAdditionType.ADD);
			}
		}
		for (let attrId in attrMul) {
			let index = parseInt(attrId);
			if (attrMul[index] > 0) {
				targetAttr.setAttrAddition(index, attrMul[attrId], AttrAdditionType.MUL);
			}
		}

		// TODO: if have effect, listen affect affectPhase
		if (this.isAffect) {
			if (this.affectPhase == BuffAffectPhase.TargetRoundStart) {
				let eType = MessageType.PlayerRoundStart;
				if (target.camp == CharCamp.Enemy) {
					eType = MessageType.EnemyRoundStart;
				}
				MessageManager.Ins.addEventListener(
					eType,
					this.affect,
					this
				);
			}
		}
	}


	public affect() {
		if (this.remainAffectTime > 0) {
			this.remainAffectTime = this.remainAffectTime - 1;
		}
		(SceneManager.Ins.curScene as BattleScene).performQue.push( 
			[{
				performance: IManualSkill.statePerformance
			},
			this.affectHurt.affect(this.char)]
		);
		(SceneManager.Ins.curScene as BattleScene).performStart();
		// if affect times is 0
		if (this.remainAffectTime == 0) {
			this.removeFromChar();
		}
	}

	/**
	 * 场景清空的时候也要调用该方法来保证资源释放
	 */
	public removeFromChar() {
		// 去除属性
		let attrAdd = this.attrsAdd;
		let attrMul = this.attrsMul;
		let target = this.char;
		let targetAttr = target.attr;
		for (let attrId in attrAdd) {
			let index = parseInt(attrId);
			if (attrAdd[index] > 0) {
				targetAttr.setAttrAddition(index, -attrAdd[attrId] * this.layer, AttrAdditionType.ADD);
			}
		}

		for (let attrId in attrMul) {
			let index = parseInt(attrId);
			if (attrMul[index] > 0) {
				targetAttr.setAttrAddition(index, -attrMul[attrId] * this.layer, AttrAdditionType.MUL);
			}
		}
		if (this.isNormal == true) {
			let buffs = this.char.buffs;
			target.buffLine.removeChild(this.buffIcon);
			Util.deleteObjFromList(buffs, this);
			for (let buff of buffs) {
				buff.adjustIconPosition();
			}
		} else if (this.isPassive == true) {
			Util.deleteObjFromList(target.passiveSkills, this);
		} else if (this.isHide == true) {
			Util.deleteObjFromList(target.hideBuffs, this);
		}

		// TODO: remove listen
		if (this.isAffect) {
			if (this.affectPhase == BuffAffectPhase.TargetRoundStart) {
				let eType = MessageType.PlayerRoundStart;
				if (target.camp == CharCamp.Enemy) {
					eType = MessageType.EnemyRoundStart;
				}
				MessageManager.Ins.removeEventListener(
					eType,
					this.affect,
					this
				);
			}
		}

		this.char = null;
		this.buffIcon = null;
	}

	public onCharStartPhase() {
		if (this.isAffect && this.affectPhase == BuffAffectPhase.TargetRoundStart) {
			this.affect();
		}
	}

	public onCharEndPhase() {
		if (this.remainRound > 0) {
			this.remainRound--;
		}
		if (this.remainRound == 0) {
			this.removeFromChar();
		}
	}

	public adjustIconPosition() {
		let buffs = this.char.buffs;
		let index = buffs.indexOf(this);
		this.buffIcon.x = index * 12;
	}

}

enum BuffAffectPhase {
	TargetRoundStart,// 目标开始时自动发生效果，最常规的发出时机
	BuffLayer, // 特定目标的buff层数
	EnemyHarm, // 敌方受伤时
	SelfHarm, // 自己受伤
	FriendHarm // 队友受伤
}

enum AffectCaseBuffTargetType {
	AllFriends, // 全体友方单位做叠加
	AllEnemies, // 全体地方单位做叠加
	AnyOneFriend, // 我方任意某单位
	AnyOneEnemy, // 敌方任意某单位
	Self // 自己
}