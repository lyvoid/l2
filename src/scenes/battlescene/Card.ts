class Card extends egret.DisplayObjectContainer {

	public desc: string = "对目标造成攻击的伤害";
	public caster: Charactor;
	public skill: SkillTmp = new SkillTmp();

	public constructor() {
		super();
		this.width = 80;
		this.height = 130;
		let cardBg: egret.Bitmap = new egret.Bitmap(RES.getRes("cardbg_png"));
		cardBg.width = this.width;
		cardBg.height = this.height;
		this.addChild(cardBg);
		this.initial();
	}

	private sendUseCardMessage(): void {
		MessageManager.Ins.sendMessage(
			MessageType.UseCard,
			this
		);
	}

	/**
	 * 从对象池调出的时候调用
	 */
	public initial(): void {
		this.touchEnabled = true;
		this.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.sendUseCardMessage,
			this
		);
		this.addEventListener(
			egret.TouchEvent.TOUCH_BEGIN,
			this.sendBeginTouchMessage,
			this
		);
		LongTouchUtil.bindLongTouch(this, this);
		// TODO Tmp
		this.caster = (SceneManager.Ins.curScene as BattleScene).friends[0];
	}

	/**
	 * 使用后准备放入对象池前调用
	 */
	public unInitial(): void {
		this.touchEnabled = false;
		this.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.sendUseCardMessage,
			this
		);
		this.removeEventListener(
			egret.TouchEvent.TOUCH_BEGIN,
			this.sendBeginTouchMessage,
			this
		);
	}

	private sendBeginTouchMessage(): void{
		MessageManager.Ins.sendMessage(
			MessageType.TouchBegin,
			this
		);
	}

	/**
	 * release 不会调用unInitial，释放前需要自行调用
	 */
	public release(): void {

	}
}