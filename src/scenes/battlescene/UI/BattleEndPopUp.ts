class BattleEndPopUp extends eui.Component {


	public titleLabel: eui.Label;
	public exitButton: eui.Button;
	public nextButton: eui.Button;
	public retryButton: eui.Button;

	public constructor() {
		super();
		this.skinName = "mySkin.BattleEndPopUp";
		this.nextButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onNextButtonTap,
			this
		);

		this.retryButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onRetryButtonTap,
			this
		);

		this.exitButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onExitButtonTap,
			this
		);
	}

	private onNextButtonTap(): void {
		SceneManager.Ins.setScene(new BattleScene());
	}

	private onRetryButtonTap(): void {
		SceneManager.Ins.setScene(new BattleScene());
	}

	private onExitButtonTap(): void{
		SceneManager.Ins.setScene(new MainScene());
	}

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

	public release(): void {
		this.nextButton.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onNextButtonTap,
			this
		);

		this.retryButton.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onRetryButtonTap,
			this
		);

		this.exitButton.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onExitButtonTap,
			this
		);
		this.titleLabel = null;
		this.nextButton = null;
		this.retryButton = null;
		this.exitButton = null;
		this.removeChildren();
	}

}