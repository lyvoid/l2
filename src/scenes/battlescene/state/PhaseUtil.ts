class PhaseUtil{

    private static nextPhase: BattleSSEnum;

	public static changePhase(phase:BattleSSEnum){
		egret.setTimeout(this.changePhase1, this, 2000, phase);
	}

    public static changePhase1(phase:BattleSSEnum){
        this.nextPhase = phase;
        let scene = SceneManager.Ins.curScene as BattleScene;
		if (!scene.isSkillPerforming) {
            // 如果不再演出中，直接跳到下一个状态
			scene.setState(phase);
		} else {
			// 如果正在演出
			// 侦听演出全部结束事件，全部结束也说明要切阶段了
			MessageManager.Ins.addEventListener(
				MessageType.SkillPerformAllEnd,
				this.onSkillPerformAllEnd,
				this
			);
		}
	}

	private static onSkillPerformAllEnd(): void {
		MessageManager.Ins.addEventListener(
			MessageType.SkillPerformAllEnd,
			this.onSkillPerformAllEnd,
			this
		);
        (SceneManager.Ins.curScene as BattleScene).setState(
            this.nextPhase);
	}
}