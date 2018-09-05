class EnemyRoundStartPhase extends ISceneState{

	public initial(){
		ToastInfoManager.Ins.newToast("敌方回合开始阶段");
		let scene = SceneManager.Ins.curScene as BattleScene;
		MessageManager.Ins.sendMessage(MessageType.EnemyRoundStart);

		// 如果不在演出说明没有需要演出的技能，直接切下一个阶段
		scene.setState(new EnemyUseCardPhase());
	}

}