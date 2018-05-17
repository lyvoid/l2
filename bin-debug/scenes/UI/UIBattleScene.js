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
        // this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        _this.skinName = "resource/eui_skins/ui/UIBattleScene.exml";
        _this.nextButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () { return MessageManager.Ins.sendMessage(MessageType.ClickNextButton); }, _this);
        _this.changeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var scene = SceneManager.Ins.curScene;
            scene.playerFireBoard.addFire();
            scene.playerFireBoard.addFire();
        }, _this);
        return _this;
    }
    return UIBattleScene;
}(eui.Component));
__reflect(UIBattleScene.prototype, "UIBattleScene");
