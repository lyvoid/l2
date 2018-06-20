class Card extends egret.DisplayObjectContainer {

	public mSkillId: number;
	public mCaster: Character;
	public get description(): string {
		let caster = this.mCaster;
		let casterName = caster ? caster.charName : "无";
		let skillInfo = ConfigManager.Ins.mSkillConfig[this.mSkillId];
		return `<font color="#EE7942"><b>${skillInfo['skillName']}</b></font>
<b>释放单位:</b> ${casterName}
<b>消耗能量:</b> ${skillInfo['fireNeed']}
<b>作用效果:</b> ${skillInfo['description']}`;
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

	public initial(skillId: number, caster: Character): void {
		this.mSkillId = skillId;
		this.mCaster = caster;
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
		let caster = this.mCaster;
		if (caster) {
			caster.armatureUnBlink();
		}
	}

	private onLongTouchBegin(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		scene.mCardInfoPopupUI.setDescFlowText(this.description);
		LayerManager.Ins.popUpLayer.addChild(scene.mCardInfoPopupUI);
		// 隐藏选择圈
		scene.mSelectImg.visible = false;
		// 释放者闪烁
		let caster = this.mCaster;
		if (caster) {
			caster.armatureBlink();
		}
	}

	private onTouchBegin(): void {
		(SceneManager.Ins.curScene as BattleScene).mFilterManager.setOutGlowHolderWithAnim(this);
	}

	private onTouchTap(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		if (scene.state instanceof PlayerUseCardPhase) {
			if (scene.mWinnerCamp != CharCamp.Neut) {
				ToastInfoManager.Ins.newToast("胜负已分");
				return;
			}

			if (!(this.mCaster && this.mCaster.alive)) {
				// TODO: 如果释放者已死亡就是另外一个逻辑了（复活逻辑）
				return;
			}
			let skill = scene.mManualSkillManager.newSkill(this.mSkillId, this.mCaster);
			let fireboard = scene.mPlayerFireBoard;
			let fireNeed = skill.fireNeed;
			if (fireNeed > fireboard.mFireNum) {
				ToastInfoManager.Ins.newToast("能量不足");
				skill.release();
				return;
			}

			// if can't cast, return
			let canCastInfo = skill.canCast();
			if (!canCastInfo[0]) {
				ToastInfoManager.Ins.newToast(canCastInfo[1]);
				skill.release();
				return;
			}
			// 移除所需要的点数
			for (let i = 0; i < skill.fireNeed; i++) {
				fireboard.removeFire();
			}
			let caster = this.mCaster;
			// 使用技能
			skill.cast();

			// 如果还在游戏中，移除卡牌
			if (caster.isInBattle) {
				// 这里之所以加这个判断是为了防止一张卡牌的效果事将自己排除处游戏外
				// 这个时候该卡牌会在释放技能的过程中就倍移除了，此时会造成重复删除的错误
				scene.mCardBoard.removeCard(this);
			}
		}

	}

	public release(): void {
		LongTouchUtil.unbindLongTouch(this, this);
		this.touchEnabled = false;
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
		this.mCaster = null;
	}
}