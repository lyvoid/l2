/**
 * 玩家回合开始阶段
 */
class PlayerRoundStartPhase extends ISceneState {
	protected scene: BattleScene;

	public initial(scene: IScene) {
		super.initial(scene);

		// 1.发牌 + 能量
		// 2.buff结算
		// 3.回合开始的技能及效果
		ToastInfoManager.Ins.newToast("我方回合开始阶段");

		MessageManager.Ins.sendMessage(MessageType.PlayerRoundStart);

		// 发牌
		this.scene.mCardBoard.distCardNormal();
		this.scene.mCardBoard.distCardNormal();

		// 加能量
		// 第几回合加到几点
		let fireNum = this.scene.mPlayerFireBoard.mFireNum;
		let fireAdd = this.scene.mRound - fireNum;
		if (fireAdd > 0) {
			this.scene.mPlayerFireBoard.addFires(fireAdd);
		}

		// buff结算(待增加

		// 回合开始的技能及效果（待增加
		// 切下一个阶段
		this.scene.mPhaseUtil.changePhaseWithDelay(BattleSSEnum.PlayerUseCardPhase);
	}

}