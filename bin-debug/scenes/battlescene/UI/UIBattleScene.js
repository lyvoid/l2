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
        _this.skinName = "mySkin.UIBattleSceneSkin";
        // 这里的三个侦听事件就不做手动释放了，应该都会自己释放的
        _this.roundEndButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            // 如果玩家点击了回合结束按键，进入到回合结束阶段
            _this.roundEndButton.visible = false;
            MessageManager.Ins.sendMessage(MessageType.UseCardPhaseEnd);
        }, _this);
        // 两个作弊功能
        _this.addCardButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var scene = SceneManager.Ins.curScene;
            scene.cardBoard.distCardNormal();
        }, _this);
        // 作弊功能
        _this.addFireButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var scene = SceneManager.Ins.curScene;
            scene.playerFireBoard.addFires(2);
        }, _this);
        return _this;
    }
    return UIBattleScene;
}(eui.Component));
__reflect(UIBattleScene.prototype, "UIBattleScene");
