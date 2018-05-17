class Card extends egret.DisplayObjectContainer {

	public skill: IManualSkill;
	public get desc(): string {
		return this.skill.desc;
	}

	public constructor(skill: IManualSkill) {
		super();
		this.width = 80;
		this.height = 130;
		let cardBg: egret.Bitmap = new egret.Bitmap(RES.getRes("cardbg_png"));
		cardBg.width = this.width;
		cardBg.height = this.height;
		this.addChild(cardBg);
		this.initial(skill);
	}

	/**
	 * 从对象池调出的时候调用
	 */
	public initial(skill: IManualSkill): void {
		this.touchEnabled = true;
		this.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onTouchTap,
			this
		);
		this.addEventListener(
			egret.TouchEvent.TOUCH_BEGIN,
			this.onTouchBegin,
			this
		);
		LongTouchUtil.bindLongTouch(this, this);
		this.skill = skill;
	}

	/**
	 * 使用后准备放入对象池前调用
	 */
	public unInitial(): void {
		this.touchEnabled = false;
		LongTouchUtil.unbindLongTouch(this, this);
		this.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onTouchTap,
			this
		);
		this.removeEventListener(
			egret.TouchEvent.TOUCH_BEGIN,
			this.onTouchBegin,
			this
		);
		this.skill = null;
	}

	private onTouchBegin(): void {
		MessageManager.Ins.sendMessage(
			MessageType.TouchBegin,
			this
		);
	}

	private onTouchTap(): void {
		let scene = SceneManager.Ins.curScene as BattleScene
		let fireboard = scene.playerFireBoard;
		let fireNeed = this.skill.fireNeed;
		if (fireNeed > fireboard.fireNum){
			ToastInfoManager.Ins.newToast("能量不足");
			return;
		}
		
		// 如果目标类型为特定单位，但该单位已经死亡（发生在之前的技能已经把敌方打死但是演出还没结束的时候）
		if (this.skill.targetType == TargetType.SpecialEnemy && 
			(!scene.selectedEnemy.alive)){
			ToastInfoManager.Ins.newToast("选中目标已死亡");
			return;
		}

		// 使用技能
		this.skill.useSkill();

		// 移除所需要的点数
		for (let i = 0; i < this.skill.fireNeed; i++) {
			fireboard.removeFire();
		}

		// 移除卡牌
		scene.cardBoard.removeCard(this);

	}

	/**
	 * release 不会调用unInitial，释放前需要自行调用
	 */
	public release(): void {

	}
}