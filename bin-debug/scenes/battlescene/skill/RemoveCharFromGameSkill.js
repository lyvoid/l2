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
var RemoveCharFromGameSkill = (function (_super) {
    __extends(RemoveCharFromGameSkill, _super);
    function RemoveCharFromGameSkill(targets) {
        var _this = _super.call(this) || this;
        _this.targetType = TargetType.PreSet;
        _this.targets = targets;
        return _this;
    }
    RemoveCharFromGameSkill.prototype.affect = function () {
        var target = this.targets[0];
        target.attr.isInBattle = false;
    };
    RemoveCharFromGameSkill.prototype.performance = function (affectResult) {
        var target = this.targets[0];
        target.parent.removeChild(target);
        MessageManager.Ins.sendMessage(MessageType.PerformanceEnd);
    };
    RemoveCharFromGameSkill.prototype.needCast = function () {
        var target = this.targets[0];
        if (!target) {
            return false;
        }
        if (!target.attr.isInBattle) {
            return false;
        }
        return true;
    };
    return RemoveCharFromGameSkill;
}(IManualSkill));
__reflect(RemoveCharFromGameSkill.prototype, "RemoveCharFromGameSkill");
