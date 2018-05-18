var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DamageFloatManager = (function () {
    function DamageFloatManager() {
        this.numberFloatPool = [];
    }
    DamageFloatManager.prototype.newFloat = function (char, oldNum, newNum, prefix) {
        if (prefix === void 0) { prefix = "hp"; }
        if (oldNum == newNum) {
            return;
        }
        var numberFloatPool = this.numberFloatPool;
        var floatLabel;
        if (numberFloatPool.length != 0) {
            floatLabel = numberFloatPool.pop();
        }
        else {
            floatLabel = new egret.TextField();
        }
        var changeHp = newNum - oldNum;
        var sign = changeHp > 0 ? "+" : "-";
        floatLabel.textColor = changeHp > 0 ? 0x7CFC00 : 0xCD0000;
        floatLabel.text = prefix + " " + sign + Math.abs(changeHp);
        char.addChild(floatLabel);
        floatLabel.y = -200;
        floatLabel.x = -30;
        floatLabel.alpha = 1;
        floatLabel.bold = true;
        return egret.Tween.get(floatLabel).to({
            y: floatLabel.y + 100,
            alpha: 0
        }, 2000).call(function () {
            char.removeChild(floatLabel);
            numberFloatPool.push(floatLabel);
        });
    };
    return DamageFloatManager;
}());
__reflect(DamageFloatManager.prototype, "DamageFloatManager");
