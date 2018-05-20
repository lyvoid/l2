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
var BattleEndPopUp = (function (_super) {
    __extends(BattleEndPopUp, _super);
    function BattleEndPopUp() {
        var _this = _super.call(this) || this;
        _this.skinName = "mySkin.BattleEndPopUp";
        _this.nextButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            SceneManager.Ins.setScene(new BattleScene(SceneManager.Ins));
        }, _this);
        _this.retryButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            SceneManager.Ins.setScene(new BattleScene(SceneManager.Ins));
        }, _this);
        return _this;
    }
    ;
    /**
     * 胜利的时候调整UI
     */
    BattleEndPopUp.prototype.winUIAdjust = function () {
        this.titleLabel.text = "战斗胜利";
        this.nextButton.visible = true;
        this.retryButton.visible = false;
    };
    /**
     * 失败的时候调整UI
     */
    BattleEndPopUp.prototype.lostUIAdjust = function () {
        this.titleLabel.text = "战斗失败";
        this.nextButton.visible = false;
        this.retryButton.visible = true;
    };
    return BattleEndPopUp;
}(eui.Component));
__reflect(BattleEndPopUp.prototype, "BattleEndPopUp");
