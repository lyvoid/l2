/**
 * 场景中的一个角色，该类的实例应该只会出现在BattleScene中
 */
class Character extends egret.DisplayObjectContainer {
	/**
	 * 动画
	 */
	public armatureDisplay: dragonBones.EgretArmatureDisplay;

	/**
	 * 角色名
	 */
	public charName: string = "还没有名字";
	/**
	 * 简介
	 */
	public feature: string = "特征是什么呢？";

	/**
	 * 被动技能（buff）列表
	 */
	public passiveSkills: Buff[];

	/**
	 * 普通buff列表
	 */
	public buffs: Buff[];

	/**
	 * 隐藏buff
	 */
	public hideBuffs: Buff[];

	/**
	 * 人物血条前景，实际血量标识
	 */
	private lifeBarFg: egret.Bitmap;
	// 血条整体
	private lifeBar: egret.DisplayObjectContainer;
	// 护盾条（属于血条的一部分）
	private shieldBar: egret.Bitmap;

	/**
	 * 人物当前状态描述，在长按中展示
	 */
	public get desc(): string {
		let color = "#000000";
		if (this.camp === CharCamp.Enemy){
			color = "#EE2C2C";
		} else if (this.camp === CharCamp.Player){
			color = "#7FFF00";
		}
		return  `<b><font color="${color}">${this.charName}</font></b>` + 
			`\n<font color="#3D3D3D" size="15">${this.feature}</font>\n\n${this.attr.toString()}`;
	}

	/**
	 * 人物技能及当前buff描述，长按中展示
	 */
	public get skillDesc(): string{
		let passiveSkillsDesc = "";
		let buffsDesc = "";
		let skillsDesc = "";
		for (let skill of this.manualSkills){
			skillsDesc = `${skillsDesc}<b>${skill.skillName}:</b>${skill.desc}\n`;
		}		
		return `<font color="#EE7942"><b>被动技能</b></font>
<font color="#7FFF00"><b>激怒(2):</b></font> 该单位增加50%的额外攻击力

<font color="#EE7942"><b>当前状态</b></font>
<font color="#7FFF00"><b>激怒(2):</b></font> 该单位增加50%的额外攻击力

<font color="#EE7942"><b>主动技能</b></font>
${skillsDesc}`;
	}


	/**
	 * 是否存在游戏中
	 */
	private _isInBattle: boolean = true;

	public get isInBattle(): boolean {
		return this._isInBattle;
	}

	public set isInBattle(value: boolean) {
		// 如果角色本来在游戏中但被排除出游戏
		if (this._isInBattle && (!value)) {
			let scene = SceneManager.Ins.curScene as BattleScene;
			if (this.camp == CharCamp.Player) {
				// 移除手牌中属于当前角色的牌
				scene.cardBoard.removeCardOfChar(this);
				// 移除SkillPool中归属于该角色的技能
				let skillPools = scene.skillManualPool;
				let skillsForDelete: IManualSkill[] = [];
				for (let skill of skillPools) {
					if (skill.caster === this) {
						skillsForDelete.push(skill);
					}
				}
				for (let skill of skillsForDelete) {
					Util.deleteObjFromList(skillPools, skill);
				}
			}
			// 更新排除出游戏状态
			this._isInBattle = value;

			// 如果选中的角色时当前角色，如果还有备选方案，选中者替换成其他人
			let newTarget: Character = null;
			if (scene.selectedFriend === this) {
				console.log("frient");

				newTarget = IManualSkill.getFirstInBattle(scene.friends)
			} else if (scene.selectedEnemy === this) {
				console.log("enemy");

				newTarget = IManualSkill.getFirstInBattle(scene.enemies);
			}
			if (newTarget) {
				scene.setSelectTarget(newTarget);
			}
		}
	}

	/**
	 * 是否存活
	 */
	public get alive(): boolean {
		return this.attr.hp != 0;
	}

	/**
	 * 属性
	 */
	public attr: Attribute;

	/**
	 * buff条
	 */
	public buffLine: egret.DisplayObjectContainer;

	/**
	 * 主动技能列表
	 */
	public manualSkills: IManualSkill[];

	/**
	 * 背景层，用来放选中圈，影子等
	 */
	public bgLayer: egret.DisplayObjectContainer;
	/**
	 * 阵营
	 */
	public camp: CharCamp = CharCamp.Player;

	/**
	 * 前中后三排 站位
	 */
	public col: CharColType = CharColType.frontRow;

	/**
	 * 位置 上中下三行
	 */
	public row: CharRowType = CharRowType.mid;


	public constructor(charactorName: string) {
		super();

		// 背景层
		let bg = new egret.DisplayObjectContainer();
		this.bgLayer = bg;
		this.addChild(bg);

		// 载入龙骨动画
		this.loadArmature(charactorName);

		// 加属性
		this.attr = new Attribute();
		this.attr.char = this;

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
		this.lifeBar = lifeBar;
		this.lifeBarFg = lifeBarFg;

		// 加buff条
		let buffLine = new egret.DisplayObjectContainer();
		buffLine.y = -12;
		this.buffLine = buffLine;
		this.lifeBar.addChild(buffLine)

		// 加护盾条
		let shieldBar = new egret.Bitmap(RES.getRes("lifebarbg_jpg"));
		shieldBar.height = 8;
		shieldBar.y = 13;
		shieldBar.width = 80 * this.attr.shield / this.attr.maxShield;
		lifeBar.addChild(shieldBar);
		this.shieldBar = shieldBar;


		// 加技能
		this.manualSkills = [];
		let skill1 = new SkillOneDamageWithOut(this);
		this.manualSkills.push(skill1);


		this.passiveSkills = [];
		this.buffs = [];
		this.hideBuffs = [];
	}

	/**
	 * 播放血条动画，血条在1s内从之前的状态到达当前血量的状态
	 */
	public lifeBarAnim(newHp?: number): egret.Tween {
		if (!newHp) {
			newHp = this.attr.hp;
		}
		let lifeBarNewLen = 100 * newHp / this.attr.maxHp;
		return egret.Tween.get(this.lifeBarFg).to({
			width: lifeBarNewLen,
		}, 1000, egret.Ease.quintOut);
	}

	/**
	 * 播放shield条动画
	 */
	public lifeBarShieldAnim(newShield?: number): egret.Tween {
		if (!newShield) {
			newShield = this.attr.shield;
		}
		let lifeBarNewLen = 80 * newShield / this.attr.maxHp;
		return egret.Tween.get(this.shieldBar).to({
			width: lifeBarNewLen,
		}, 1000, egret.Ease.quintOut);
	}


	private loadArmature(charactorName: string): void {
		// 从当前场景中获取dbManager，因此在实例化charactor前
		let dbManager: DBManager = (
			SceneManager.Ins.curScene as BattleScene
		).dbManager;

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
		this.armatureDisplay = armatureDisplay;

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
		if (this.armatureDisplay.animation.animationNames.indexOf(animationName) >= 0) {
			this.armatureDisplay.animation.play(animationName, animationTimes);
		} else {
			this.armatureDisplay.animation.play(animationNameBack, animationTimes);
		}
	}

	private onLongTouchEnd(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		LayerManager.Ins.popUpLayer.removeChild(scene.charInfoPopupUI);
	}

	private onLongTouchBegin(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		scene.charInfoPopupUI.setDescFlowText(this.desc);
		scene.charInfoPopupUI.setSkillDescFlowText(this.skillDesc);
		LayerManager.Ins.popUpLayer.addChild(scene.charInfoPopupUI);
	}

	/**
	 * 停止龙骨动画
	 */
	public stopDBAnim() {
		this.armatureDisplay.animation.stop();
	}

	// 点击的时候播放外发光滤镜动画
	private onTouchBegin(): void {
		(SceneManager.Ins.curScene as BattleScene).filterManager.setOutGlowHolderWithAnim(this.armatureDisplay);
	}

	/**
	 * 点击时触发
	 * 将选中框移动到该角色的bgLayer中，
	 * 同时将scene下的selectEnemy及Friend调整为合适的对象
	 */
	private onTouchTap(): void {
		(SceneManager.Ins.curScene as BattleScene).setSelectTarget(this);
	}

	/**
	 * 隐藏生命条
	 */
	public lifeBarHide(): void {
		this.lifeBar.visible = false;
	}

	/**
	 * 显示生命条
	 */
	public lifeBarShow(): void {
		this.lifeBar.visible = true;
	}

	/**
	 * 生命条开始闪烁
	 */
	public lifeBarBlink(): void {
		egret.Tween.get(
			this.lifeBar,
			{ loop: true }
		).to(
			{ alpha: 0 }, 300
			).to({ alpha: 1 }, 300);
	}

	/**
	 * 停止生命条闪烁
	 */
	public lifeBarUnBlink(): void {
		egret.Tween.removeTweens(this.lifeBar);
		this.lifeBar.alpha = 1;
	}


	/**
	 * 将角色设置为应该在的位置
	 */
	public setPosition() {
		// 修改动画朝向为正确朝向
		this.armatureDisplay.scaleX = Math.abs(
			this.armatureDisplay.scaleX) * this.camp;
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
			this.armatureDisplay,
			{ loop: true }
		).to(
			{ alpha: 0 }, 300
			).to({ alpha: 1 }, 300);
	}

	/**
	 * 获取对比后的属性改动信息
	 */


	/**
	 * db动画停止闪烁
	 */
	public armatureUnBlink(): void {
		egret.Tween.removeTweens(this.armatureDisplay);
	}

	public release(): void {
		LongTouchUtil.unbindLongTouch(this.armatureDisplay, this);
		this.armatureDisplay.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onTouchTap,
			this
		);
		this.armatureDisplay.removeEventListener(
			egret.TouchEvent.TOUCH_BEGIN,
			this.onTouchBegin,
			this
		);
		this.armatureDisplay = null;

		for (let skill of this.manualSkills) {
			skill.release();
		}
		this.manualSkills = null;

		this.attr = null;
		this.lifeBarFg = null;
		this.bgLayer = null;
		this.lifeBar = null;
		this.shieldBar = null;
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