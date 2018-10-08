class Character extends egret.DisplayObjectContainer {

	public static resurgencePoint = 4;

	// info
	private _charName: string;
	private _isDiz: boolean;
	public get charName(): string { return this._charName; }
	private _charCode: string;
	public get charCode(): string { return this._charCode }
	private _feature: string;
	public get feature(): string { return this._feature; }
	private _manualSkillsId: number[];
	private _passiveSkillsId: number[];
	public get manualSkillsId(): number[] { return this._manualSkillsId; }
	public mAi: NormalAi;

	// realtime
	public mAttr: Attribute;
	private _passiveSkills: Buff[];
	private _normalBuffs: Buff[];
	private _hidenBuffs: Buff[];
	private _perfQueue: { pType: PType, param?: any }[];
	public mCamp: CharCamp;
	private _curRs: number;

	// display
	private _lifeBarFg: egret.Bitmap;
	private _shieldBar: egret.Bitmap;
	private _buffBar: egret.DisplayObjectContainer;
	private _rsBar: egret.Shape;
	// background select img or shadow
	private _bgLayer: egret.DisplayObjectContainer;
	private _col: CCType;
	private _row: CRType;
	private _armatureDisplay: dragonBones.EgretArmatureDisplay;

	// alive
	private _alive: boolean;
	public get alive(): boolean { return this._alive; }
	public set alive(inputAlive: boolean) {
		if (inputAlive == this._alive) {
			return;
		}
		let scene = SceneManager.Ins.curScene as BattleScene;
		let cardBoard = scene.mCardBoard;
		if (!inputAlive && this._alive) {
			// if alive -> die
			this._alive = false;
			this._curRs = 0;
			// remove buff need remove
			for (let buff of this.getAllBuff()) {
				if (buff.isDeadRemove) {
					buff.removeFromChar();
				}
			}
			// all card of this char cd to zero
			for (let cardInfo of scene.mCardInfoDeck) {
				if (cardInfo.caster == this) {
					cardInfo.curCd = 0;
				}
			}
			cardBoard.cdToZeroOfChar(this);
			this.mAttr.shield = 0;
			this.mAttr.hp = 0;
		}
		if (!this._alive && inputAlive) {
			// if die -> alive
			// if is player's char, hide card warning
			if (this.mCamp == CharCamp.Player) {
				(SceneManager.Ins.curScene as BattleScene).mCardBoard.setCardsWarnIconOfChar(this);
			}
			this._curRs = 0;
			this.drawRsProgress();
		}
		this._alive = inputAlive;
		// if is player's char, show card warning
		if (this.mCamp == CharCamp.Player) {
			cardBoard.setCardsWarnIconOfChar(this);
		}
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
				// remove every card of this character from user deck
				let cardDeck = scene.mCardInfoDeck;
				let skillsForDelete = [];
				for (let skill of cardDeck) {
					if (skill[1] == this) {
						skillsForDelete.push(skill);
					}
				}
				for (let skill of skillsForDelete) {
					Util.removeObjFromArray(cardDeck, skill);
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

		let addInfo = "";
		// if not alive
		if (!this._alive) {
			addInfo = `
<font color="#EE4000"><b>【角色已阵亡，等待复活】
复活进度: <font color="#DC143C">${this._curRs}</font>/${Character.resurgencePoint}
</b></font>`
		}


		return `<font color="#BF3EFF" size="35"><b>${this.charName}</b></font>
<font size="25">${this.feature}</font>
${addInfo}
<font color="#EE4000"><b>----------属性----------</b></font>
${this.mAttr.toString()}

`;
	}

	private get stateDescription(): string {
		let passiveSkillsDesc = "";
		let buffsDesc = "";
		let skillsDesc = "";
		let manualSkillInfos = "";
		let otherInfos = "";
		let skillInfos = ConfigManager.Ins.mSkillConfig;
		let buffInfos = ConfigManager.Ins.mBuffConfig;
		let otherInfoOfBuff = new MySet<number>();
		for (let i of this._manualSkillsId) {
			let skillinfo = skillInfos[i]
			otherInfoOfBuff.addList(skillinfo["otherInfosOfBuffsId"]);
			let recycleTimes = skillinfo["recycleTimes"];
			let recycleTimesStr = recycleTimes == 0 ? "无限" : recycleTimes;
			manualSkillInfos += `<b>${skillinfo["skillName"]}(${skillinfo["fireNeed"]}能量, ${recycleTimesStr}次, ${skillinfo["maxCd"]}冷却回合):</b>${skillinfo["description"]}\n`;
		}
		for (let i of otherInfoOfBuff.data) {
			let buffInfo = buffInfos[i];
			otherInfos += `<b>` +
				`${buffInfo["buffName"]}:</b>${buffInfo["description"]}\n`;
		}
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
			let color = "#EE2C2C";
			// if (buff.isPositive) color = "#7FFF00";
			buffsDesc = `${buffsDesc}<font color="${color}"><b>` +
				`${buff.buffName}(${buffLayer[buff.id]}/${buff.maxLayer}层):</b></font>${buff.description}\n`
		}


		return `<font color="#EE4000"><b>--------被动技能--------</b></font>
${passiveSkillsDesc}


<font color="#EE4000"><b>--------当前状态--------</b></font>
${buffsDesc}


<font color="#EE4000"><b>--------主动技能--------</b></font>
${manualSkillInfos}


<font color="#EE4000"><b>--------补充效果说明--------</b></font>
${otherInfos}
`;
	}

	public get isDiz(): boolean {
		return this._isDiz;
	}

	public refreshDizstat() {
		for (let buff of this._normalBuffs) {
			if (buff.isDiz) {
				if (!this.isDiz) {
					// if no diz to diz
					this._isDiz = true;
					this.playIdle();
				}
				return;
			}
		}
		this._isDiz = false;
		this.playIdle();
	}

	public initial(
		charName: string,
		charCode: string,
		feature: string,
		manualSkillsId: number[],
		passiveSkillsId: number[],
		camp: CharCamp,
		col: CCType,
		row: CRType,
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
		this._charCode = charCode;

		// set ai
		if (this.mCamp == CharCamp.Enemy){
			this.mAi = new NormalAi(this);
		}

		// menber initial
		this._passiveSkills = [];
		this._normalBuffs = [];
		this._hidenBuffs = [];
		this._perfQueue = [];

		// display initial
		let bg = new egret.DisplayObjectContainer();
		this._bgLayer = bg;
		this.addChild(bg);
		this.loadArmature(charCode);

		// headBar(lifeBar/shield bar/ buff bar)
		let headBar = new egret.DisplayObjectContainer();
		headBar.x = -50;
		headBar.y = -160;
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

		// resugence progress bar
		let shape = new egret.Shape();
		headBar.addChild(shape);
		shape.visible = false;
		this._rsBar = shape;

		this.setToProperPosition();
		// start stand
		this.nextPerf();

	}

	/**
	 * point(x, y) is near this character or not
	 */
	public isNear(x: number, y: number): boolean {
		return (Math.abs(this.x - x) <= 50) && (this.y - y <= 150) && (this.y - y) > 0;
	}

	// only in normal buff
	public removeAllBuff(isRemovePos: boolean, isRemoveNeg: boolean): void {
		for (let buff of this._normalBuffs) {
			if ((buff.isPositive && isRemovePos) || (!buff.isPositive && isRemoveNeg)) {
				buff.removeFromChar();
			}
		}
		this.refreshDizstat();
	}

	private drawRsProgress(): void {
		let progress = this._curRs / Character.resurgencePoint;
		progress = progress > 1 ? 1 : progress;
		let endRadian = Math.PI * (progress * 2 - 0.5);
		let startRadian = -Math.PI * 0.5;
		let shape = this._rsBar;
		egret.Tween.removeTweens(shape);
		shape.graphics.clear();
		shape.visible = true;
		shape.alpha = 1;
		shape.graphics.beginFill(0xC0FF3E);
		let x = -20;
		let y = 5;
		let r = 15;
		shape.graphics.moveTo(x, y);//绘制点移动(r, r)点
		shape.graphics.lineTo(x, y - r);//画线到弧的起始点
		shape.graphics.drawArc(x, y, r, startRadian, endRadian, false);//从起始点顺时针画弧到终点
		shape.graphics.lineTo(x, y);//从终点画线到圆形。到此扇形的封闭区域形成
		shape.graphics.endFill();
	}

	public getRsPoint(pt: number): void {
		if (this._alive || !this._isInBattle) {
			// only avaliable when die
			return;
		}
		this._curRs += pt;
		this.drawRsProgress();
		if (this._curRs >= Character.resurgencePoint) {
			this.alive = true;
			this._curRs = 0;
			let newHp = this.mAttr.maxHp;
			this.mAttr.hp = newHp;
			this.nextPerf({ pType: PType.Resurgence });
			this.nextPerf({ pType: PType.LifeBar, param: { hpOld: 0, hpNew: newHp } })
			let rsBar = this._rsBar;
			egret.Tween.get(rsBar).to({ alpha: 0 }, 1000).call(() => rsBar.visible = false);
		}

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
		let lifeBarNewLen = 80 * newShield / this.mAttr.maxShield;
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
		// let demandArmatureWidth = 100;
		let demandArmatureHeight = 160;
		armatureDisplay.scaleY = demandArmatureHeight / armatureDisplay.height;
		// armatureDisplay.scaleX = demandArmatureWidth / armatureDisplay.width;
		armatureDisplay.scaleX = armatureDisplay.scaleY;
		// armatureDisplay.width = demandArmatureWidth;
		// armatureDisplay.height = demandArmatureHeight;

		// 增加动画点击事件
		armatureDisplay.touchEnabled = true;

		// 龙骨动画添加到Character中
		this.addChild(armatureDisplay);
		this._armatureDisplay = armatureDisplay;

		this.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onTouchTap,
			this
		);
	}

	private playDBAnim(
		animationName: string,
		animationTimes: number = -1,
		animationNameBack: string = "stand"
	): void {
		if (this._armatureDisplay.animation.animationNames.indexOf(animationName) >= 0) {
			this._armatureDisplay.animation.play(animationName, animationTimes);
		} else {
			this._armatureDisplay.animation.play(animationNameBack, animationTimes);
		}
	}

	private playIdle(): void {
		let times = this.alive ? 0 : 1; // if alive play by recycle ,else play 1 time 
		let name = this.isDiz ? "dizzy" : "stand";
		name = this.alive ? name : "death";
		this.playDBAnim(name, times);
	}

	private onTouchTap(): void {
		L2Filters.addOutGlowFilter(this._armatureDisplay);
		let battleInfoPopUP = (SceneManager.Ins.curScene as BattleScene).mBattleInfoPopupUI;
		if (this.mCamp == CharCamp.Enemy) {
			battleInfoPopUP.setOnLeft();
		} else {
			battleInfoPopUP.setOnRight();
		}
		battleInfoPopUP.setDescFlowText(this.description + this.stateDescription);
		LayerManager.Ins.popUpLayer.addChild(battleInfoPopUP);
		MessageManager.Ins.addEventListener(
			MessageType.BattleInfoPopUpClose,
			this.onBattleInfoPopUpClose,
			this
		);
	}

	private onBattleInfoPopUpClose(): void {
		L2Filters.removeOutGlowFilter(this._armatureDisplay);
		MessageManager.Ins.removeEventListener(
			MessageType.BattleInfoPopUpClose,
			this.onBattleInfoPopUpClose,
			this
		);
	}

	private stopDBAnim() {
		this._armatureDisplay.animation.stop();
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
		let stageHeight = LayerManager.Ins.stageHeight;
		let y = (stageHeight - 220) - 70 * (2 - this._row) + Math.random() * 15;
		let x = 80 + this._col * 155 + this._row * 30 + Math.random() * 10;
		if (this.mCamp == CharCamp.Enemy) {
			x = LayerManager.Ins.stageWidth - x;
		}
		return { x: x, y: y }
	}

	public selectAsCaster(): void {
		if (this._isInPerf){
			return;
		}
		if (!this.alive) {
			let scene = SceneManager.Ins.curScene as BattleScene;
			let lifeSurgenceParticleSys = scene.mCharSugenceParticle;
			lifeSurgenceParticleSys.x = this.x;
			lifeSurgenceParticleSys.y = this.y - 20;
			lifeSurgenceParticleSys.start();
		} else if (!this.isDiz) {
			this.playDBAnim("attack", 0);
		}
		L2Filters.addOutGlowFilter(this);
	}

	public unSelectAsCaster(): void {
		if (this._isInPerf){
			return;
		}
		if (!this.alive) {
			let scene = SceneManager.Ins.curScene as BattleScene;
			let lifeSurgenceParticleSys = scene.mCharSugenceParticle;
			lifeSurgenceParticleSys.stop();
		} else {
			this.playIdle();
		}
		L2Filters.removeOutGlowFilter(this);;
	}

	public selectAsTarget() {
		let scene = SceneManager.Ins.curScene as BattleScene;
		this._bgLayer.addChild(scene.mSelectImg);
		let selectHead = scene.mSelectHead;
		const startY = -215;
		selectHead.y = startY;
		this._bgLayer.addChild(selectHead);
		egret.Tween.removeTweens(selectHead);
		egret.Tween.get(selectHead, { loop: true }).to(
			{ y: startY + 20 }, 500
		).to({ y: startY }, 500);
		L2Filters.addYellowGlow(this);
	}

	public unSelectAsTarget() {
		let scene = SceneManager.Ins.curScene as BattleScene;
		L2Filters.removeYellowGlow(this);
		Util.safeRemoveFromParent(scene.mSelectHead);
		Util.safeRemoveFromParent(scene.mSelectImg);
	}

	private adjustBuffIconPos(): void {
		let buffLine = this._buffBar;
		buffLine.removeChildren();
		let addedBuffsId: number[] = [];
		let buffLineIndex = 0;
		// only add normal buff
		for (let buff of this._normalBuffs) {
			let id = buff.id;
			// if never add this buff icon before
			if (addedBuffsId.indexOf(id) < 0) {
				let icon = new egret.Bitmap(RES.getRes(buff.iconName));;
				icon.x = buffLineIndex * 12;
				buffLine.addChild(icon);
				buffLineIndex++;
				addedBuffsId.push(id);
			}
		}
	}

	private _isInPerf: boolean;
	public get isInPerf():boolean{return this._isInPerf;}
	public nextPerf(p: { pType: PType, param?: any } = null): void {
		if (p) {
			this._perfQueue.push(p);
		}

		if (this._isInPerf) {
			return;
		}

		if (this._perfQueue.length == 0) {
			this.playIdle();
			return;
		}


		this._isInPerf = true;
		let nextP = this._perfQueue.shift();
		let damageFloatManage = (SceneManager.Ins.curScene as BattleScene).mDamageFloatManager;
		switch (nextP.pType) {
			case PType.Die:
				this.playIdle();
				L2Filters.addGreyFilter(this._armatureDisplay);
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
				this.playIdle();
				L2Filters.removeGreyFilter(this._armatureDisplay);
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
				this.playDBAnim("injured", 1);
				damageFloatManage.newFloat(this, nextP.param.shieldOld, nextP.param.shieldNew, "护盾");
				this.shieldBarAnim(nextP.param.shieldNew).call(
					() => {
						this._isInPerf = false;
						this.nextPerf();
					}
				);
				break;
			case PType.LifeBar:
				this.playDBAnim("injured", 1);
				damageFloatManage.newFloat(this, nextP.param.hpOld, nextP.param.hpNew, "生命");
				this.lifeBarAnim(nextP.param.hpNew).call(
					() => {
						this._isInPerf = false;
						this.nextPerf();
					}
				);
				break;
			case PType.RemoveFromBattle:
				this.playDBAnim("death", 1);
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
			case PType.DamageFloat:
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
				this.refreshDizstat();
				break;
			case BuffExTy.PassvieSkill:
				this._passiveSkills.push(buff);
				break;
		}
	}

	public removeBuff(buff: Buff): void {
		switch (buff.exType) {
			case BuffExTy.HideBuff:
				Util.removeObjFromArray(this._hidenBuffs, buff);
				break;
			case BuffExTy.NormalBuff:
				Util.removeObjFromArray(this._normalBuffs, buff);
				this.adjustBuffIconPos();
				break;
			case BuffExTy.PassvieSkill:
				Util.removeObjFromArray(this._passiveSkills, buff);
				break;
		}
		this.refreshDizstat();
	}

	public static sortFnByRow(c1: Character, c2: Character): number {
		let result = c1._row - c2._row;
		if (result != 0) return result;
		return c1.mCamp - c2.mCamp;
	}

	public release(): void {
		MessageManager.Ins.removeEventListener(
			MessageType.BattleInfoPopUpClose,
			this.onBattleInfoPopUpClose,
			this
		);
		this._armatureDisplay.removeEventListener(
			dragonBones.EventObject.COMPLETE,
			this.onAnimEnd,
			this
		);
		this.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onTouchTap,
			this
		);

		this._armatureDisplay.dispose();
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
		this._perfQueue = null;
		this.removeChildren();
		if (this.mAi){
			this.mAi.release();
			this.mAi = null;
		}
	}
}

enum CharCamp {
	Player = 1,
	Neut = 0,
	Enemy = -1,
}

enum CCType {
	back,
	mid,
	front
}

enum CRType {
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
	DBAnim,
	DamageFloat,
}