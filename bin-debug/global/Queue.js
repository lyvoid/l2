var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
// TypeScript file
var Queue = (function () {
    function Queue() {
        this.data = [];
    }
    Object.defineProperty(Queue.prototype, "length", {
        get: function () {
            return this.data.length;
        },
        enumerable: true,
        configurable: true
    });
    Queue.prototype.push = function (newElement) {
        this.data.push(newElement);
    };
    Queue.prototype.pop = function () {
        var data = this.data;
        if (data.length == 0) {
            return null;
        }
        var output = data[0];
        data.splice(0, 1);
        return output;
    };
    return Queue;
}());
__reflect(Queue.prototype, "Queue");
