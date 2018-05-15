var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Attribute = (function () {
    function Attribute() {
        this.ap = 100;
        this.df = 60;
        this.mhp = 200;
        this.chp = 200;
        this.shield = 100;
    }
    return Attribute;
}());
__reflect(Attribute.prototype, "Attribute");
