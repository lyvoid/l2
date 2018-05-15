var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Hurt = (function () {
    function Hurt() {
    }
    return Hurt;
}());
__reflect(Hurt.prototype, "Hurt");
var HurtType;
(function (HurtType) {
    HurtType[HurtType["Normal"] = 0] = "Normal";
    HurtType[HurtType["ABS"] = 1] = "ABS";
})(HurtType || (HurtType = {}));
