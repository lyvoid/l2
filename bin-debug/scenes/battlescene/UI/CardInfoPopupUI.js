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
var CardInfoPopupUI = (function (_super) {
    __extends(CardInfoPopupUI, _super);
    function CardInfoPopupUI() {
        var _this = _super.call(this) || this;
        _this.skinName = "mySkin.CardInfoPopupUI";
        return _this;
    }
    CardInfoPopupUI.prototype.setDescFlowText = function (content) {
        this.desc.textFlow = (new egret.HtmlTextParser).parse(content);
    };
    return CardInfoPopupUI;
}(eui.Component));
__reflect(CardInfoPopupUI.prototype, "CardInfoPopupUI");
