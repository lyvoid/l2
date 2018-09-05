class EnemyRoundEndPhase extends ISceneState{

	public initial(){
		ToastInfoManager.Ins.newToast("敌方回合结束阶段");

		let scene = SceneManager.Ins.curScene as BattleScene;
		// buff round--
		for (let char of scene.mEnemies){
			for (let buff of char.getAllBuff()){
				buff.onCharEndPhase();
			}
		}

		// 回合结束阶段技能效果
		scene.mRound++; //回合数加一
		scene.mBattleUI.roundLabel.text = `第 ${scene.mRound} 回合`;
		scene.setState(new PlayerRoundStartPhase());
	}

}