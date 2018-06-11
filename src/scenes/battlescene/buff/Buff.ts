class Buff {
	// buff info
	// normal info
	private _id: number;
	public get id(): number { return this._id; }
	private _buffName: string;
	public get buffName(): string { return this._buffName; }
	private _iconName: string;
	private _isHide: boolean; // 是否是隐藏buff
	private _description: string;
	public get description(): string { return this._description; }
	public get isHide(): boolean { return this._isHide; }
	private _isPositive: boolean; // 是否正面效果
	public get isPositive(): boolean { return this._isPositive; }
	private _maxLayer: number;  // 最大叠加层数
	private _layId: number; // 叠加id，相同的叠加id在一起计算maxLayer
	public get layId(): number { return this._layId; }
	private _isDeadRemove: boolean; // 是否对象死亡时移除
	private _initialRemainRound: number; // 初始剩余回合, -1为无限
	// attr benifit
	private _attrsAdd: number[];	// 属性加成
	private _attrsMul: number[];	// 属性加成
	// state
	private _isDiz: boolean;// 是否眩晕
	public get isDiz(): boolean { return this._isDiz; }
	private _isSlience: boolean;// 是否沉默
	public get isSlience(): boolean { return this._isSlience; }
	private _isUnarm: boolean; // 是否无法攻击
	public get isUnarm(): boolean { return this._isUnarm; }
	// affect
	private _isAffect: boolean; // 是否具有结算效果
	private _maxAffectTime: number; // 最大生效次数
	private _affectPhase: BuffAffectPhase; // 结算时机（条件）
	private _affectHurtId: number; // affect使用hurt来结算
	// affect condition
	// 如果结算条件是某buff叠加至xx生效时有效，代表该角色
	public _affectCaseBuffTargetType: AffectCaseBuffTargetType;
	public _affectCaseBuffId: number;// 如果结算条件是某buff叠加至xx生效时有效，代表该buff
	public _affectCaseBuffLayer: number; // 层数
	// info end

	// other info
	private _exType: BuffExTy; // buff外在类型
	public get exType(): BuffExTy { return this._exType; }

	// realtime
	public mChar: Character;// belong to 
	public mLayer: number; //层数
	public mRemainRound: number; // 剩余回合数，默认在归属单位的结束回合阶段--，-1表示无限
	public mRemainAffectTime: number; // 剩余结算次数，-1为无限

	public constructor() {
		this._attrsAdd = Object.create(Attribute.AttrsTemplate);
		this._attrsMul = Object.create(Attribute.AttrsTemplate);
		// TODO: 待删除的测试数据
		this._buffName = "狂暴";
		this._description = "增加10点ap，每回合对自己造成5点治愈"
		this._attrsAdd[AttrName.Ap] = 10;
		this._attrsAdd[AttrName.PysDamageReduceAbs] = 4;
		this._isAffect = true;
		this.mRemainAffectTime = 2;
		this._affectPhase = BuffAffectPhase.TargetRoundStart;
		// this.affectHurt
		this.mRemainRound = -1;
	}

	public initial(): void {

	}


	public attachToChar(target: Character): void {
		// 如果叠加层数到上限，且没有相同id的buff就return
		// 如果存在相同id，该buff刷新一下时间
		let allBuff = target.mPassiveSkills.concat(target.mBuffs).concat(target.mHideBuffs);
		let sameBuff: Buff;
		let buffLayNum = 0;
		for (let buff of allBuff) {
			if (buff._layId == this._layId) {
				buffLayNum += buff.mLayer;
			}
			if (buff._id == this._id) {
				sameBuff = buff;
			}
		}
		if (sameBuff) {
			sameBuff.mRemainRound = this.mRemainRound;
			sameBuff.mRemainAffectTime = this.mRemainAffectTime;
		}
		// 如果到了上限
		if (buffLayNum >= this._maxLayer) {
			return;
		}

		// add attr
		let attrAdd = this._attrsAdd;
		let attrMul = this._attrsMul;
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

		// if have same buff id
		if (sameBuff) {
			sameBuff.mLayer += 1;
			return;
		}

		// if not have same id
		this.mChar = target;
		if (this._isHide) {
			target.mHideBuffs.push(this);
		}
		if (this._isPassive) {
			target.mPassiveSkills.push(this);
		}
		if (this.isNormal) {
			target.mBuffs.push(this);
			this.buffIcon = new egret.Bitmap(RES.getRes("bufficontest_png"));
			let index = target.mBuffs.indexOf(this);
			target.mBuffLine.addChild(this.buffIcon);
			this.adjustIconPosition();
		}


		// TODO: if have effect, listen affect affectPhase
		if (this._isAffect) {
			if (this._affectPhase == BuffAffectPhase.TargetRoundStart) {
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

	public release(): void {
		this.uninitial();
	}

	public uninitial(): void { }


	public affect() {
		if (this.mChar == null) {
			return;
		}
		if (this.mRemainAffectTime > 0) {
			this.mRemainAffectTime = this.mRemainAffectTime - 1;
		}
		this.affectHurt.rate *= this.mLayer;
		this.affectHurt.affect(this.mChar);
		this.affectHurt.rate /= this.mLayer;
		// if affect times is 0
		if (this.mRemainAffectTime == 0) {
			this.removeFromChar();
		}
	}

	/**
	 * 场景清空的时候也要调用该方法来保证资源释放
	 */
	public removeFromChar() {
		if (this.mChar == null) {
			// 如果附加到的对象为空，说明已经被移除过了
			return;
		}
		// 去除属性
		let attrAdd = this._attrsAdd;
		let attrMul = this._attrsMul;
		let target = this.mChar;
		let targetAttr = target.attr;
		for (let attrId in attrAdd) {
			let index = parseInt(attrId);
			if (attrAdd[index] > 0) {
				targetAttr.setAttrAddition(index, -attrAdd[attrId] * this.mLayer, AttrAdditionType.ADD);
			}
		}

		for (let attrId in attrMul) {
			let index = parseInt(attrId);
			if (attrMul[index] > 0) {
				targetAttr.setAttrAddition(index, -attrMul[attrId] * this.mLayer, AttrAdditionType.MUL);
			}
		}
		if (this.isNormal == true) {
			let buffs = this.mChar.mBuffs;
			target.mBuffLine.removeChild(this.buffIcon);
			Util.removeObjFromArray(buffs, this);
			for (let buff of buffs) {
				buff.adjustIconPosition();
			}
		} else if (this._isPassive == true) {
			Util.removeObjFromArray(target.mPassiveSkills, this);
		} else if (this._isHide == true) {
			Util.removeObjFromArray(target.mHideBuffs, this);
		}

		// TODO: remove listen
		if (this._isAffect) {
			if (this._affectPhase == BuffAffectPhase.TargetRoundStart) {
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
		this.mChar = null;
		this.buffIcon = null;
		(SceneManager.Ins.curScene as BattleScene).mBuffManager.recycle(this);
	}

	public onCharStartPhase() {
		if (this._isAffect && this._affectPhase == BuffAffectPhase.TargetRoundStart) {
			this.affect();
		}
	}

	public onCharEndPhase() {
		if (this.mRemainRound > 0) {
			this.mRemainRound--;
		}
		if (this.mRemainRound == 0) {
			this.removeFromChar();
		}
	}

	public adjustIconPosition() {
		let buffs = this.mChar.mBuffs;
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

enum BuffExTy {
	HideBuff,
	NormalBuff,
	PassvieSkill
}