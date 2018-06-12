class Buff {
	// buff info
	// normal info
	private _id: number;
	public get id(): number { return this._id; }
	private _buffName: string;
	public get buffName(): string { return this._buffName; }
	private _iconName: string;
	private _description: string;
	public get description(): string { return this._description; }
	private _isPositive: boolean; // 是否正面效果
	public get isPositive(): boolean { return this._isPositive; }
	private _maxLayer: number;  // 最大叠加层数
	private _layId: number; // 叠加id，相同的叠加id在一起计算maxLayer
	public get layId(): number { return this._layId; }
	private _isDeadRemove: boolean; // 是否对象死亡时移除
	public get isDeadRemove(): boolean { return this._isDeadRemove; }
	private _initialRemainRound: number; // 初始剩余回合, -1为无限
	private _exType: BuffExTy; // buff外在类型，隐藏buff/普通buff/被动技能
	public get exType(): BuffExTy { return this._exType; }
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
	private _affectSkillId: number; // 触发一个技能
	// affect condition
	// 如果结算条件是某buff叠加至xx生效时有效，代表该角色
	public _affectCaseBuffTargetType: AffectCaseBuffTargetType;
	public _affectCaseBuffId: number;// 如果结算条件是某buff叠加至xx生效时有效，代表该buff
	public _affectCaseBuffLayer: number; // 层数

	// realtime
	public mChar: Character;// buff归属单位
	public mRemainRound: number; // 剩余回合数，默认在归属单位的结束回合阶段--，-1表示无限
	public mRemainAffectTime: number; // 剩余结算次数，-1为无限
	public mAttachRound: number;// 上buff的回合，如果buff达到最大上限，挤掉最早加的那个
	private _scene: BattleScene;
	public mIconBitMap: egret.Bitmap;

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

	public initial(
		id: number,
		buffName: string,
		iconName: string,
		description: string,
		isPos: boolean,
		maxLayer: number,
		layId: number,
		isDeadRemove: boolean,
		initRemRound: number,
		exType: BuffExTy,
		attrsAdd: number[],
		attrsMul: number[],
		isDiz: boolean,
		isSlience: boolean,
		isUnarm: boolean,
		isAffect: boolean,
		maxAffectTime: number,
		affectPhase: BuffAffectPhase,
		affectHurtId: number,
		affCasBufTargTy: AffectCaseBuffTargetType,
		affCasBufId: number,
		affCasBufLay: number
	): void {
		// buff info
		this._id = id;
		this._buffName = buffName;
		this._description = description;
		this._iconName = iconName;
		this._isPositive = isPos;
		this._maxLayer = maxLayer;
		this._layId = layId;
		this._isDeadRemove = isDeadRemove;
		this._initialRemainRound = initRemRound;
		this._exType = exType;
		this._attrsAdd = attrsAdd;
		this._attrsMul = attrsMul;
		this._isDiz = isDiz;
		this._isSlience = isSlience;
		this._isUnarm = isUnarm;
		this._isAffect = isAffect;
		this._maxAffectTime = maxAffectTime;
		this._affectPhase = affectPhase;
		this._affectHurtId = affectHurtId;
		this._affectCaseBuffId = affCasBufId;
		this._affectCaseBuffTargetType = affCasBufTargTy;
		this._affectCaseBuffLayer = affCasBufLay;
		// realtime
		this.mRemainRound = initRemRound;
		this.mRemainAffectTime = maxAffectTime;
		this._scene = SceneManager.Ins.curScene as BattleScene;
	}


	public attachToChar(target: Character): void {
		// 如果叠加层数到上限，删除最早的那个buff
		let allBuff = target.mPassiveSkills.concat(target.mBuffs).concat(target.mHideBuffs);
		let sameLayBuffs: Buff[] = [];
		let earliestSameBuf: Buff;
		let buffLayNum = 0;
		let earliestRound = 0;
		for (let buff of allBuff) {
			if (buff._layId == this._layId) {
				buffLayNum++;
				sameLayBuffs.push(buff);
				if (buff.mAttachRound > earliestRound) {
					earliestRound = buff.mAttachRound;
					earliestSameBuf = buff;
				}
			}
		}

		// 如果到了上限，删除最早的buff
		if (buffLayNum >= this._maxLayer) {
			earliestSameBuf.removeFromChar();
		}

		// add buff to target
		switch (this._exType) {
			case BuffExTy.HideBuff:
				target.mHideBuffs.push(this);
				break;
			case BuffExTy.PassvieSkill:
				target.mPassiveSkills.push(this);
				break;
			case BuffExTy.NormalBuff:
				target.mBuffs.push(this);
				// this.mIconBitMap = new egret.Bitmap(RES.getRes("bufficontest_png"));
				this.mIconBitMap = new egret.Bitmap(RES.getRes(this._iconName));
				// 调整targetbuff栏的位置
				target.adjustBuffIconPos();
				break;
		}

		this.mChar = target;
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
		// TODO: remove listen
		if (this._isAffect) {
			if (this._affectPhase == BuffAffectPhase.TargetRoundStart) {
				let eType = MessageType.PlayerRoundStart;
				if (this.mChar.camp == CharCamp.Enemy) {
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
		this._scene = null;
		this.mIconBitMap = null;
	}


	public affect() {
		if (this.mRemainAffectTime > 0) {
			this.mRemainAffectTime = this.mRemainAffectTime - 1;
		}
		if (this._affectHurtId != 0){
		let hurt = this._scene.mHurtManager.newHurt(this._affectHurtId);
		hurt.affect(this.mChar);
		}
		if (this._affectSkillId != 0) {
			let skill = this._scene.mManualSkillManager.newSkill(
				this._affectSkillId, 
				this.mChar
			);
			skill.cast();
		}
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
			console.log(`buff已经被移除过了,buffid: ${this.id}`);
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
				targetAttr.setAttrAddition(index, -attrAdd[attrId], AttrAdditionType.ADD);
			}
		}

		for (let attrId in attrMul) {
			let index = parseInt(attrId);
			if (attrMul[index] > 0) {
				targetAttr.setAttrAddition(index, -attrMul[attrId], AttrAdditionType.MUL);
			}
		}

		// remove from target
		switch (this._exType) {
			case BuffExTy.HideBuff:
				Util.removeObjFromArray(target.mHideBuffs, this);
				break;
			case BuffExTy.NormalBuff:
				let buffs = this.mChar.mBuffs;
				Util.removeObjFromArray(buffs, this);
				target.adjustBuffIconPos();
				break;
			case BuffExTy.PassvieSkill:
				Util.removeObjFromArray(target.mPassiveSkills, this);
				break;
		}
		this._scene.mBuffManager.recycle(this);
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
	HideBuff,//隐藏buff，一般用来出发某些特定效果时用于计数（玩家看不到的
	NormalBuff,//常规buff（玩家可以看到
	PassvieSkill//被动buff（被动技能也通过buff机制来实现
}