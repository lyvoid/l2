var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var TargetSelectManager = (function () {
    function TargetSelectManager() {
        this._targetSelectPool = {};
    }
    TargetSelectManager.prototype.getTargetSelect = function (id) {
        var targetSelectPool = this._targetSelectPool;
        if (targetSelectPool[id] != null) {
            return targetSelectPool[id];
        }
        var targetSelect = new TargetSelect();
        // TODO:initial target select by id
        // targetSelect.initial();
        targetSelectPool[id] = targetSelect;
        return targetSelect;
    };
    TargetSelectManager.prototype.release = function () {
        this._targetSelectPool = null;
    };
    return TargetSelectManager;
}());
__reflect(TargetSelectManager.prototype, "TargetSelectManager");
