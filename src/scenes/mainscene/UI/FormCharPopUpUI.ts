class FormCharPopUpUI extends eui.Component {

	private backButton: eui.Button;
	private p0Img: eui.Image;
	private p1Img: eui.Image;
	private p2Img: eui.Image;
	private p3Img: eui.Image;
	private p4Img: eui.Image;
	private p5Img: eui.Image;
	private _p6Imgs: eui.Image[];
	private _userTeam;
	private _rsLoader: ResAsyncLoadManager = new ResAsyncLoadManager();

	public constructor() {
		super();
		this.skinName = "mySkin.FormCharPopUpUI";
		this.width = LayerManager.Ins.stageWidth;
		this.height = LayerManager.Ins.stageHeight;
		this._p6Imgs = [this.p0Img, this.p1Img, this.p2Img, this.p3Img, this.p4Img, this.p5Img];
		this.backButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onCloseTap,
			this
		);
		for (let img of this._p6Imgs) {
			img.addEventListener(
				egret.TouchEvent.TOUCH_TAP,
				this.onChangeChar,
				this
			);
		}
		let userTeam = UserData.Ins.userTeam;
		this._userTeam = userTeam;
		this.initial();
		LayerManager.Ins.popUpLayer.addChild(this);
	}

	public initial(): void {
		let userTeam = this._userTeam;
		let userArmy = UserData.Ins.userArmy;
		for (let i in userTeam) {
			if (userTeam[i] >= 0) {
				let portName = ConfigManager.Ins.mCharConfig[userArmy[userTeam[i]]]["charCode"] + "_portrait_png";
				this._p6Imgs[i].texture = RES.getRes("imgloading_png");
				this._rsLoader.getResAsyncAndSetValue(portName, "texture", this._p6Imgs[i]);
			} else {
				this._p6Imgs[i].texture = RES.getRes("defaultselect_png");
			}
		}
	}

	private onCloseTap(): void {
		this.hide();
	}

	private _selectCharPopUpUI: SelectCharPopUpUI;
	private onChangeChar(e): void {
		let charOrder = this._p6Imgs.indexOf(e.target);
		if (this._selectCharPopUpUI == null){
			this._selectCharPopUpUI = new SelectCharPopUpUI(charOrder, this);
		} else {
			this._selectCharPopUpUI.show(charOrder);
		}
		this.hide();
	}

	public show(): void{
		this.initial();
		this.visible = true;
		this.enabled = true;
	}
	
	public hide(): void{

		this.visible = false;
		this.enabled = false;
	}

	public release(): void {
		this.backButton.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onCloseTap,
			this
		);
		for (let img of this._p6Imgs) {
			img.removeEventListener(
				egret.TouchEvent.TOUCH_TAP,
				this.onChangeChar,
				this
			);
		}
		if (this._selectCharPopUpUI != null){
			this._selectCharPopUpUI.release();
			this._selectCharPopUpUI = null;
		}
		this._p6Imgs = null;
		// 释放所有资源
		this._rsLoader.releaseResource();
		this._rsLoader = null;
	}

}