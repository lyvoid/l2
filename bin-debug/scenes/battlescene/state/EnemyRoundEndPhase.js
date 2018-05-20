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
var EnemyRoundEndPhase = (function (_super) {
    __extends(EnemyRoundEndPhase, _super);
    function EnemyRoundEndPhase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EnemyRoundEndPhase.prototype.initial = function () {
        _super.prototype.initial.call(this);
        // TODO 删除模拟延迟
        ToastInfoManager.Ins.newToast("敌方回合结束阶段");
        // TODO 回合结束阶段buff结算
        // 回合结束阶段技能效果
        this.scene.phaseUtil.changePhaseWithDelay(BattleSSEnum.PlayerRoundStartPhase);
    };
    EnemyRoundEndPhase.prototype.unInitial = function () {
        _super.prototype.unInitial.call(this);
    };
    return EnemyRoundEndPhase;
}(ISceneState));
__reflect(EnemyRoundEndPhase.prototype, "EnemyRoundEndPhase");
