class PlayerUseCardPhase extends ISceneState {
	protected scene: BattleScene;

	public initial(scene: IScene){
		super.initial(scene);
		ToastInfoManager.Ins.newToast("我方出牌阶段");
		// 显示下一个回合的按键
		this.scene.mBattleUI.roundEndButton.visible = true;

		// TODO: 自动模式下自动释放技能及切换阶段
	}
}