var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 游戏中的所有layer都体现在这个类中
 * 单例
 *
 * 场景中如果layer需要再扩充新的子layer的话，用enum定义几个layer的层级
 * 通过 layer.getChildAt(enum.sublayer) 来获取定义的子layer
 */
var LayerManager = (function () {
    function LayerManager() {
    }
    Object.defineProperty(LayerManager, "Ins", {
        get: function () {
            if (this.instance == null) {
                this.instance = new LayerManager();
            }
            return this.instance;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * initial 在main中调用，将stage传入（只在游戏开始时调用一次）
     */
    LayerManager.prototype.initial = function (stage) {
        // 保存舞台宽高留用
        var stageWidth = stage.stageWidth;
        var stageHeight = stage.stageHeight;
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.loadingLayer = new LoadingUI(stageHeight, stageWidth);
        this.loadingLayer.touchEnabled = true;
        this.loadingLayer.visible = false;
        this.uiLayer = new eui.UILayer();
        this.uiLayer.touchEnabled = false;
        var gameLayer = new egret.DisplayObjectContainer();
        this.gameLayer = gameLayer;
        this.maskLayer = new eui.UILayer;
        this.maskLayer.touchEnabled = true;
        this.maskLayer.visible = false;
        this.popUpLayer = new eui.UILayer();
        this.popUpLayer.touchEnabled = false;
        var maskbg = new egret.Bitmap(RES.getRes("maskbg_png"));
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
    };
    LayerManager.getSubLayerAt = function (layer, index) {
        return layer.getChildAt(index);
    };
    return LayerManager;
}());
__reflect(LayerManager.prototype, "LayerManager");
