class EnemyRoundEndPhase extends ISceneState{
	protected scene: BattleScene;

	public initial(){
		super.initial();
		// TODO 删除模拟延迟

		ToastInfoManager.Ins.newToast("敌方回合结束阶段");

		// TODO 回合结束阶段buff结算
		for (let char of this.scene.mEnemies){
			for (let buff of char.mBuffs.concat(char.mHideBuffs).concat(char.mPassiveSkills)){
				buff.onCharEndPhase();
			}
		}

		// 回合结束阶段技能效果
		this.scene.mRound++; //回合数加一
		this.scene.mPhaseUtil.changePhaseWithDelay(BattleSSEnum.PlayerRoundStartPhase);
	}

	public uninitial(){
		super.uninitial();
	}

}