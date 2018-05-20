class PhaseUtil {

    private nextPhase: BattleSSEnum;

	public changePhaseWithDelay(phase:BattleSSEnum, delay: number=1000){
		egret.setTimeout(this.changePhase, this, delay, phase);
	}

    public changePhase(phase:BattleSSEnum){
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

	private onSkillPerformAllEnd(): void {
		MessageManager.Ins.removeEventListener(
			MessageType.SkillPerformAllEnd,
			this.onSkillPerformAllEnd,
			this
		);
        (SceneManager.Ins.curScene as BattleScene).setState(
            this.nextPhase);
	}

	public clear(): void{
		MessageManager.Ins.removeEventListener(
			MessageType.SkillPerformAllEnd,
			this.onSkillPerformAllEnd,
			this
		);
	}
}