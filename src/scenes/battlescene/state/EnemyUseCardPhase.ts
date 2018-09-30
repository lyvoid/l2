class EnemyUseCardPhase extends ISceneState {

	public initial() {
		ToastInfoManager.newToast("敌方出牌阶段");
		let scene = SceneManager.Ins.curScene as BattleScene;
		let skillManager = scene.mManualSkillManager;
		for (let enemy of scene.mEnemies) {
			if (enemy.isInBattle && enemy.alive && !enemy.isDiz) {
				enemy.mAi.run();
			}
		}

		// 如果不在演出说明没有需要演出的技能，直接切下一个阶段
		scene.setState(new EnemyRoundEndPhase());
	}

}