class PhaseUtil{

    private static nextPhase: BattleSSEnum;

	public static changePhaseWithDelay(phase:BattleSSEnum, delay: number=1000){
		egret.setTimeout(PhaseUtil.changePhase, PhaseUtil, delay, phase);
	}

    public static changePhase(phase:BattleSSEnum){
        PhaseUtil.nextPhase = phase;
        let scene = SceneManager.Ins.curScene as BattleScene;
		if (!scene.isSkillPerforming) {
            // 如果不再演出中，直接跳到下一个状态
			scene.setState(phase);
		} else {
			// 如果正在演出
			// 侦听演出全部结束事件，全部结束也说明要切阶段了
			MessageManager.Ins.addEventListener(
				MessageType.SkillPerformAllEnd,
				PhaseUtil.onSkillPerformAllEnd,
				PhaseUtil
			);
		}
	}

	private static onSkillPerformAllEnd(): void {
		MessageManager.Ins.removeEventListener(
			MessageType.SkillPerformAllEnd,
			PhaseUtil.onSkillPerformAllEnd,
			PhaseUtil
		);
        (SceneManager.Ins.curScene as BattleScene).setState(
            PhaseUtil.nextPhase);
	}
}