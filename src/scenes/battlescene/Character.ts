/**
 * 场景中的一个角色，该类的实例应该只会出现在BattleScene中
 */
class Character extends egret.DisplayObjectContainer {
	/**
	 * 动画
	 */
	public armatureDisplay: dragonBones.EgretArmatureDisplay;

	/**
	 * 人物血条
	 */
	public lifeBar: egret.Bitmap;

	/**
	 * 人物当前状态描述，在长按中展示
	 */
	public get desc(): string {
		return this.attr.toString();
	}

	/**
	 * 属性
	 */
	public attr: Attribute = new Attribute();

	/**
	 * 是否存活
	 */
	public isAlive: boolean = true;

	/**
	 * 主动技能列表
	 */
	public manualSkills: IManualSkill[];

	/**
	 * 被动技能
	 */
	public passiveSkill;

	/**
	 * 背景层，用来放选中圈，影子等
	 */
	public bgLayer: egret.DisplayObjectContainer;
	/**
	 * 阵营
	 */
	public camp: CharCamp = CharCamp.self;

	/**
	 * 前中后 站位
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

		// 加血条
		let lifebarBg = new egret.Bitmap(RES.getRes("lifebarbg_jpg"));
		lifebarBg.alpha = 0.5;
		lifebarBg.width = 100;
		lifebarBg.y = -210;
		lifebarBg.x = -50;
		let lifebar = new egret.Bitmap(RES.getRes("lifebar_jpg"));
		lifebar.width = 100;
		lifebar.y = -209;
		lifebar.x = -50;
		this.addChild(lifebarBg);
		this.addChild(lifebar);
		this.lifeBar = lifebar;
	}


	public hurt(ht: Hurt): void {
		if (!this.isAlive) {
			return
		}
		let df = this.attr.df;
		let harm = ht.hurtNumber - df;
		if (harm < 0) {
			harm = ht.hurtNumber / 10;
		}

		this.attr.chp -= harm;

		if (this.attr.chp <= 0) {
			this.isAlive = false;
			this.attr.chp = 0;
		}
	}

	/**
	 * 播放血条动画，血条在1s内从之前的状态到达当前血量的状态
	 */
	public lifeBarAnim() {
		let lifeBarNewLen = 100 * this.attr.chp / this.attr.mhp;
		egret.Tween.get(this.lifeBar).to({
			width: 100 * (this.attr.chp / this.attr.mhp),
		}, 1000);
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

	private onTouchBegin(): void {
		MessageManager.Ins.sendMessage(
			MessageType.TouchBegin,
			this.armatureDisplay
		);
	}

	/**
	 * 点击时触发
	 * 将选中框移动到该角色的bgLayer中，
	 * 同时将scene下的selectEnemy及Friend调整为合适的对象
	 */
	private onTouchTap(): void {
		let battleScene = (SceneManager.Ins.curScene as BattleScene);
		if (this.camp == CharCamp.enemy) {
			this.bgLayer.addChild(
				battleScene.bcr.enemySlectImg
			);
			battleScene.selectedEnemy = this;
		} else {
			this.bgLayer.addChild(
				battleScene.bcr.selfSelectImg
			);
			battleScene.selectedFriend = this;
		}
	}


	/**
	 * 将角色设置为应该在的位置
	 */
	public setPosition() {
		// 修改动画朝向为正确朝向
		this.armatureDisplay.scaleX = this.camp;
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
		if (this.camp == CharCamp.enemy) {
			x = LayerManager.Ins.stageWidth - x;
		}
		return { x: x, y: y }
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
		this.lifeBar = null;
		this.bgLayer = null;
	}

}

enum CharCamp {
	self = 1,
	enemy = -1,
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