class Card extends egret.DisplayObjectContainer {

	public mSkill: ManualSkill;
	public get description(): string {
		let caster = this.mSkill.caster;
		let casterName = caster ? caster.mCharName : "无";
		return `<font color="#EE7942"><b>${this.mSkill.skillName}</b></font>
<b>释放单位:</b> ${casterName}
<b>消耗能量:</b> ${this.mSkill.fireNeed}
<b>作用效果:</b> ${this.mSkill.description}`;
	}

	public constructor() {
		super();
		this.width = 80;
		this.height = 130;
		let cardBg: egret.Bitmap = new egret.Bitmap(RES.getRes("cardbg_png"));
		cardBg.width = this.width;
		cardBg.height = this.height;
		this.addChild(cardBg);
	}

	public initial(skill: ManualSkill): void {
		this.mSkill = skill;
		this.alpha = 1;
		this.scaleX = 1;
		this.scaleY = 1;
		this.y = 0;
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
		LongTouchUtil.bindLongTouch(this, this);;
	}

	private onLongTouchEnd(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		LayerManager.Ins.popUpLayer.removeChild(scene.mCardInfoPopupUI);
		// 显示选择圈
		scene.mSelectImg.visible = true;
		let caster = this.mSkill.caster
		if (caster) {
			caster.armatureUnBlink();
		}
		this.mSkill.caster.mArmatureDisplay.alpha = 1;
	}

	private onLongTouchBegin(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		scene.mCardInfoPopupUI.setDescFlowText(this.description);
		LayerManager.Ins.popUpLayer.addChild(scene.mCardInfoPopupUI);
		// 隐藏选择圈
		scene.mSelectImg.visible = false;
		// 释放者闪烁
		let caster = this.mSkill.caster;
		if (caster) {
			caster.armatureBlink();
		}
	}

	private onTouchBegin(): void {
		(SceneManager.Ins.curScene as BattleScene).mFilterManager.setOutGlowHolderWithAnim(this);
	}

	private onTouchTap(): void {
		MessageManager.Ins.sendMessage(
			MessageType.CardTouchTap,
			this
		);
	}

	public release(): void {
		// 如果当前单位被长按功能选中且处于长按，手动发送一个out的消息来解除长按
		if (LongTouchUtil.holderObj === this && LongTouchUtil.isInLongTouch) {
			this.dispatchEvent(new egret.Event(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE));
		}
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
		this.mSkill = null;
	}
}