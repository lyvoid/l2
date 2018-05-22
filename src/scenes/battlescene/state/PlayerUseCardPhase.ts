class PlayerUseCardPhase extends ISceneState {
	protected scene: BattleScene;

	public initial() {
		super.initial();
		ToastInfoManager.Ins.newToast("我方出牌阶段");
		// 显示下一个回合的按键
		this.scene.battleUI.roundEndButton.visible = true;
		// 绑定卡牌tap使用事件
		MessageManager.Ins.addEventListener(
			MessageType.CardTouchTap,
			this.onCardTouchTap,
			this
		);

		// TODO 自动模式下自动释放技能

		// 收到按键消息，准备跳转下一个阶段
		MessageManager.Ins.addEventListener(
			MessageType.UseCardPhaseEnd,
			this.onUseCardPhaseEnd,
			this
		);

		// TODO 如果自动模式发送回合结束消息
		// MessageManager.Ins.sendMessage(MessageType.UseCardPhaseEnd);
	}

	private onUseCardPhaseEnd(): void {
		MessageManager.Ins.removeEventListener(
			MessageType.UseCardPhaseEnd,
			this.onUseCardPhaseEnd,
			this
		);
		// 一收到结束消息就要去掉使用卡牌的侦听
		MessageManager.Ins.removeEventListener(
			MessageType.CardTouchTap,
			this.onCardTouchTap,
			this
		);
		this.scene.phaseUtil.changePhaseWithDelay(BattleSSEnum.PlayerRoundEndPhase);
	}

	private onCardTouchTap(e: Message): void {
		let card: Card = e.messageContent;
		let scene = this.scene;
		if (scene.winnerCamp) {
			ToastInfoManager.Ins.newToast("胜负已分");
			return;
		}

		if (!(card.skill.caster && card.skill.caster.alive && card.skill.caster.attr.isInBattle)) {
			ToastInfoManager.Ins.newToast("释放者处于无法释放的状态中");
			return;
		}
		let fireboard = scene.playerFireBoard;
		let fireNeed = card.skill.fireNeed;
		if (fireNeed > fireboard.fireNum) {
			ToastInfoManager.Ins.newToast("能量不足");
			return;
		}

		if (card.skill.targetType == TargetType.SpecialEnemy &&
			(!scene.selectedEnemy.attr.isInBattle)) {
			ToastInfoManager.Ins.newToast("选中目标已从游戏中排除");
			return;
		}

		// 如果目标类型为特定单位，但该单位已经死亡
		// （发生在之前的技能已经把敌方打死但是演出还没结束的时候）
		if (card.skill.targetType == TargetType.SpecialEnemy &&
			(!scene.selectedEnemy.alive)) {
			ToastInfoManager.Ins.newToast("选中目标已死亡");
			return;
		}

		// 使用技能
		card.skill.useSkill();

		// 移除所需要的点数
		for (let i = 0; i < card.skill.fireNeed; i++) {
			fireboard.removeFire();
		}

		// 移除卡牌
		scene.cardBoard.removeCard(card);

	}

	public unInitial() {
		super.unInitial();
		// 隐藏回合结束按键，已经在按键的tap事件中隐藏了，这里不额外隐藏
		// this.scene.battleUI.roundEndButton.visible = false;

		// 结束的时候也要去掉侦听
		MessageManager.Ins.removeEventListener(
			MessageType.CardTouchTap,
			this.onCardTouchTap,
			this
		);
		MessageManager.Ins.removeEventListener(
			MessageType.UseCardPhaseEnd,
			this.onUseCardPhaseEnd,
			this
		);
	}
}