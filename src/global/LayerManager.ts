class LayerManager {

	public gameLayer: egret.DisplayObjectContainer;
	public uiLayer: eui.UILayer;
	public popUpLayer: eui.UILayer;
	public netMask: NetMask;
	public loadingUI: LoadingUI;
	public stageWidth: number;
	public stageHeight: number;
	private static _instance: LayerManager;

	public static get Ins(): LayerManager {
		if (this._instance == null) {
			this._instance = new LayerManager();
		}
		return this._instance;
	}

	private constructor() { }

	public initial(stage: egret.Stage) {
		// save width and height of stage in this class
		let stageWidth = stage.stageWidth;
		let stageHeight = stage.stageHeight;
		this.stageWidth = stageWidth;
		this.stageHeight = stageHeight;

		this.loadingUI = new LoadingUI(stageHeight, stageWidth);
		this.uiLayer = new eui.UILayer();
		this.gameLayer = new egret.DisplayObjectContainer();
		this.popUpLayer = new eui.UILayer();
		this.loadingUI.touchEnabled = false;
		this.uiLayer.touchEnabled = false;
		this.gameLayer.touchEnabled = false;
		this.popUpLayer.touchEnabled = false;
		this.netMask = new NetMask();
		this.netMask.hide();

		// add layer to stage
		stage.addChild(this.gameLayer);
		stage.addChild(this.uiLayer);
		stage.addChild(this.popUpLayer);
		stage.addChild(this.loadingUI);
		stage.addChild(this.netMask);
	}

	public showLoadingUILayer(): void {
		this.loadingUI.initial();
		this.loadingUI.visible = true;
		this.loadingUI.touchEnabled = true;
	}

	public hideLoadingUILayer(): void {
		this.loadingUI.visible = false;
		this.loadingUI.touchEnabled = false;
	}

	public clear(): void {
		this.gameLayer.removeChildren();
		this.uiLayer.removeChildren();
		this.popUpLayer.removeChildren();
	}
}
