class PlayerRoundEndPhase extends ISceneState {

	public initial() {
		ToastInfoManager.newToast("我方回合结束阶段");
		let scene = SceneManager.Ins.curScene as BattleScene;
		// TODO 回合结束阶段buff结算
		for (let char of scene.mFriends) {
			for (let buff of char.getAllBuff()) {
				buff.onCharEndPhase();
			}
		}
		// 回合结束阶段技能效果
		
		// 如果不在演出说明没有需要演出的技能，直接切下一个阶段
		scene.setState(new EnemyRoundStartPhase());

	}

}