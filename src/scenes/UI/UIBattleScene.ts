class UIBattleScene extends eui.Component {
	private nextButton: eui.Button;
	private changeButton: eui.Button;

	public constructor() {
		super();
		// this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
		this.skinName = "resource/eui_skins/ui/UIBattleScene.exml";

		this.nextButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			() => MessageManager.Ins.sendMessage(
				MessageType.ClickNextButton
			),
			this
		);
		
		this.changeButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			() =>{
				let scene = SceneManager.Ins.curScene as BattleScene;
				scene.playerFireBoard.addFire();
				scene.playerFireBoard.addFire();
			},
			this
		);
	}

}