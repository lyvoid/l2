class EnemyRoundEndPhase extends ISceneState{
	protected scene: BattleScene;

	public initial(scene: IScene){
		super.initial(scene);
		// TODO 删除模拟延迟

		ToastInfoManager.Ins.newToast("敌方回合结束阶段");

		// buff round--
		for (let char of this.scene.mEnemies){
			for (let buff of char.getAllBuff()){
				buff.onCharEndPhase();
			}
		}

		// 回合结束阶段技能效果
		this.scene.mRound++; //回合数加一
		this.scene.mPhaseUtil.changePhaseWithDelay(BattleSSEnum.PlayerRoundStartPhase);
	}

}