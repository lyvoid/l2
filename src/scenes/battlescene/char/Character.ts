class Character extends egret.DisplayObjectContainer {

	// info
	private _charName: string;
	public get charName(): string { return this._charName; }
	private _feature: string;
	public get feature(): string { return this._feature; }
	private _manualSkillsId: number[];
	private _passiveSkillsId: number[];
	public get manualSkillsId(): number[] { return this._manualSkillsId; }

	// realtime
	public mAttr: Attribute;
	private _passiveSkills: Buff[];
	private _normalBuffs: Buff[];
	private _hidenBuffs: Buff[];
	private _perfQueue: { pType: PType, param?: any }[];
	public mCamp: CharCamp;

	// display
	private _lifeBarFg: egret.Bitmap;
	private _shieldBar: egret.Bitmap;
	private _buffBar: egret.DisplayObjectContainer;
	// background select img or shadow
	private _bgLayer: egret.DisplayObjectContainer;
	private _col: CharColType;
	private _row: CharRowType;
	private _armatureDisplay: dragonBones.EgretArmatureDisplay;

	// alive
	private _alive: boolean;
	public get alive(): boolean { return this._alive; }
	public set alive(inputAlive: boolean) {
		// if alive -> die
		if (!inputAlive && this._alive) {
			this._alive = false;
			// remove buff need remove
			for (let buff of this.getAllBuff()) {
				if (buff.isDeadRemove) {
					buff.removeFromChar();
				}
			}
			this.mAttr.shield = 0;
			this.mAttr.hp = 0;
		}
		this._alive = inputAlive;
	}

	// is In battle
	private _isInBattle: boolean;
	public get isInBattle(): boolean { return this._isInBattle; }
	public set isInBattle(value: boolean) {
		// 如果角色本来在游戏中但被排除出游戏
		if (this._isInBattle && (!value)) {
			let scene = SceneManager.Ins.curScene as BattleScene;
			if (this.mCamp == CharCamp.Player) {
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
			for (let buff of this.getAllBuff()) {
				buff.removeFromChar();
			}
		}
		// 更新排除出游戏状态
		this._isInBattle = value;
	}

	public get description(): string {
		let color = "#000000";
		if (this.mCamp === CharCamp.Enemy) {
			color = "#EE2C2C";
		} else if (this.mCamp === CharCamp.Player) {
			color = "#7FFF00";
		}
		return `<b><font color="${color}">${this.charName}</font></b>` +
			`\n<font color="#3D3D3D" size="15">${this.feature}</font>\n\n${this.mAttr.toString()}`;
	}

	public get buffDescription(): string {
		let passiveSkillsDesc = "";
		let buffsDesc = "";
		let skillsDesc = "";
		for (let buff of this._passiveSkills) {
			passiveSkillsDesc = `${passiveSkillsDesc}<font color="#7FFF00"><b>` +
				`${buff.buffName}:</b></font>${buff.description}\n`
		}

		// count layer number of buff
		let buffLayer: { [buffId: number]: number } = {};
		for (let buff of this._normalBuffs) {
			if (buffLayer[buff.id]) {
				buffLayer[buff.id] += 1;
			} else {
				buffLayer[buff.id] = 1;
			}
		}

		let buffAdded: number[] = [];
		for (let buff of this._normalBuffs) {
			if (buffAdded.indexOf(buff.id) >= 0) {
				continue;
			}
			buffAdded.push(buff.id);
			buffsDesc = `${buffsDesc}<font color="#7FFF00"><b>` +
				`${buff.buffName}(${buffLayer[buff.id]}层):</b></font>${buff.description}\n`
		}
		return `<font color="#EE7942"><b>被动技能</b></font>\n` +
			`${passiveSkillsDesc}\n\n` +
			`<font color="#EE7942"><b>当前状态</b></font>\n` +
			`${buffsDesc}`;
	}

	public initial(
		charName: string,
		charCode: string,
		feature: string,
		manualSkillsId: number[],
		passiveSkillsId: number[],
		camp: CharCamp,
		col: CharColType,
		row: CharRowType,
		attr: Attribute,
	): void {
		// set info
		this._alive = true;
		this._isInBattle = true;
		this._isInPerf = false;
		this._charName = charName;
		this._feature = feature;
		this._manualSkillsId = manualSkillsId;
		this._passiveSkillsId = passiveSkillsId;
		attr.char = this;
		this.mAttr = attr;
		this.mCamp = camp;
		this._col = col;
		this._row = row;

		// menber initial
		this._passiveSkills = [];
		this._normalBuffs = [];
		this._hidenBuffs = [];
		this._perfQueue = [];

		// display initial
		this.loadArmature(charCode);
		let bg = new egret.DisplayObjectContainer();
		this._bgLayer = bg;
		this.addChild(bg);

		// headBar(lifeBar/shield bar/ buff bar)
		let headBar = new egret.DisplayObjectContainer();
		headBar.x = -50;
		headBar.y = -210;
		// life bar
		let lifebarBg = new egret.Bitmap(RES.getRes("lifebarbg_jpg"));
		lifebarBg.alpha = 0.5;
		lifebarBg.width = 100;
		headBar.addChild(lifebarBg);
		let lifeBarFg = new egret.Bitmap(RES.getRes("lifebar_jpg"));
		lifeBarFg.width = 100;
		lifeBarFg.y = 1;
		headBar.addChild(lifeBarFg);
		this.addChild(headBar);
		this._lifeBarFg = lifeBarFg;
		// buff bar
		let buffBar = new egret.DisplayObjectContainer();
		buffBar.y = -12;
		this._buffBar = buffBar;
		headBar.addChild(buffBar)

		// shield bar
		let shieldBar = new egret.Bitmap(RES.getRes("lifebarbg_jpg"));
		shieldBar.height = 8;
		shieldBar.y = 13;
		shieldBar.width = 80 * this.mAttr.shield / this.mAttr.maxShield;
		headBar.addChild(shieldBar);
		this._shieldBar = shieldBar;

		this.setToProperPosition();
		// start idle
		this.nextPerf();
	}

	private lifeBarAnim(newHp?: number): egret.Tween {
		if (!newHp) {
			newHp = this.mAttr.hp;
		}
		let lifeBarNewLen = 100 * newHp / this.mAttr.maxHp;
		return egret.Tween.get(this._lifeBarFg).to({
			width: lifeBarNewLen,
		}, 1000, egret.Ease.quintOut);
	}

	private shieldBarAnim(newShield?: number): egret.Tween {
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
		this._armatureDisplay = armatureDisplay;

		// 绑定长按动作
		LongTouchUtil.bindLongTouch(armatureDisplay, this);

		// 绑定TouchBegin事件（发送TouchBegin消息）
		this.addEventListener(
			egret.TouchEvent.TOUCH_BEGIN,
			this.onTouchBegin,
			this
		);
	}

	private playDBAnim(
		animationName: string,
		animationTimes: number = -1,
		animationNameBack: string = "idle"
	): void {
		if (this._armatureDisplay.animation.animationNames.indexOf(animationName) >= 0) {
			this._armatureDisplay.animation.play(animationName, animationTimes);
		} else {
			this._armatureDisplay.animation.play(animationNameBack, animationTimes);
		}
	}

	private onLongTouchEnd(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		LayerManager.Ins.popUpLayer.removeChild(scene.mCharInfoPopupUI);
	}

	private onLongTouchBegin(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		scene.mCharInfoPopupUI.setDescFlowText(this.description);
		scene.mCharInfoPopupUI.setSkillDescFlowText(this.buffDescription);
		LayerManager.Ins.popUpLayer.addChild(scene.mCharInfoPopupUI);
	}

	private stopDBAnim() {
		this._armatureDisplay.animation.stop();
	}

	private onTouchBegin(): void {
		(SceneManager.Ins.curScene as BattleScene).mFilterManager.setOutGlowHolderWithAnim(this._armatureDisplay);
	}

	private onTouchTap(): void {
		this.onSelect();
	}

	// set to proper position
	private setToProperPosition() {
		// modify orientation
		this._armatureDisplay.scaleX = Math.abs(
			this._armatureDisplay.scaleX) * this.mCamp;
		// modify position
		let newP = this.getPositon();
		this.x = newP.x;
		this.y = newP.y;
	}

	// get a proper position
	public getPositon(): { x: number, y: number } {
		let y = 300 + 65 * this._row + Math.random() * 30;
		let x = 120 + this._col * 130 + this._row * 20 + Math.random() * 10;
		if (this.mCamp == CharCamp.Enemy) {
			x = LayerManager.Ins.stageWidth - x;
		}
		return { x: x, y: y }
	}

	public armatureBlink(): void {
		egret.Tween.get(
			this._armatureDisplay,
			{ loop: true }
		).to(
			{ alpha: 0 }, 300
			).to({ alpha: 1 }, 300);
	}

	public armatureUnBlink(): void {
		egret.Tween.removeTweens(this._armatureDisplay);
		this._armatureDisplay.alpha = 1;
	}

	public onSelect() {
		let scene = SceneManager.Ins.curScene as BattleScene;
		this._bgLayer.addChild(scene.mSelectImg);
		scene.mSelectedChar = this;
	}

	private adjustBuffIconPos(): void {
		let buffLine = this._buffBar;
		let addedBuffsId: number[] = [];
		let buffLineIndex = 0;
		// only add normal buff
		for (let buff of this._normalBuffs) {
			let id = buff.id;
			// if never add this buff icon before
			if (addedBuffsId.indexOf(id) < 0) {
				let icon = buff.mIconBitMap;
				icon.x = buffLineIndex * 12;
				buffLine.addChild(icon);
				buffLineIndex++;
				addedBuffsId.push(id);
			}
		}
	}

	private _isInPerf: boolean;
	public nextPerf(p: { pType: PType, param?: any } = null): void {
		if (p) {
			this._perfQueue.push(p);
		}

		if (this._perfQueue.length == 0) {
			if (this._isInBattle) {
				this._armatureDisplay.animation.play("idle", 0);
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
				(SceneManager.Ins.curScene as BattleScene).mFilterManager.addGreyFilter(this._armatureDisplay);
				this._isInPerf = false;
				this.nextPerf();
				break;
			case PType.DBAnim:
				this.playDBAnim(nextP.param.animName, 1);
				this._armatureDisplay.addEventListener(
					dragonBones.EventObject.COMPLETE,
					this.onAnimEnd,
					this
				);
				break;
			case PType.Resurgence:
				this._armatureDisplay.animation.play("idle", 0);
				(SceneManager.Ins.curScene as BattleScene).mFilterManager.removeGreyFilter(this._armatureDisplay);
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
				this.shieldBarAnim(nextP.param.newShield)
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
				egret.Tween.get(this._armatureDisplay).to({
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
		this._armatureDisplay.removeEventListener(
			dragonBones.EventObject.COMPLETE,
			this.onAnimEnd,
			this
		);
		this._isInPerf = false;
		this.nextPerf();
	}

	public getAllBuff(): Buff[] {
		return this._normalBuffs.concat(
			this._hidenBuffs
		).concat(
			this._passiveSkills
			);
	}

	public addBuff(buff: Buff): void {
		switch (buff.exType) {
			case BuffExTy.HideBuff:
				this._hidenBuffs.push(buff);
				break;
			case BuffExTy.NormalBuff:
				this._normalBuffs.push(buff);
				this.adjustBuffIconPos();
				break;
			case BuffExTy.PassvieSkill:
				this._passiveSkills.push(buff);
				break;
		}
	}

	public removeBuff(buff: Buff): void {
		switch (buff.exType) {
			case BuffExTy.HideBuff:
				Util.removeObjFromArray(this._hidenBuffs, this);
				break;
			case BuffExTy.NormalBuff:
				Util.removeObjFromArray(this._normalBuffs, this);
				this.adjustBuffIconPos();
				break;
			case BuffExTy.PassvieSkill:
				Util.removeObjFromArray(this._passiveSkills, this);
				break;
		}
	}

	public static sortFnByRow(c1: Character, c2: Character): number{
		let result = c1._row - c2._row;
		if (result != 0) return result;
		return c1.mCamp - c2.mCamp;
	}

	public release(): void {
		LongTouchUtil.unbindLongTouch(this._armatureDisplay, this);
		this._armatureDisplay.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onTouchTap,
			this
		);
		this._armatureDisplay.removeEventListener(
			egret.TouchEvent.TOUCH_BEGIN,
			this.onTouchBegin,
			this
		);
		this._armatureDisplay.removeEventListener(
			dragonBones.EventObject.COMPLETE,
			this.onAnimEnd,
			this
		);
		this._armatureDisplay = null;

		if (this.mAttr) {
			this.mAttr.release();
			this.mAttr = null;
		}
		for (let buff of this.getAllBuff()) {
			buff.release();
		}
		this._hidenBuffs = null;
		this._normalBuffs = null;
		this._passiveSkills = null;
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