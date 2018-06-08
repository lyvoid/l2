class PlayerUseCardPhase extends ISceneState {
	protected scene: BattleScene;

	public initial() {
		super.initial();
		ToastInfoManager.Ins.newToast("我方出牌阶段");
		// 显示下一个回合的按键
		this.scene.mBattleUI.roundEndButton.visible = true;
		// 绑定卡牌tap使用事件
		MessageManager.Ins.addEventListener(
			MessageType.CardTouchTap,
			this.onCardTouchTap,
			this
		);

		// TODO 自动模式下自动释放技能
	}

	/**
	 * 阶段结束需要自行调用
	 */
	public phaseEnd(): void {
		// 一收到结束消息就要去掉使用卡牌的侦听
		MessageManager.Ins.removeEventListener(
			MessageType.CardTouchTap,
			this.onCardTouchTap,
			this
		);
		this.scene.mPhaseUtil.changePhaseWithDelay(BattleSSEnum.PlayerRoundEndPhase);
	}

	private onCardTouchTap(e: Message): void {
		let card: Card = e.messageContent;
		let scene = this.scene;
		if (scene.mWinnerCamp) {
			ToastInfoManager.Ins.newToast("胜负已分");
			return;
		}

		if (!(card.skill.caster && card.skill.caster.alive && card.skill.caster.isInBattle)) {
			ToastInfoManager.Ins.newToast("释放者处于无法释放的状态中");
			return;
		}
		let fireboard = scene.mPlayerFireBoard;
		let fireNeed = card.skill.fireNeed;
		if (fireNeed > fireboard.fireNum) {
			ToastInfoManager.Ins.newToast("能量不足");
			return;
		}

		// if can't cast, return
		let canCastInfo = card.skill.canCast();
		if (canCastInfo[0]) {
			ToastInfoManager.Ins.newToast(canCastInfo[1]);
			return;
		}

		// 使用技能
		card.skill.cast();

		// 移除所需要的点数
		for (let i = 0; i < card.skill.fireNeed; i++) {
			fireboard.removeFire();
		}

		// 移除卡牌
		scene.mCardBoard.removeCard(card);

	}

	public uninitial() {
		super.uninitial();
		// 隐藏回合结束按键，已经在按键的tap事件中隐藏了，这里不额外隐藏
		// this.scene.battleUI.roundEndButton.visible = false;

		// 结束的时候也要去掉侦听
		MessageManager.Ins.removeEventListener(
			MessageType.CardTouchTap,
			this.onCardTouchTap,
			this
		);
	}
}