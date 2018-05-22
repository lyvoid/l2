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
/**
 * 玩家回合开始阶段
 */
var PlayerRoundStartPhase = (function (_super) {
    __extends(PlayerRoundStartPhase, _super);
    function PlayerRoundStartPhase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlayerRoundStartPhase.prototype.initial = function () {
        _super.prototype.initial.call(this);
        // TODO 回合开始阶段需要做的事情在这里做完
        // 1.发牌 + 能量
        // 2.buff结算
        // 3.回合开始的技能及效果
        ToastInfoManager.Ins.newToast("我方回合开始阶段");
        // 发牌
        var scene = this.scene;
        scene.cardBoard.distCardNormal();
        scene.cardBoard.distCardNormal();
        // 加能量
        scene.playerFireBoard.addFires(2);
        // buff结算(待增加
        // 回合开始的技能及效果（待增加
        // 切下一个阶段
        this.scene.phaseUtil.changePhaseWithDelay(BattleSSEnum.PlayerUseCardPhase);
    };
    PlayerRoundStartPhase.prototype.unInitial = function () {
        _super.prototype.unInitial.call(this);
    };
    return PlayerRoundStartPhase;
}(ISceneState));
__reflect(PlayerRoundStartPhase.prototype, "PlayerRoundStartPhase");
