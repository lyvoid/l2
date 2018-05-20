class BattleEndPopUp extends eui.Component {


	public titleLabel: eui.Label;
	public exitButton: eui.Button;
	public nextButton: eui.Button;
	public retryButton: eui.Button;

	public constructor() {
		super();
		this.skinName = "mySkin.BattleEndPopUpSkin";
		this.nextButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			()=>{
				SceneManager.Ins.setScene(new BattleScene(SceneManager.Ins));
			},this);

		this.retryButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			()=>{
				SceneManager.Ins.setScene(new BattleScene(SceneManager.Ins));
			},this);
	};

	/**
	 * 胜利的时候调整UI
	 */
	public winUIAdjust(): void {
		this.titleLabel.text = "战斗胜利";
		this.nextButton.visible = true;
		this.retryButton.visible = false;
	}

	/**
	 * 失败的时候调整UI
	 */
	public lostUIAdjust(): void {
		this.titleLabel.text = "战斗失败";
		this.nextButton.visible = false;
		this.retryButton.visible = true;
	}

}