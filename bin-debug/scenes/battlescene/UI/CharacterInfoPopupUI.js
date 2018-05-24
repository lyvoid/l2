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
var CharacterInfoPopupUI = (function (_super) {
    __extends(CharacterInfoPopupUI, _super);
    function CharacterInfoPopupUI() {
        var _this = _super.call(this) || this;
        _this.skinName = "mySkin.CharacterInfo";
        return _this;
    }
    CharacterInfoPopupUI.prototype.setDescFlowText = function (content) {
        this.desc.textFlow = (new egret.HtmlTextParser).parse(content);
    };
    CharacterInfoPopupUI.prototype.setSkillDescFlowText = function (content) {
        this.skillDesc.textFlow = (new egret.HtmlTextParser).parse(content);
    };
    return CharacterInfoPopupUI;
}(eui.Component));
__reflect(CharacterInfoPopupUI.prototype, "CharacterInfoPopupUI");
