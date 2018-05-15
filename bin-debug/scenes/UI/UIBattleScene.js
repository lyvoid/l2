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
var UIBattleScene = (function (_super) {
    __extends(UIBattleScene, _super);
    function UIBattleScene() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/eui_skins/ui/UIBattleScene.exml";
        return _this;
    }
    UIBattleScene.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    UIBattleScene.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    UIBattleScene.prototype.onComplete = function () {
        this.nextButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () { return MessageManager.Ins.sendMessage(MessageType.ClickNextButton); }, this);
        this.changeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () { return MessageManager.Ins.sendMessage(MessageType.ClickChangeButton); }, this);
    };
    return UIBattleScene;
}(eui.Component));
__reflect(UIBattleScene.prototype, "UIBattleScene", ["eui.UIComponent", "egret.DisplayObject"]);
