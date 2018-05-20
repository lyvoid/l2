class EnemyRoundEndPhase extends ISceneState{
	protected scene: BattleScene;

	public initial(){
		super.initial();
		// TODO 删除模拟延迟

		ToastInfoManager.Ins.newToast("敌方回合结束阶段");
		// TODO 回合结束阶段buff结算
		// 回合结束阶段技能效果

		PhaseUtil.changePhaseWithDelay(BattleSSEnum.PlayerRoundStartPhase);
	}

	public unInitial(){
		super.unInitial();
	}

}