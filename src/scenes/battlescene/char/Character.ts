class Character extends egret.DisplayObjectContainer {

	public mCharName: string = "111";
	public mFeature: string = "123123";
	public mManualSkillsId: number[];
	public mPassiveSkills: Buff[];
	public mBuffs: Buff[];
	public mHideBuffs: Buff[];
	private _isInBattle: boolean;
	private _headBar: egret.DisplayObjectContainer;
	private _lifeBarFg: egret.Bitmap;
	private _shieldBar: egret.Bitmap;
	public _buffLine: egret.DisplayObjectContainer;
	public mAttr: Attribute;
	public _bgLayer: egret.DisplayObjectContainer;// background select img or shadow
	public camp: CharCamp = CharCamp.Player;
	public col: CharColType = CharColType.frontRow;
	public row: CharRowType = CharRowType.mid;


	// real time
	private _perfQueue: { pType: PType, param?: any }[];
	public mArmatureDisplay: dragonBones.EgretArmatureDisplay;
	private _alive: boolean = true;
	public get alive(): boolean { return this._alive; }
	public set alive(inputAlive: boolean) {
		// if alive -> die
		if (!inputAlive && this._alive) {
			this._alive = false;
			// remove buff need remove
			for (let buff of this.mBuffs.concat(this.mHideBuffs
			).concat(this.mPassiveSkills)) {
				if (buff.isDeadRemove) {
					buff.removeFromChar();
				}
			}
			this.mAttr.shield = 0;
			this.mAttr.hp = 0;
		}
		this._alive = inputAlive;
	}

	public get description(): string {
		let color = "#000000";
		if (this.camp === CharCamp.Enemy) {
			color = "#EE2C2C";
		} else if (this.camp === CharCamp.Player) {
			color = "#7FFF00";
		}
		return `<b><font color="${color}">${this.mCharName}</font></b>` +
			`\n<font color="#3D3D3D" size="15">${this.mFeature}</font>\n\n${this.mAttr.toString()}`;
	}

	public get statDescription(): string {
		let passiveSkillsDesc = "";
		let buffsDesc = "";
		let skillsDesc = "";
		for (let buff of this.mPassiveSkills) {
			passiveSkillsDesc = `${passiveSkillsDesc}<font color="#7FFF00"><b>` +
				`${buff.buffName}:</b></font>${buff.description}\n`
		}

		// 统计buff层数
		let buffLayer: { [buffId: number]: number } = {};
		for (let buff of this.mBuffs) {
			if (buffLayer[buff.id]) {
				buffLayer[buff.id] += 1;
			} else {
				buffLayer[buff.id] = 1;
			}
		}

		let buffAdded: number[] = [];
		for (let buff of this.mBuffs) {
			if (buffAdded.indexOf(buff.id) >= 0) {
				continue;
			}
			buffAdded.push(buff.id);
			buffsDesc = `${buffsDesc}<font color="#7FFF00"><b>` +
				`${buff.buffName}(${buffLayer[buff.id]}层):</b></font>${buff.description}\n`
		}
		return `<font color="#EE7942"><b>被动技能</b></font>
${passiveSkillsDesc}

<font color="#EE7942"><b>当前状态</b></font>
${buffsDesc}`;
	}


	public get isInBattle(): boolean {
		return this._isInBattle;
	}

	public set isInBattle(value: boolean) {
		// 如果角色本来在游戏中但被排除出游戏
		if (this._isInBattle && (!value)) {
			let scene = SceneManager.Ins.curScene as BattleScene;
			if (this.camp == CharCamp.Player) {
				// 移除手牌中属于当前角色的牌
				scene.mCardBoard.removeCardOfChar(this);
				// 移除SkillPool中归属于该角色的技能
				let skillPools = scene.mManualSkillIdPool;
				let skillsForDelete: [number, Character][] = [];
				for (let skill of skillPools) {
					if (skill[1] == this) {
						skillsForDelete.push(skill);
					}
				}
				for (let skill of skillsForDelete) {
					Util.removeObjFromArray(skillPools, skill);
				}
			}
			// remove all buff
			for (let buff of this.mBuffs.concat(this.mHideBuffs).concat(this.mPassiveSkills)) {
				buff.removeFromChar();
			}
		}
		// 更新排除出游戏状态
		this._isInBattle = value;
	}

	public constructor(charactorName: string) {
		super();

		// 背景层
		let bg = new egret.DisplayObjectContainer();
		this._bgLayer = bg;
		this.addChild(bg);

		// 载入龙骨动画
		this.loadArmature(charactorName);

		// 加属性
		this.mAttr = new Attribute();
		this.mAttr.char = this;

		// 加血条
		let lifeBar = new egret.DisplayObjectContainer();
		lifeBar.x = -50;
		lifeBar.y = -210;
		let lifebarBg = new egret.Bitmap(RES.getRes("lifebarbg_jpg"));
		lifebarBg.alpha = 0.5;
		lifebarBg.width = 100;
		lifeBar.addChild(lifebarBg);
		let lifeBarFg = new egret.Bitmap(RES.getRes("lifebar_jpg"));
		lifeBarFg.width = 100;
		lifeBarFg.y = 1;
		lifeBar.addChild(lifeBarFg);
		this.addChild(lifeBar);
		this._headBar = lifeBar;
		this._lifeBarFg = lifeBarFg;

		// 加buff条
		let buffLine = new egret.DisplayObjectContainer();
		buffLine.y = -12;
		this._buffLine = buffLine;
		this._headBar.addChild(buffLine)

		// 加护盾条
		let shieldBar = new egret.Bitmap(RES.getRes("lifebarbg_jpg"));
		shieldBar.height = 8;
		shieldBar.y = 13;
		shieldBar.width = 80 * this.mAttr.shield / this.mAttr.maxShield;
		lifeBar.addChild(shieldBar);
		this._shieldBar = shieldBar;


		// 加技能
		this.mManualSkillsId = [1];

		// 初始化buff
		this.mPassiveSkills = [];
		this.mBuffs = [];
		this.mHideBuffs = [];

		this._isInPerf = false;
		this._isInBattle = true;
		this._perfQueue = [];
	}

	/**
	 * 播放血条动画，血条在1s内从之前的状态到达当前血量的状态
	 */
	public lifeBarAnim(newHp?: number): egret.Tween {
		if (!newHp) {
			newHp = this.mAttr.hp;
		}
		let lifeBarNewLen = 100 * newHp / this.mAttr.maxHp;
		return egret.Tween.get(this._lifeBarFg).to({
			width: lifeBarNewLen,
		}, 1000, egret.Ease.quintOut);
	}

	/**
	 * 播放shield条动画
	 */
	public lifeBarShieldAnim(newShield?: number): egret.Tween {
		if (!newShield) {
			newShield = this.mAttr.shield;
		}
		let lifeBarNewLen = 80 * newShield / this.mAttr.maxHp;
		return egret.Tween.get(this._shieldBar).to({
			width: lifeBarNewLen,
		}, 1000, egret.Ease.quintOut);
	}


	private loadArmature(charactorName: string): void {
		// 从当前场景中获取dbManager，因此在实例化charactor前
		let dbManager: DBManager = (
			SceneManager.Ins.curScene as BattleScene
		).mDbManager;

		let armatureDisplay = dbManager.getArmatureDisplay(
			charactorName);

		// 设置龙骨动画资源大小
		let demandArmatureWidth = 100;
		let demandArmatureHeight = 200;
		armatureDisplay.scaleX = demandArmatureWidth / armatureDisplay.width;
		armatureDisplay.scaleY = demandArmatureHeight / armatureDisplay.height;
		armatureDisplay.width = demandArmatureWidth;
		armatureDisplay.height = demandArmatureHeight;

		// 增加动画点击事件
		armatureDisplay.touchEnabled = true;
		armatureDisplay.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onTouchTap,
			this
		);

		// 龙骨动画添加到Character中
		this.addChild(armatureDisplay);
		this.mArmatureDisplay = armatureDisplay;

		// 绑定长按动作
		LongTouchUtil.bindLongTouch(armatureDisplay, this);

		// 绑定TouchBegin事件（发送TouchBegin消息）
		this.addEventListener(
			egret.TouchEvent.TOUCH_BEGIN,
			this.onTouchBegin,
			this
		);
	}

	/**
	 * 播放龙骨动画
	 */
	public playDBAnim(
		animationName: string,
		animationTimes: number = -1,
		animationNameBack: string = "idle"
	): void {
		if (this.mArmatureDisplay.animation.animationNames.indexOf(animationName) >= 0) {
			this.mArmatureDisplay.animation.play(animationName, animationTimes);
		} else {
			this.mArmatureDisplay.animation.play(animationNameBack, animationTimes);
		}
	}

	private onLongTouchEnd(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		LayerManager.Ins.popUpLayer.removeChild(scene.mCharInfoPopupUI);
	}

	private onLongTouchBegin(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		scene.mCharInfoPopupUI.setDescFlowText(this.description);
		scene.mCharInfoPopupUI.setSkillDescFlowText(this.statDescription);
		LayerManager.Ins.popUpLayer.addChild(scene.mCharInfoPopupUI);
	}

	/**
	 * 停止龙骨动画
	 */
	public stopDBAnim() {
		this.mArmatureDisplay.animation.stop();
	}

	// 点击的时候播放外发光滤镜动画
	private onTouchBegin(): void {
		(SceneManager.Ins.curScene as BattleScene).mFilterManager.setOutGlowHolderWithAnim(this.mArmatureDisplay);
	}

	/**
	 * 点击时触发
	 * 将选中框移动到该角色的bgLayer中，
	 * 同时将scene下的selectEnemy及Friend调整为合适的对象
	 */
	private onTouchTap(): void {
		this.setAsSelect();
	}

	// /**
	//  * 隐藏生命条
	//  */
	// public lifeBarHide(): void {
	// 	this._headBar.visible = false;
	// }

	// /**
	//  * 显示生命条
	//  */
	// public lifeBarShow(): void {
	// 	this._headBar.visible = true;
	// }

	// /**
	//  * 生命条开始闪烁
	//  */
	// public lifeBarBlink(): void {
	// 	egret.Tween.get(
	// 		this._headBar,
	// 		{ loop: true }
	// 	).to(
	// 		{ alpha: 0 }, 300
	// 		).to({ alpha: 1 }, 300);
	// }

	// /**
	//  * 停止生命条闪烁
	//  */
	// public lifeBarUnBlink(): void {
	// 	egret.Tween.removeTweens(this._headBar);
	// 	this._headBar.alpha = 1;
	// }


	/**
	 * 将角色设置为应该在的位置
	 */
	public setPosition() {
		// 修改动画朝向为正确朝向
		this.mArmatureDisplay.scaleX = Math.abs(
			this.mArmatureDisplay.scaleX) * this.camp;
		// 修改动画位置
		let newP = this.getPositon();
		this.x = newP.x;
		this.y = newP.y;
	}

	/**
	 * 获取角色应该在的位置
	 */
	public getPositon(): { x: number, y: number } {
		let y = 300 + 65 * this.row + Math.random() * 30;
		let x = 120 + this.col * 130 + this.row * 20 + Math.random() * 10;
		if (this.camp == CharCamp.Enemy) {
			x = LayerManager.Ins.stageWidth - x;
		}
		return { x: x, y: y }
	}

	/**
	 * db动画闪烁
	 */
	public armatureBlink(): void {
		egret.Tween.get(
			this.mArmatureDisplay,
			{ loop: true }
		).to(
			{ alpha: 0 }, 300
			).to({ alpha: 1 }, 300);
	}

	public setAsSelect() {
		let scene = SceneManager.Ins.curScene as BattleScene;
		this._bgLayer.addChild(scene.mSelectImg);
		scene.mSelectedChar = this;
	}


	/**
	 * db动画停止闪烁
	 */
	public armatureUnBlink(): void {
		egret.Tween.removeTweens(this.mArmatureDisplay);
	}

	public adjustBuffIconPos(): void {
		let buffLine = this._buffLine;
		let addedBuffsId: number[] = [];
		let buffLineIndex = 0;
		for (let buff of this.mBuffs) {
			let id = buff.id;
			// 如果此前没有在buffline中加过这个id才重复加一次
			if (addedBuffsId.indexOf(id) < 0) {
				let icon = buff.mIconBitMap;
				icon.x = buffLineIndex * 12;
				buffLine.addChild(icon);
				buffLineIndex++;
				addedBuffsId.push(id);
			}
		}
	}

	public initial(): void {
		this._isInPerf = false;
	}

	private _isInPerf: boolean;
	public nextPerf(p: { pType: PType, param?: any } = null): void {
		if (p) {
			this._perfQueue.push(p);
		} else if (this._perfQueue.length == 0) {
			if (this._isInBattle) {
				this.mArmatureDisplay.animation.play("idle", 0);
			}
			return;
		}

		if (this._isInPerf) {
			return;
		}

		this._isInPerf = true;
		let nextP = this._perfQueue.shift();
		switch (nextP.pType) {
			case PType.Die:
				this.stopDBAnim();
				(SceneManager.Ins.curScene as BattleScene).mFilterManager.addGreyFilter(this.mArmatureDisplay);
				this._isInPerf = false;
				this.nextPerf();
				break;
			case PType.DBAnim:
				this.playDBAnim(nextP.param.animName, 1);
				this.mArmatureDisplay.addEventListener(
					dragonBones.EventObject.COMPLETE,
					this.onAnimEnd,
					this
				);
				break;
			case PType.Resurgence:
				this.mArmatureDisplay.animation.play("idle", 0);
				(SceneManager.Ins.curScene as BattleScene).mFilterManager.removeGreyFilter(this.mArmatureDisplay);
				this._isInPerf = false;
				this.nextPerf();
				break;
			case PType.Move:
				egret.Tween.get(this).to(nextP.param.newP, 200).call(
					() => {
						this._isInPerf = false;
						this.nextPerf();
					}
				);
				break;
			case PType.ShieldBar:
				this._isInPerf = false;
				this.nextPerf();
				this.lifeBarShieldAnim(nextP.param.newShield)
				break;
			case PType.LifeBar:
				this._isInPerf = false;
				this.nextPerf();
				this.lifeBarAnim(nextP.param.newHp).call(
					() => {
						this._isInPerf = false;
						this.nextPerf();
					}
				);
				break;
			case PType.RemoveFromBattle:
				egret.Tween.get(this.mArmatureDisplay).to({
					alpha: 0
				}, 1000).call(() => {
					this.stopDBAnim();
					this.touchEnabled = false;
					this.visible = false;
					this._isInPerf = false;
					this.nextPerf();
				});
				break;
		}
	}

	private onAnimEnd(): void {
		this.mArmatureDisplay.removeEventListener(
			dragonBones.EventObject.COMPLETE,
			this.onAnimEnd,
			this
		);
		this._isInPerf = false;
		this.nextPerf();
	}

	public release(): void {
		LongTouchUtil.unbindLongTouch(this.mArmatureDisplay, this);
		this.mArmatureDisplay.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onTouchTap,
			this
		);
		this.mArmatureDisplay.removeEventListener(
			egret.TouchEvent.TOUCH_BEGIN,
			this.onTouchBegin,
			this
		);
		this.mArmatureDisplay.removeEventListener(
			dragonBones.EventObject.COMPLETE,
			this.onAnimEnd,
			this
		);
		this.mArmatureDisplay = null;
		this.mManualSkillsId = null;

		this.mAttr = null;
		this._lifeBarFg = null;
		this._bgLayer = null;
		this._headBar = null;
		this._shieldBar = null;
	}

}

enum CharCamp {
	Player = 1,
	Neut = 0,
	Enemy = -1,
}

enum CharColType {
	frontRow,
	midRow,
	backRow
}

enum CharRowType {
	up,
	mid,
	down
}

enum PType {
	Move,
	Die,
	Resurgence,
	RemoveFromBattle,
	LifeBar,
	ShieldBar,
	DBAnim
}