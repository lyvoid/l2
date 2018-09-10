class UIMainScene extends eui.Component {

	private battleButton: eui.Button;
	private cardButton: eui.Button;
	public formButton: eui.Button;

	public constructor() {
		super();
		this.skinName = "mySkin.UIMainScene";
		this.width = LayerManager.Ins.stageWidth;
		this.height = LayerManager.Ins.stageHeight;
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
		LayerManager.Ins.uiLayer.addChild(this);
	}

	private onBattleButtonTouch(): void{
		let sum = 0;
		for (let i of UserData.Ins.userTeam){
			sum += i;
		}
		if (sum == -6){
			MyAlert.Ins.show("当前队伍为空，请先完成编队再进行挑战。");
			return;
		}
		SceneManager.Ins.setScene(new BattleScene());
	}

	private _formCardPopUpUI: FormCardPopUpUI;
	private onCardButtonTouch(): void{
		if(this._formCardPopUpUI == null){
			this._formCardPopUpUI = new FormCardPopUpUI();
		} else {
			this._formCardPopUpUI.show();
		}
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
		if (this._formCardPopUpUI != null){
			this._formCardPopUpUI.release();
			this._formCardPopUpUI = null;
		}
	}
}