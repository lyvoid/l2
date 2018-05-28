class PlayerRoundEndPhase extends ISceneState{
	protected scene: BattleScene;

	public initial(){
		super.initial();
		ToastInfoManager.Ins.newToast("我方回合结束阶段");
		// TODO 回合结束阶段buff结算
		for (let char of this.scene.friends){
			for (let buff of char.buffs.concat(char.hideBuffs).concat(char.passiveSkills)){
				buff.onCharEndPhase();
			}
		}
		// 回合结束阶段技能效果
		
		// 如果不在演出说明没有需要演出的技能，直接切下一个阶段
		this.scene.phaseUtil.changePhaseWithDelay(BattleSSEnum.EnemyRoundStartPhase);

	}

	public unInitial(){
		super.unInitial();
	}
}