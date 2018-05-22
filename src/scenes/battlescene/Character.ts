/**
 * 场景中的一个角色，该类的实例应该只会出现在BattleScene中
 */
class Character extends egret.DisplayObjectContainer {
	/**
	 * 动画
	 */
	public armatureDisplay: dragonBones.EgretArmatureDisplay;

	/**
	 * 人物血条前景，实际血量标识
	 */
	private lifeBarFg: egret.Bitmap;
	// 血条整体
	private lifeBar: egret.DisplayObjectContainer;
	private shieldBar: egret.Bitmap;

	/**
	 * 人物当前状态描述，在长按中展示
	 */
	public get desc(): string {
		return this.attr.toString();
	}

	/**
	 * 是否存活
	 */
	public get alive(): boolean{
		return this.attr.hp != 0;
	}

	/**
	 * 属性
	 */
	public attr: Attribute;

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
	}

	/**
	 * 播放血条动画，血条在1s内从之前的状态到达当前血量的状态
	 */
	public lifeBarAnim(newHp?: number): egret.Tween {
		if (!newHp){
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
		if (!newShield){
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
		if (this.camp == CharCamp.Enemy) {
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
	public armatureUnBlink() : void{
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