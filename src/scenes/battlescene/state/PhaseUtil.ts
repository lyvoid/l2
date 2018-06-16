class PhaseUtil {

    private nextPhase: BattleSSEnum;

	public changePhaseWithDelay(phase:BattleSSEnum, delay: number=1000){
		if((SceneManager.Ins.curScene as BattleScene).mWinnerCamp == CharCamp.Neut){
			egret.setTimeout(this.changePhase, this, delay, phase);
		}
	}

    public changePhase(phase:BattleSSEnum){
        this.nextPhase = phase;
        let scene = SceneManager.Ins.curScene as BattleScene;
		scene.setState(phase);
	}

	public release(): void{
	}
}