class UIBattleScene extends eui.Component {
	private addCardButton: eui.Button;
	private addFireButton: eui.Button;
	public roundEndButton: eui.Button;
	public cardNumLabel: eui.Label;
	public fireNumLabel: eui.Label;
	public roundLabel: eui.Label;
	private remainCardInfo: eui.Label;
	public set remainCardNum(value: number){
		this.remainCardInfo.text = `${value}`;
		this.remainCardInfo.textColor = value==0 ? 0xEE2C2C : 0x7FFF00
	};


	public constructor() {
		super();
		this.skinName = "mySkin.UIBattleScene";

		this.roundEndButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onRoundEndButtonTap,
			this
		);

		// 两个作弊功能
		this.addCardButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onACBTTap,
			this
		);
		this.addFireButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onAFBTTap,
			this
		);
	}

	private onRoundEndButtonTap(): void {
		this.roundEndButton.visible = false;
		// 回合结束
		let scene = SceneManager.Ins.curScene as BattleScene;
		scene.setState(new PlayerRoundEndPhase());
	}

	private onACBTTap(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		scene.mCardBoard.distCardNormal();
	}

	private onAFBTTap(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		scene.mPlayerFireBoard.addFires(2);
	}

	public release(): void {
		this.addCardButton.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onACBTTap,
			this
		);
		this.addFireButton.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onAFBTTap,
			this
		);
		this.roundEndButton.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onRoundEndButtonTap,
			this
		);
		this.addCardButton = null;
		this.addFireButton = null;
		this.roundEndButton = null;
		this.cardNumLabel = null;
		this.fireNumLabel = null;
		this.roundLabel = null;
		this.removeChildren();
	}

}