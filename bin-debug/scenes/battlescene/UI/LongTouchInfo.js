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
var LongTouchInfo = (function (_super) {
    __extends(LongTouchInfo, _super);
    function LongTouchInfo() {
        var _this = _super.call(this) || this;
        _this.skinName = "resource/eui_skins/ui/LongTouchInfo.exml";
        return _this;
    }
    LongTouchInfo.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    LongTouchInfo.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    return LongTouchInfo;
}(eui.Component));
__reflect(LongTouchInfo.prototype, "LongTouchInfo", ["eui.UIComponent", "egret.DisplayObject"]);
