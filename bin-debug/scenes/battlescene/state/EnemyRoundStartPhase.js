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
var EnemyRoundStartPhase = (function (_super) {
    __extends(EnemyRoundStartPhase, _super);
    function EnemyRoundStartPhase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EnemyRoundStartPhase.prototype.initial = function () {
        _super.prototype.initial.call(this);
        ToastInfoManager.Ins.newToast("敌方回合开始阶段");
        // TODO 回合结束阶段buff结算
        // 回合结束阶段技能效果
        // 如果不在演出说明没有需要演出的技能，直接切下一个阶段
        PhaseUtil.changePhaseWithDelay(BattleSSEnum.EnemyUseCardPhase);
    };
    EnemyRoundStartPhase.prototype.unInitial = function () {
        _super.prototype.unInitial.call(this);
    };
    return EnemyRoundStartPhase;
}(ISceneState));
__reflect(EnemyRoundStartPhase.prototype, "EnemyRoundStartPhase");
