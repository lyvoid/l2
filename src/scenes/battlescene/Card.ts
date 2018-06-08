class Card extends egret.DisplayObjectContainer {

	public skill: ManualSkill;
	public get desc(): string {
		let caster = this.skill.caster;
		let casterName = caster ? caster.mCharName : "无";
		return `<font color="#EE7942"><b>${this.skill.skillName}</b></font>
<b>释放单位:</b> ${casterName}
<b>消耗能量:</b> ${this.skill.fireNeed}
<b>作用效果:</b> ${this.skill.description}`;
	}

	public constructor(skill: ManualSkill) {
		super();
		this.width = 80;
		this.height = 130;
		let cardBg: egret.Bitmap = new egret.Bitmap(RES.getRes("cardbg_png"));
		cardBg.width = this.width;
		cardBg.height = this.height;
		this.addChild(cardBg);
		this.setSkill(skill);
	}

	private onLongTouchEnd(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		LayerManager.Ins.popUpLayer.removeChild(scene.mCardInfoPopupUI);
		// 显示选择圈
		scene.mSelectImg.visible = true;
		let caster = this.skill.caster
		if (caster) {
			caster.armatureUnBlink();
		}

		for (let char of scene.mEnemies.concat(scene.mFriends)) {
			char.lifeBarShow();
		}

		this.skill.caster.mArmatureDisplay.alpha = 1;
		for (let target of this._targetsTmp) {
			target.lifeBarUnBlink();
		}
		this._targetsTmp = null;
	}
	private _targetsTmp: Character[];
	private onLongTouchBegin(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		scene.mCardInfoPopupUI.setDescFlowText(this.desc);
		LayerManager.Ins.popUpLayer.addChild(scene.mCardInfoPopupUI);
		// 隐藏选择圈
		scene.mSelectImg.visible = false;
		// 释放者闪烁
		let caster = this.skill.caster;
		if (caster) {
			caster.armatureBlink();
		}

		this._targetsTmp = this.skill.preSelectTarget();
		// 隐藏目标以外的血条
		for (let char of scene.mEnemies.concat(scene.mFriends)) {
			if (this._targetsTmp.indexOf(char) < 0) {
				char.lifeBarHide();
			}
		}

		for (let target of this._targetsTmp) {
			target.lifeBarBlink();
		}
	}

	/**
	 * 从对象池调出的时候调用，主要是绑定好事件
	 */
	public initial(): void {
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

	/**
	 * TODO: 这里还需要根据skill的图标资源名，给对应卡片设置对应贴图资源
	 */
	public setSkill(skill: ManualSkill): void {
		this.skill = skill;
		this.alpha = 1;
		this.scaleX = 1;
		this.scaleY = 1;
		this.y = 0;
	}

	/**
	 * 使用后准备放入对象池前调用
	 * 解除事件侦听
	 */
	public uninitial(): void {
		// 如果当前单位被长按功能选中且处于长按，手动发送一个out的消息来解除长按
		if (LongTouchUtil.holderObj === this && LongTouchUtil.isInLongTouch){
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
		this.skill = null;
		this._targetsTmp = null;
	}

	/**
	 * 点击开始时发送touchbegin消息，附带信息为卡牌自己
	 * touchbegin统一在scene里做处理
	 */
	private onTouchBegin(): void {
		(SceneManager.Ins.curScene as BattleScene).mFilterManager.setOutGlowHolderWithAnim(this);
	}

	/**
	 * 被点击时发送cardtouchtap事件，附带信息为卡牌自己
	 * 事件在scene中处理
	 */
	private onTouchTap(): void {
		MessageManager.Ins.sendMessage(
			MessageType.CardTouchTap,
			this
		);
	}

	public release(): void {
		this.uninitial();
		this.skill = null;
	}
}