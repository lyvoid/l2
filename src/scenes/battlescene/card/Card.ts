class Card extends egret.DisplayObjectContainer {
	private _skillId: number;
	private _cardInfo: CardInfo;
	private _cdMask: egret.Shape;
	private _curCdText: egret.TextField;
	public get cardInfo(): CardInfo { return this._cardInfo; }
	private _caster: Character
	public get caster(): Character { return this._caster; }
	private get _recycleTimes(): number {
		return this._cardInfo.recycleTimes;
	};
	private get _maxCd(): number {
		return this._cardInfo.maxCd;
	}
	private get _curCd(): number {
		return this._cardInfo.curCd;
	}
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
<b>冷却时间:</b> <font color="#EE4000"><b>${this._maxCd}</b></font> 回合
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
		skillNameTextField.textAlign = egret.HorizontalAlign.CENTER;
		skillNameTextField.verticalAlign = egret.VerticalAlign.MIDDLE;
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
		// cd mask
		let cdMask = new egret.Shape();
		cdMask.graphics.beginFill(0x0, 0.8);
		cdMask.y = 7;
		cdMask.graphics.drawRect(0, 0, 80, 123);
		cdMask.graphics.endFill();
		let cdMaskmask = new egret.Shape();
		this.addChild(cdMask);
		this._cdMask = cdMask;
		cdMaskmask.x = 40;
		cdMaskmask.y = 65;
		this._cdMask.mask = cdMaskmask;
		this.addChild(cdMaskmask);
		// cd text
		let cdText = new egret.TextField();
		cdText.textAlign = egret.HorizontalAlign.CENTER;
		cdText.verticalAlign = egret.VerticalAlign.MIDDLE;
		cdText.width = 80;
		cdText.height = 130;
		cdText.size = 16;
		this._curCdText = cdText;
		this.addChild(cdText);
	}

	private _warnIcon: egret.Bitmap;
	private _isCustomSelectTarget: boolean;
	private _selectNeedStat: number;
	private _selectNeedBelong: number;
	public initial(cardInfo: CardInfo): void {
		let rsLoad = (SceneManager.Ins.curScene as BattleScene).mRsLoader;
		// initial info
		this._cardInfo = cardInfo;
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
		this.refreshCdMask();
	}

	public setCurCd(value: number) {
		this._cardInfo.curCd = value;
		this.refreshCdMask();
	}

	private refreshCdMask(): void {
		if (this._curCd == 0) {
			this._cdMask.visible = false;
			this._curCdText.visible = false;
			return;
		}
		this._cdMask.visible = true;
		this._curCdText.visible = true;
		this._curCdText.text = "冷却剩余:\n" + this._curCd + "回合";
		let shape = this._cdMask.mask as egret.Shape;
		shape.graphics.clear();
		shape.graphics.beginFill(0x0000ff);
		let x = 0;
		let y = 0;
		let r = 150;
		let progress = (this._maxCd - this._curCd) / this._maxCd;
		let startRadian = Math.PI * (progress * 2 - 0.5);
		let endRadian = Math.PI * 1.5;
		shape.graphics.moveTo(x, y);//绘制点移动(r, r)点
		shape.graphics.lineTo(x, y - r);//画线到弧的起始点
		shape.graphics.drawArc(x, y, r, startRadian, endRadian, false);//从起始点顺时针画弧到终点
		shape.graphics.lineTo(x, y);//从终点画线到圆形。到此扇形的封闭区域形成
		shape.graphics.endFill();
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
	private _canCastJudgeBefore: boolean = false;
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
		this._canCastJudgeBefore = false;
		if ((SceneManager.Ins.curScene as BattleScene).state instanceof PlayerUseCardPhase) {
			MessageManager.Ins.addEventListener(
				MessageType.StageTouchMove,
				this.onStageTouchMove,
				this
			);
		}
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
		let scene = SceneManager.Ins.curScene as BattleScene;
		if (!this._isMove) {
			const minDis = 40;
			let disToBegin = (touchStageX - this._touchBeginStageX
			) ** 2 + (touchStageY - this._touchBeginStageY) ** 2;
			if (disToBegin > minDis) {
				if (this._canCastJudgeBefore ||
					(this._canCastJudgeBefore = !this.canCast(false))) {
					return;
				}
				this._isMove = true;
				this.hideInfo();
				let caster = this.caster;
				if (this._isCustomSelectTarget) {
					this.visible = false;
					let targetSelectFingerPicCont = scene.mTargetSelectFingerPicContainer;
					targetSelectFingerPicCont.visible = true;
					targetSelectFingerPicCont.scaleX = 1;
					targetSelectFingerPicCont.scaleY = 1;
					targetSelectFingerPicCont.x = touchStageX;
					targetSelectFingerPicCont.y = touchStageY;
					egret.Tween.get(targetSelectFingerPicCont, { loop: true }).to({
						scaleX: 3,
						scaleY: 3,
					}, 500).to({
						scaleX: 1,
						scaleY: 1,
					}, 500);
				}
			}
			return;
		}

		// if is move
		if (this._isCustomSelectTarget) {
			let targetSelectFingerPic = scene.mTargetSelectFingerPicContainer;
			targetSelectFingerPic.x = touchStageX;
			targetSelectFingerPic.y = touchStageY;
		}
		// move card position
		let parent = this.parent;
		let point = parent.globalToLocal(touchStageX, touchStageY);
		this.x = point.x - this._touchBeginLocalX;
		this.y = point.y - this._touchBeginLocalY;


		// select target
		let caster = this._caster;
		if (this._isCustomSelectTarget) {
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
		if (target.isInPerf){
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
		this.visible = true;
		egret.Tween.removeTweens(scene.mTargetSelectFingerPicContainer);
		scene.mTargetSelectFingerPicContainer.visible = false;
		this.castUnSelect();
		if (this._selectedChar != null) {
			this._selectedChar.unSelectAsTarget();
		}
		if (this._isMove) {
			let e: egret.TouchEvent = msg.messageContent;
			let touchStageY = e.stageY;
			if ((this._touchBeginStageY - touchStageY > 100 || this._selectedChar != null) && this.canCast()) {
				// if move and move scale large than threshold or select a cast char
				// cast card
				if (this.caster == null || this.caster.alive) {
					// if cater is not die
					this.setCurCd(this._maxCd);
				}
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

	private isFireSufficent(): boolean {
		let scene = SceneManager.Ins.curScene as BattleScene;
		let skillInfo = ManualSkillManager.getSkillInfo(this._skillId);
		let fireboard = scene.mPlayerFireBoard;
		let fireNeed = skillInfo["fireNeed"];
		if (fireNeed > fireboard.mFireNum) {
			return false;
		}
		return true;
	}

	private canCast(withTarget: boolean = true): boolean {
		let scene = SceneManager.Ins.curScene as BattleScene;
		if (scene.mWinnerCamp != CharCamp.Neut) {
			ToastInfoManager.newRedToast("胜负已分");
			return false;
		}

		if (!this.isFireSufficent()) {
			ToastInfoManager.newRedToast("能量不足");
			scene.mBattleUI.fireSufficentAnim();
			return false;
		}

		let caster = this.caster;

		if (caster) {
			if (caster.isDiz) {
				ToastInfoManager.newRedToast("释放单位眩晕中，无法释放");
				return false;
			}
		}

		if (caster && caster.alive) {
			if (this._curCd != 0) {
				ToastInfoManager.newRedToast("冷却中");
				return false;
			}
		}

		if (withTarget &&
			this._isCustomSelectTarget &&
			(caster == null || caster.alive) &&
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

	public removeOneTime(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		// if recycleTimes > 0, recycleTimes --
		if (this._cardInfo.recycleTimes > 0) {
			this._cardInfo.recycleTimes--;
		}
		// if recycleTimes != 0, card back to deck, 
		// else this card info will be delete with releasing
		if (this._cardInfo.recycleTimes != 0) {
			scene.mCardInfoDeck.push(this._cardInfo);
			scene.mBattleUI.remainCardNum = scene.mCardInfoDeck.length;
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