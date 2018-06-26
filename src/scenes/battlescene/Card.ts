class Card extends egret.DisplayObjectContainer {

	public mSkillId: number;
	public mCaster: Character;
	private _skillIcon: egret.Bitmap;
	public get description(): string {
		let caster = this.mCaster;
		let casterName = caster ? caster.charName : "无";
		let skillInfo = ConfigManager.Ins.mSkillConfig[this.mSkillId];
		let affectDescpt = skillInfo['description'];
		if (this.mCaster && !this.mCaster.alive) {
			affectDescpt += `<font color="#C0FF3E">(当前释放单位死亡，使用卡片效果替换为累计复活进度)</font>`
		}
		return `<font color="#EE7942"><b>${skillInfo['skillName']}</b></font>
<b>释放单位:</b> ${casterName}
<b>消耗能量:</b> ${skillInfo['fireNeed']}
<b>作用效果:</b> ${affectDescpt}`;
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
		let texture = RES.getRes(ConfigManager.Ins.mSkillConfig[skillId]["iconName"]);
		let skillIcon = new egret.Bitmap(texture);
		skillIcon.width = 72;
		skillIcon.height = 122;
		skillIcon.x = 4;
		skillIcon.y = 4;
		this.addChild(skillIcon);
		this._skillIcon = skillIcon;
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

			let skillInfo = ConfigManager.Ins.mSkillConfig[this.mSkillId];
			let fireboard = scene.mPlayerFireBoard;
			let fireNeed = skillInfo["fireNeed"];
			if (fireNeed > fireboard.mFireNum) {
				ToastInfoManager.Ins.newToast("能量不足");
				return;
			}
			if (!(this.mCaster && this.mCaster.alive)) {
				// if hava a caster and caster is dead, go resurgence logic
				this.mCaster.getRsPoint(fireNeed);
			} else {
				// if no caster or caster alive
				let skill = scene.mManualSkillManager.newSkill(this.mSkillId, this.mCaster);

				// if can't cast, return
				let canCastInfo = skill.canCast();
				if (!canCastInfo[0]) {
					ToastInfoManager.Ins.newToast(canCastInfo[1]);
					skill.release();
					return;
				}
				// 使用技能
				skill.cast();
			}

			// 移除所需要的点数
			for (let i = 0; i < fireNeed; i++) {
				fireboard.removeFire();
			}

			// 如果还在游戏中，移除卡牌
			if (this.mCaster.isInBattle) {
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
		Util.safeRemoveFromParent(this._skillIcon);
		this._skillIcon = null;
	}
}