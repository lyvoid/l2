var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ToastInfoManager = (function () {
    function ToastInfoManager() {
        this.labelPools = [];
    }
    Object.defineProperty(ToastInfoManager, "Ins", {
        get: function () {
            var ins = ToastInfoManager.instance;
            if (ins != null) {
                return ins;
            }
            ins = new ToastInfoManager();
            ToastInfoManager.instance = ins;
            return ins;
        },
        enumerable: true,
        configurable: true
    });
    ToastInfoManager.prototype.initial = function () {
    };
    ToastInfoManager.prototype.newToast = function (info) {
        var _this = this;
        var label;
        if (this.labelPools.length > 0) {
            label = this.labelPools.pop();
        }
        else {
            label = new eui.Label();
            label.horizontalCenter = 0;
        }
        label.y = 100;
        label.alpha = 1;
        label.text = info;
        LayerManager.Ins.popUpLayer.addChild(label);
        egret.Tween.get(label).to({ y: 20, alpha: 0 }, 2000, egret.Ease.quintInOut).call(function () {
            LayerManager.Ins.popUpLayer.removeChild(label);
            _this.labelPools.push(label);
        });
    };
    return ToastInfoManager;
}());
__reflect(ToastInfoManager.prototype, "ToastInfoManager");
