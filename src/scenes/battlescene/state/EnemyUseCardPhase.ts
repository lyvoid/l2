class EnemyUseCardPhase extends ISceneState{

	protected scene: BattleScene;

	public initial(){
		super.initial();
		ToastInfoManager.Ins.newToast("敌方出牌阶段");
		// TODO 回合结束阶段buff结算

		// 技能效果
		let s =new SkillOneDamageWithOut(
			ManualSkill.getFirstAlive(this.scene.mEnemies)
		);
		this.scene.mCastQueue.push(s);
		// this.scene.skillTodoQue.push(s);
		this.scene.startTodoSkill();
		
		// 如果不在演出说明没有需要演出的技能，直接切下一个阶段
		this.scene.mPhaseUtil.changePhaseWithDelay(BattleSSEnum.EnemyRoundEndPhase);

	}

	public unInitial(){
		super.unInitial();
	}
}