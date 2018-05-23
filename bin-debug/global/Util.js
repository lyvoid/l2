var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
// TypeScript file
var Util = (function () {
    function Util() {
    }
    Util.deleteObjFromList = function (ls, obj) {
        var index = ls.indexOf(obj);
        if (index >= 0) {
            ls.splice(index, 1);
            return true;
        }
        return false;
    };
    Util.safeRemove = function (element) {
        var p = element.parent;
        if (p) {
            p.removeChild(element);
        }
    };
    return Util;
}());
__reflect(Util.prototype, "Util");
