class PlayerUseCardPhase extends ISceneState {

	public initial(){
		ToastInfoManager.newToast("我方出牌阶段");
		let scene = SceneManager.Ins.curScene as BattleScene;
		// 显示下一个回合的按键
		scene.mBattleUI.showRoundEndButton();

		// TODO: 自动模式下自动释放技能及切换阶段
	}
}