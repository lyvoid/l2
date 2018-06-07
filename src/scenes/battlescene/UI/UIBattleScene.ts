class UIBattleScene extends eui.Component {
	private addCardButton: eui.Button;
	private addFireButton: eui.Button;
	public roundEndButton: eui.Button;
	public cardNumLabel: eui.Label;
	public fireNumLabel: eui.Label;


	public constructor() {
		super();
		this.skinName = "mySkin.UIBattleScene";

		// 这里的三个侦听事件就不做手动释放了，应该都会自己释放的
		this.roundEndButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			()=>{
				// 如果玩家点击了回合结束按键，进入到回合结束阶段
				this.roundEndButton.visible = false;
				// 回合结束
				(SceneManager.Ins.curScene.state as PlayerUseCardPhase).phaseEnd();
			},
			this
		);

		// 两个作弊功能
		this.addCardButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			()=>{
				let scene = SceneManager.Ins.curScene as BattleScene;
				scene.mCardBoard.distCardNormal();
			},
			this
		);
		// 作弊功能
		this.addFireButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			() =>{
				let scene = SceneManager.Ins.curScene as BattleScene;
				scene.mPlayerFireBoard.addFires(2);
			},
			this
		);
	}

}