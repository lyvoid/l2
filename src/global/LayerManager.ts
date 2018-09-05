class LayerManager {

	public gameLayer: egret.DisplayObjectContainer;
	public uiLayer: eui.UILayer;
	private _maskLayer: eui.UILayer;
	public popUpLayer: eui.UILayer;
	private _loadingUI: LoadingUI;
	public stageWidth: number;
	public stageHeight: number;
	private _maskBg: egret.Bitmap;
	private static _instance: LayerManager;

	public static get Ins(): LayerManager {
		if (this._instance == null) {
			this._instance = new LayerManager();
		}
		return this._instance;
	}

	public get loadingUI(): LoadingUI {
		return this._loadingUI;
	}

	private constructor() { }

	public initial(stage: egret.Stage) {
		// save width and height of stage in this class
		let stageWidth = stage.stageWidth;
		let stageHeight = stage.stageHeight;
		this.stageWidth = stageWidth;
		this.stageHeight = stageHeight;

		this._loadingUI = new LoadingUI(stageHeight, stageWidth);
		this.uiLayer = new eui.UILayer();
		this.gameLayer = new egret.DisplayObjectContainer();
		this._maskLayer = new eui.UILayer();
		this.popUpLayer = new eui.UILayer();
		this._loadingUI.touchEnabled = false;
		this.uiLayer.touchEnabled = false;
		this.gameLayer.touchEnabled = false;
		this._maskLayer.touchEnabled = false;
		this.popUpLayer.touchEnabled = false;

		let maskbg = new egret.Bitmap(RES.getRes("maskbg_png"));
		maskbg.height = stageHeight;
		maskbg.width = stageWidth;
		maskbg.alpha = 0.3;
		this._maskBg = maskbg;
		this._maskBg.touchEnabled = true;

		// add layer to stage
		stage.addChild(this.gameLayer);
		stage.addChild(this.uiLayer);
		stage.addChild(this._maskLayer);
		stage.addChild(this.popUpLayer);
		stage.addChild(this._loadingUI);
	}

	private _maskList: string[] = [];
	public addMask(maskName: string): void {
		this._maskLayer.addChild(this._maskBg);
		this._maskList.push(maskName);
	}

	public removeMask(maskName: string): void {
		Util.removeObjFromArray(this._maskList, maskName);
		if (this._maskList.length == 0) {
			Util.safeRemoveFromParent(this._maskBg);
		}
	}

	public clearMask(): void{
		this._maskList = [];
		Util.safeRemoveFromParent(this._maskBg);
	}

	public showLoadingUILayer(): void {
		this._loadingUI.visible = true;
		this._loadingUI.touchEnabled = true;
	}

	public hideLoadingUILayer(): void {
		this._loadingUI.visible = false;
		this._loadingUI.touchEnabled = false;
	}

	public clear(): void {
		this.gameLayer.removeChildren();
		this.uiLayer.removeChildren();
		this.clearMask();
		this.popUpLayer.removeChildren();
	}
}
