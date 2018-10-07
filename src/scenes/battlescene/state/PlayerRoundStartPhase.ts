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

		// cur cd --
		for (let cardInfo of scene.mCardInfoDeck){
			cardInfo.curCd = Math.max(cardInfo.curCd - 1, 0);
		}

		// 发牌
		scene.mCardBoard.distCardNormal();
		scene.mCardBoard.distCardNormal();

		// 每回合加3点
		scene.mPlayerFireBoard.addFires(3);

		// buff结算(待增加

		// 回合开始的技能及效果（待增加
		// 切下一个阶段
		scene.setState(new PlayerUseCardPhase());
	}

}