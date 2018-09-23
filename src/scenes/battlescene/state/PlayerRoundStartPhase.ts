/**
 * 玩家回合开始阶段
 */
class PlayerRoundStartPhase extends ISceneState {

	public initial() {

		// 1.发牌 + 能量
		// 2.buff结算
		// 3.回合开始的技能及效果
		ToastInfoManager.newToast("我方回合开始阶段");
		let scene = SceneManager.Ins.curScene as BattleScene;
		MessageManager.Ins.sendMessage(MessageType.PlayerRoundStart);

		// 发牌
		scene.mCardBoard.distCardNormal();
		scene.mCardBoard.distCardNormal();

		// 加能量
		// 第几回合加到几点
		let fireNum = scene.mPlayerFireBoard.mFireNum;
		let fireAdd = scene.mRound - fireNum;
		if (fireAdd > 0) {
			scene.mPlayerFireBoard.addFires(fireAdd);
		}

		// buff结算(待增加

		// 回合开始的技能及效果（待增加
		// 切下一个阶段
		scene.setState(new PlayerUseCardPhase());
	}

}