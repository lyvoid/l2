var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
// TypeScript file
var Util = (function () {
    function Util() {
    }
    /**
     * 从一个Array中删除元素
     */
    Util.removeObjFromArray = function (ls, obj) {
        var index = ls.indexOf(obj);
        if (index >= 0) {
            ls.splice(index, 1);
            return true;
        }
        return false;
    };
    /**
     * 安全移除egret的子物体，防止父物体空错误
     */
    Util.safeRemove = function (element) {
        var p = element.parent;
        if (p) {
            p.removeChild(element);
        }
    };
    /**
     * 打乱输入的数组
     */
    Util.getRandomArray = function (input) {
        var output = [];
        var len = input.length;
        while (len > 0) {
            var index = Math.floor(Math.random() * len);
            if (index == len) {
                index -= 1;
            }
            output.push(input[index]);
            input.splice(index, 1);
            len -= 1;
        }
        return output;
    };
    return Util;
}());
__reflect(Util.prototype, "Util");
