class UIMainScene extends eui.Component {

	private battleButton: eui.Button;
	private cardButton: eui.Button;
	public formButton: eui.Button;

	public constructor() {
		super();
		this.skinName = "mySkin.UIMainScene";
		this.battleButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onBattleButtonTouch,
			this
		);
		this.cardButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onCardButtonTouch,
			this
		);
		this.formButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onFormButtonTouch,
			this
		);
	}

	private onBattleButtonTouch(): void{
		SceneManager.Ins.setScene(new BattleScene());
	}

	private onCardButtonTouch(): void{

	}

	private _formCharPopUpUI: FormCharPopUpUI;
	private onFormButtonTouch(): void{
		if(this._formCharPopUpUI == null){
			this._formCharPopUpUI = new FormCharPopUpUI();
		} else {
			this._formCharPopUpUI.show();
		}
	}


	public release(): void{
		this.battleButton.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onBattleButtonTouch,
			this
		);
		this.cardButton.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onCardButtonTouch,
			this
		);
		this.formButton.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onFormButtonTouch,
			this
		);
		if (this._formCharPopUpUI != null){
			this._formCharPopUpUI.release();
			this._formCharPopUpUI = null;
		}
	}

}