class EnemyUseCardPhase extends ISceneState{

	protected scene: BattleScene;

	public initial(){
		super.initial();
		ToastInfoManager.Ins.newToast("敌方出牌阶段");
		// TODO 回合结束阶段buff结算

		// 技能效果
		
		// 如果不在演出说明没有需要演出的技能，直接切下一个阶段
		this.scene.mPhaseUtil.changePhaseWithDelay(BattleSSEnum.EnemyRoundEndPhase);

	}

	public uninitial(){
		super.uninitial();
	}
}