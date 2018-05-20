/**
 * 游戏中的所有layer都体现在这个类中
 * 单例
 * 
 * 场景中如果layer需要再扩充新的子layer的话，用enum定义几个layer的层级
 * 通过 layer.getChildAt(enum.sublayer) 来获取定义的子layer
 */
class LayerManager {

	public loadingLayer: eui.UILayer;
	public uiLayer: eui.UILayer; // ui
	public gameLayer: egret.DisplayObjectContainer; // 游戏层
	public maskLayer: eui.UILayer; // 遮罩层
	public popUpLayer: eui.UILayer;

	public stageWidth: number;
	public stageHeight: number;

	private static instance: LayerManager;

	public static get Ins(): LayerManager{
		if (this.instance == null){
			this.instance = new LayerManager();
		}
		return this.instance;
	}

	private constructor() {
	}

	/**
	 * initial 在main中调用，将stage传入（只在游戏开始时调用一次）
	 */
	public initial(stage: egret.Stage): LayerManager{
		
		// 保存舞台宽高留用
		let stageWidth = stage.stageWidth;
		let stageHeight = stage.stageHeight;
		this.stageWidth = stageWidth;
		this.stageHeight = stageHeight;

		this.loadingLayer = new LoadingUI(stageHeight, stageWidth);
		this.loadingLayer.touchEnabled = true;
		this.loadingLayer.visible = false;

		this.uiLayer = new eui.UILayer();
		this.uiLayer.touchEnabled = false;

		let gameLayer = new egret.DisplayObjectContainer();
		this.gameLayer = gameLayer;

		this.maskLayer = new eui.UILayer;
		this.maskLayer.touchEnabled = true;
		this.maskLayer.visible = false;

		this.popUpLayer = new eui.UILayer();
		this.popUpLayer.touchEnabled = false;

		let maskbg = new egret.Bitmap(RES.getRes("maskbg_png"));
		maskbg.height = stageHeight;
		maskbg.width = stageWidth;
		maskbg.alpha = 0.3;
		this.maskLayer.addChild(maskbg);
		
		// 将几个主layer加入到stage中
		stage.addChild(this.gameLayer);
		stage.addChild(this.uiLayer);
		stage.addChild(this.maskLayer);
		stage.addChild(this.popUpLayer);
		stage.addChild(this.loadingLayer);
		return this;
	}

	public static getSubLayerAt(layer:egret.DisplayObjectContainer, index:number){
		return layer.getChildAt(index) as egret.DisplayObjectContainer;
	}

}

