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
	private _fireNeedTextField: egret.TextField;
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
		// skill name TextField
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
		// point
		let fireNeedTextField = new egret.TextField();
		fireNeedTextField.background = true;
		fireNeedTextField.size = 30;
		fireNeedTextField.width = 30;
		fireNeedTextField.height = 30;
		fireNeedTextField.y = 10;
		fireNeedTextField.x = 65;
		fireNeedTextField.bold = true;
		fireNeedTextField.text = "10";
		fireNeedTextField.borderColor = 0xFFFF00;
		fireNeedTextField.border = true;
		fireNeedTextField.backgroundColor = 0x2F4F4F;
		this._fireNeedTextField = fireNeedTextField;
		this.addChild(fireNeedTextField);
		// warn ! icon
		let warnIcon = new egret.Bitmap(RES.getRes("warn_icon_png"));
		warnIcon.width = 30;
		warnIcon.height = 30;
		warnIcon.x = 60;
		warnIcon.y = -25;
		warnIcon.visible = false;
		this._warnIcon = warnIcon;
		this.addChild(warnIcon);
	}

	private _warnIcon: egret.Bitmap;
	private _isCustomSelectTarget: boolean;
	private _selectNeedStat: number;
	private _selectNeedBelong: number;
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
		// skill info 
		let skillInfo = ManualSkillManager.getSkillInfo(this._skillId);
		this._selectNeedStat = skillInfo['selectNeedStat'];
		this._selectNeedBelong = skillInfo['selectNeedBelong'];
		this._isCustomSelectTarget = skillInfo['isCustomSelect'];
		// skill skillIcon
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
		this.setWarnIconVisible();
		// skillname
		this._skillNameTextField.text = skillInfo["skillName"];
		// fireneed text
		this._fireNeedTextField.text = skillInfo["fireNeed"];
		this._fireNeedTextField.width = this._fireNeedTextField.textWidth;
		// initial event listener
		this.addEventListener(
			egret.TouchEvent.TOUCH_BEGIN,
			this.onTouchBegin,
			this
		);
	}

	public setWarnIconVisible(): void {
		let caster = this.caster;
		if (caster == null || caster.alive) {
			this._warnIcon.visible = false;
		}
		if (caster != null && !caster.alive) {
			this._warnIcon.visible = true;
		}
	}

	private showInfo(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		let battleInfoPopupUI = scene.mBattleInfoPopupUI;
		battleInfoPopupUI.setDescFlowText(this.description);
		battleInfoPopupUI.setOnRight();
		LayerManager.Ins.popUpLayer.addChild(battleInfoPopupUI);
	}

	private hideInfo(): void {
		(SceneManager.Ins.curScene as BattleScene).mBattleInfoPopupUI.hide();
	}

	private castSelect(): void {
		L2Filters.addOutGlowFilter(this);
		let caster = this.caster;
		if (caster) {
			caster.selectAsCaster();
		}
	}

	private castUnSelect(): void {
		L2Filters.removeOutGlowFilter(this);
		let caster = this.caster;
		if (caster) {
			caster.unSelectAsCaster();
		}
	}

	private _touchBeginStageX: number;
	private _touchBeginStageY: number;
	private _touchBeginLocalX: number;
	private _touchBeginLocalY: number;
	private _touchBeginCardLocalX: number;
	private _touchBeginCardLocalY: number;
	private _isMove: boolean = false;
	private _selectedChar: Character = null;
	private _swipChar: Character = null;
	private onTouchBegin(e: egret.TouchEvent): void {
		this.showInfo();
		this.castSelect();
		this._touchBeginStageX = e.stageX;
		this._touchBeginStageY = e.stageY;
		let point = this.globalToLocal(e.stageX, e.stageY);
		this._touchBeginLocalX = point.x;
		this._touchBeginLocalY = point.y;
		this._touchBeginCardLocalX = this.x;
		this._touchBeginCardLocalY = this.y;
		this._isMove = false;
		this._selectedChar = null;
		this._swipChar = null;
		MessageManager.Ins.addEventListener(
			MessageType.StageTouchMove,
			this.onStageTouchMove,
			this
		);
		MessageManager.Ins.addEventListener(
			MessageType.StageTouchEnd,
			this.onStageTouchEnd,
			this
		);
	}

	private onStageTouchMove(msg: Message): void {
		let e: egret.TouchEvent = msg.messageContent;
		let touchStageX = e.stageX;
		let touchStageY = e.stageY;
		if (!this._isMove) {
			const minDis = 40;
			let disToBegin = (touchStageX - this._touchBeginStageX
			) ** 2 + (touchStageY - this._touchBeginStageY) ** 2;
			if (disToBegin > minDis) {
				this._isMove = true;
				this.hideInfo();
			}
			return;
		}

		// if is move

		// move card position
		let parent = this.parent;
		let point = parent.globalToLocal(touchStageX, touchStageY);
		this.x = point.x - this._touchBeginLocalX;
		this.y = point.y - this._touchBeginLocalY;
		let scene = SceneManager.Ins.curScene as BattleScene;

		// select target
		let caster = this._caster
		if (this._isCustomSelectTarget && (caster == null || caster.alive)) {
			// if this skill need to select a target
			for (let char of scene.mEnemies.concat(scene.mFriends)) {
				if (char.isNear(touchStageX, touchStageY)) {
					// if find a near char
					if (this._swipChar == char) return;
					this._swipChar = char;
					if (this._selectedChar != char &&
						this.canBeTarget(char)
					) {
						// and this char can be a target
						// set char as target
						char.selectAsTarget();
						if (this._selectedChar) this._selectedChar.unSelectAsTarget();
						this._selectedChar = char;
						return;
					}
					return;
				}
			}
			// if can not find a proper target
			if (this._selectedChar) {
				this._selectedChar.unSelectAsTarget();
				this._selectedChar = null;
			}
			this._swipChar = null;
		}
	}

	private canBeTarget(target: Character): boolean {
		if (this._selectNeedBelong == 1 && target.mCamp == CharCamp.Enemy) {
			ToastInfoManager.newRedToast("需要对我方单位释放");
			return false;
		}
		if (this._selectNeedBelong == 2 && target.mCamp == CharCamp.Player) {
			ToastInfoManager.newRedToast("需要对敌方单位释放");
			return false;
		}
		if (this._selectNeedStat == 1 && !target.alive) {
			ToastInfoManager.newRedToast("目标单位已死亡");
			return false;
		}
		if (this._selectNeedStat == 2 && target.alive) {
			ToastInfoManager.newRedToast("目标单位未死亡");
			return false;
		}
		return true;
	}

	private backToTouchBeginPos(): void {
		this.touchEnabled = false;
		egret.Tween.get(this).to({
			x: this._touchBeginCardLocalX,
			y: this._touchBeginCardLocalY
		}).call(() => this.touchEnabled = true);
	}

	private onStageTouchEnd(msg: Message): void {
		MessageManager.Ins.removeEventListener(
			MessageType.StageTouchMove,
			this.onStageTouchMove,
			this
		);
		MessageManager.Ins.removeEventListener(
			MessageType.StageTouchEnd,
			this.onStageTouchEnd,
			this
		);
		let scene = SceneManager.Ins.curScene as BattleScene;
		this.castUnSelect();
		if (this._selectedChar != null) {
			this._selectedChar.unSelectAsTarget();
		}
		if (this._isMove) {
			let e: egret.TouchEvent = msg.messageContent;
			let touchStageY = e.stageY;
			const castMinY = LayerManager.Ins.stageHeight * 2 / 3;
			if ((touchStageY < castMinY || this._selectedChar != null) && this.canCast()) {
				// if move and move scale large than threshold or select a cast char
				// cast card
				this.cast();
			} else {
				// card not cast
				this.backToTouchBeginPos();
				this._isMove = false;
			}
		} else {
			// not move means only tap card
			this.hideInfo();
		}
	}

	private canCast(): boolean {
		let scene = SceneManager.Ins.curScene as BattleScene;
		if (scene.mWinnerCamp != CharCamp.Neut) {
			ToastInfoManager.newRedToast("胜负已分");
			return false;
		}

		let skillInfo = ManualSkillManager.getSkillInfo(this._skillId);
		let fireboard = scene.mPlayerFireBoard;
		let fireNeed = skillInfo["fireNeed"];
		if (fireNeed > fireboard.mFireNum) {
			ToastInfoManager.newRedToast("能量不足");
			scene.mBattleUI.fireSufficentAnim();
			return false;
		}

		if (this._isCustomSelectTarget &&
			(this._caster == null || this._caster.alive) &&
			this._selectedChar == null
		) {
			// if caster is null or caster is alive
			// and this skill need a custom target
			// then must have a selectedChar before cast
			ToastInfoManager.newRedToast("需要对目标释放");
			return false;
		}
		return true;
	}

	private cast(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		if (scene.state instanceof PlayerUseCardPhase) {
			let skillInfo = ConfigManager.Ins.mSkillConfig[this._skillId];
			let fireboard = scene.mPlayerFireBoard;
			let fireNeed = skillInfo["fireNeed"];
			if (this.caster && !this.caster.alive) {
				// if hava a caster and caster is dead, go resurgence logic
				this.caster.getRsPoint(fireNeed);
			} else {
				// if no caster or caster alive
				let skill = scene.mManualSkillManager.newSkill(this._skillId, this.caster, CharCamp.Player);
				if (this._selectedChar != null) {
					skill.setPreSettargets([this._selectedChar]);
				}
				// cast skill
				scene.addToCastQueue(skill);
				// skill.cast();
			}

			// remove fire for casting skill
			fireboard.removeFires(fireNeed);

			// 如果不存在释放者或释放者还在游戏中，移除卡牌
			if ((!this.caster) || (this.caster && this.caster.isInBattle)) {
				// 这里之所以加这个判断是为了防止一张卡牌的效果事将自己排除处游戏外
				// 这个时候该卡牌会在释放技能的过程中就倍移除了，此时会造成重复删除的错误
				scene.mCardBoard.removeCard(this);
			}
		}

	}

	public release(): void {
		MessageManager.Ins.removeEventListener(
			MessageType.StageTouchMove,
			this.onStageTouchMove,
			this
		);
		MessageManager.Ins.removeEventListener(
			MessageType.StageTouchEnd,
			this.onStageTouchEnd,
			this
		);
		this.removeEventListener(
			egret.TouchEvent.TOUCH_BEGIN,
			this.onTouchBegin,
			this
		);
		this._selectedChar = null;
		this._swipChar = null;
		this._caster = null;
		this._cardInfo = null;
	}

}