class UIBattleScene extends eui.Component {
	private addCardButton: eui.Button;
	private addFireButton: eui.Button;
	public roundEndButton:eui.Button;

	public constructor() {
		super();
		this.skinName = "mySkin.UIBattleSceneSkin";

		// 这里的三个侦听事件就不做手动释放了，应该都会自己释放的
		this.roundEndButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			()=>{
				// 如果玩家点击了回合结束按键，进入到回合结束阶段
				this.roundEndButton.visible = false;
				MessageManager.Ins.sendMessage(MessageType.UseCardPhaseEnd);
			},
			this
		);

		// 两个作弊功能
		this.addCardButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			()=>{
				let scene = SceneManager.Ins.curScene as BattleScene;
				scene.cardBoard.distCardNormal();
			},
			this
		);
		// 作弊功能
		this.addFireButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			() =>{
				let scene = SceneManager.Ins.curScene as BattleScene;
				scene.playerFireBoard.addFires(2);
			},
			this
		);
	}

}