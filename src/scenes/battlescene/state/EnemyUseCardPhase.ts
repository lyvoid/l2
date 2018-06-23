class EnemyUseCardPhase extends ISceneState {

	protected scene: BattleScene;

	public initial(scene: IScene) {
		super.initial(scene);
		ToastInfoManager.Ins.newToast("敌方出牌阶段");
		let skillManager = this.scene.mManualSkillManager;
		for (let enemy of this.scene.mEnemies) {
			if (enemy.isInBattle && enemy.alive) {
				let skillId = enemy.manualSkillsId[0];
				skillManager.newSkill(skillId, enemy).cast();
			}
		}

		// 如果不在演出说明没有需要演出的技能，直接切下一个阶段
		this.scene.mPhaseUtil.changePhaseWithDelay(BattleSSEnum.EnemyRoundEndPhase);

	}

}