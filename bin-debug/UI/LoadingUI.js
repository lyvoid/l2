var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI(stageHeight, stageWidth) {
        var _this = _super.call(this) || this;
        var blackBg = new egret.Shape();
        blackBg.graphics.beginFill(0x0);
        blackBg.graphics.drawRect(0, 0, stageWidth, stageHeight);
        blackBg.graphics.endFill();
        _this.addChild(blackBg);
        var imageBg = new egret.Bitmap(RES.getRes("loadingbg_png"));
        var scale = stageWidth / imageBg.width;
        imageBg.scaleX = scale;
        imageBg.scaleY = scale;
        imageBg.y = (stageHeight - imageBg.height * scale) / 2;
        _this.addChild(imageBg);
        _this.textField = new eui.Label();
        _this.textField.bottom = 30;
        _this.textField.horizontalCenter = 0;
        _this.addChild(_this.textField);
        return _this;
    }
    LoadingUI.prototype.onProgress = function (current, total) {
        this.textField.text = "Loading..." + current + "/" + total;
    };
    return LoadingUI;
}(eui.UILayer));
__reflect(LoadingUI.prototype, "LoadingUI", ["RES.PromiseTaskReporter"]);
