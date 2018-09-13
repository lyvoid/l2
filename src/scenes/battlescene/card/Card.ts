class Card extends egret.DisplayObjectContainer {
	private _skillId: number;
	private _cardInfo: CardInfo;
	public get cardInfo(): CardInfo { return this._cardInfo; }
	private _caster: Character
	public get caster(): Character { return this._caster; }
	private _recycleTimes: number;
	public get description(): string {
		let caster = this.caster;
		let casterName = caster ? caster.charName : "不需要释放单位";
		let skillInfo = ConfigManager.Ins.mSkillConfig[this._skillId];
		let affectDescpt = skillInfo['description'];
		let recycleTimes = this._recycleTimes == -1 ? "无限" : this._recycleTimes + ""
		if (this.caster && !this.caster.alive) {
			affectDescpt = `<font color="#EE4000">【释放单位已阵亡，卡牌效果替换为<b>增加角色复活进度</b>】</font>(初始效果：${affectDescpt})`
		}
		return `<font color="#BF3EFF" size="35"><b>${skillInfo['skillName']}(${casterName})</b></font>

<b>剩余使用:</b> <font color="#EE4000"><b>${recycleTimes}</b></font> 次
<b>消耗能量:</b> <font color="#EE4000"><b>${skillInfo['fireNeed']}</b></font> 点
<b>作用效果:</b> ${affectDescpt}
`;
	}

	private _skillIcon: egret.Bitmap;
	private _casterIcon: egret.Bitmap;
	private _skillNameTextField: egret.TextField;
	public constructor() {
		super();
		this.width = 80;
		this.height = 130;
		// bg
		let cardBg: egret.Bitmap = new egret.Bitmap(RES.getRes("cardbg_png"));
		cardBg.width = this.width;
		cardBg.height = this.height;
		this.addChild(cardBg);
		// skill skillIcon
		let skillIcon = new egret.Bitmap();
		skillIcon.width = 72;
		skillIcon.height = 72;
		skillIcon.x = 4;
		skillIcon.y = 54;
		this.addChild(skillIcon);
		this._skillIcon = skillIcon;
		// caster icon
		let casterIcon = new egret.Bitmap();
		casterIcon.width = 65;
		casterIcon.height = 65;
		casterIcon.x = 4;
		casterIcon.y = -2;
		this.addChild(casterIcon);
		this._casterIcon = casterIcon;
		// warn ! icon
		let warnIcon = new egret.Bitmap(RES.getRes("warn_icon_png"));
		warnIcon.width = 30;
		warnIcon.height = 30;
		warnIcon.x = 60;
		warnIcon.y = -10;
		warnIcon.visible = false;
		this._warnIcon = warnIcon;
		// TextField
		let skillNameTextField = new egret.TextField();
		skillNameTextField.background = true;
		skillNameTextField.size = 18;
		skillNameTextField.width = 74;
		skillNameTextField.height = 18;
		skillNameTextField.y = -12;
		skillNameTextField.x = 3;
		skillNameTextField.bold = true;
		skillNameTextField.text = "正正正正";
		skillNameTextField.textColor = 0x0;
		skillNameTextField.borderColor = 0xEE00EE;
		skillNameTextField.border = true;
		skillNameTextField.backgroundColor = 0xFAFAD2;
		this._skillNameTextField = skillNameTextField;
		this.addChild(skillNameTextField);
	}

	private _warnIcon: egret.Bitmap;
	public initial(cardInfo: CardInfo): void {
		let rsLoad = (SceneManager.Ins.curScene as BattleScene).mRsLoader;
		// initial info
		this._cardInfo = cardInfo;
		this._recycleTimes = cardInfo.recycleTimes;
		this._skillId = cardInfo.skillId;
		let caster = cardInfo.caster;
		this._caster = caster;
		// reset size, position and alpha
		this.alpha = 1;
		this.scaleX = 1;
		this.scaleY = 1;
		this.y = 0;
		this.touchEnabled = true;
		// skill skillIcon
		let skillInfo = ConfigManager.Ins.mSkillConfig[this._skillId];
		let skillIcon = this._skillIcon;
		skillIcon.texture = RES.getRes("imgloading_png");
		rsLoad.getResAsyncAndSetValue(
			skillInfo["iconName"],
			"texture",
			skillIcon
		);
		// caster icon
		let casterIcon = this._casterIcon;
		if (caster != null) {
			casterIcon.texture = RES.getRes("imgloading_png");
			rsLoad.getResAsyncAndSetValue(
				caster.charCode + '_portrait_png',
				"texture",
				casterIcon
			);
		} else {
			casterIcon.texture = RES.getRes("no_caster_portrait_png");
		}
		// warn ! icon
		if (caster != null && caster.alive) {
			this._warnIcon.visible = false;
		}
		// skillname
		this._skillNameTextField.text = skillInfo["skillName"];
		// initial event listener
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
		// initial longtouch
		LongTouchUtil.bindLongTouch(this, this);;
	}

	public setWarnIconVisible(): void {
		let caster = this.caster;
		if (caster != null && caster.alive) {
			this._warnIcon.visible = false;
		} else {
			this._warnIcon.visible = true;
		}
	}

	private onLongTouchEnd(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		LayerManager.Ins.popUpLayer.removeChild(scene.mBattleInfoPopupUI);
		// 显示选择圈
		scene.mSelectImg.visible = true;
		scene.mSelectHead.visible = true;
		let caster = this.caster;
		if (caster) {
			caster.unBlink();
		}
	}

	private onLongTouchBegin(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		let battleInfoPopupUI = scene.mBattleInfoPopupUI;
		battleInfoPopupUI.setDescFlowText(this.description);
		battleInfoPopupUI.setOnRight();
		battleInfoPopupUI.removeBgTapExit();
		LayerManager.Ins.popUpLayer.addChild(battleInfoPopupUI);
		// 隐藏选择圈
		scene.mSelectImg.visible = false;
		scene.mSelectHead.visible = false;
		// 释放者闪烁
		let caster = this.caster;
		if (caster) {
			caster.blink();
		}
	}

	private onTouchBegin(): void {
		(SceneManager.Ins.curScene as BattleScene).mFilterManager.setOutGlowHolderWithAnim(this);
	}

	private onTouchTap(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		if (scene.state instanceof PlayerUseCardPhase) {
			if (scene.mWinnerCamp != CharCamp.Neut) {
				ToastInfoManager.Ins.newToast("胜负已分", 0xff0000);
				return;
			}

			let skillInfo = ConfigManager.Ins.mSkillConfig[this._skillId];
			let fireboard = scene.mPlayerFireBoard;
			let fireNeed = skillInfo["fireNeed"];
			if (fireNeed > fireboard.mFireNum) {
				ToastInfoManager.Ins.newToast("能量不足", 0xff0000);
				scene.mBattleUI.fireSufficentAnim();
				return;
			}
			if (this.caster && !this.caster.alive) {
				// if hava a caster and caster is dead, go resurgence logic
				this.caster.getRsPoint(fireNeed);
			} else {
				// if no caster or caster alive
				let skill = scene.mManualSkillManager.newSkill(this._skillId, this.caster);
				// if can't cast, return
				let canCastInfo = skill.canCast();
				if (!canCastInfo[0]) {
					ToastInfoManager.Ins.newToast(canCastInfo[1], 0xff0000);
					skill.release();
					return;
				}
				// cast skill
				// scene.addToCastQueue(skill);
				skill.cast();
			}

			// remove fire for casting skill
			for (let i = 0; i < fireNeed; i++) {
				fireboard.removeFire();
			}

			// 如果不存在释放者或释放者还在游戏中，移除卡牌
			if ((!this.caster) || (this.caster && this.caster.isInBattle)) {
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
		this._caster = null;
		this._cardInfo = null;
	}

}