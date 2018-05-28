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
var PlayerRoundEndPhase = (function (_super) {
    __extends(PlayerRoundEndPhase, _super);
    function PlayerRoundEndPhase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlayerRoundEndPhase.prototype.initial = function () {
        _super.prototype.initial.call(this);
        ToastInfoManager.Ins.newToast("我方回合结束阶段");
        // TODO 回合结束阶段buff结算
        for (var _i = 0, _a = this.scene.friends; _i < _a.length; _i++) {
            var char = _a[_i];
            for (var _b = 0, _c = char.buffs.concat(char.hideBuffs).concat(char.passiveSkills); _b < _c.length; _b++) {
                var buff = _c[_b];
                buff.onCharEndPhase();
            }
        }
        // 回合结束阶段技能效果
        // 如果不在演出说明没有需要演出的技能，直接切下一个阶段
        this.scene.phaseUtil.changePhaseWithDelay(BattleSSEnum.EnemyRoundStartPhase);
    };
    PlayerRoundEndPhase.prototype.unInitial = function () {
        _super.prototype.unInitial.call(this);
    };
    return PlayerRoundEndPhase;
}(ISceneState));
__reflect(PlayerRoundEndPhase.prototype, "PlayerRoundEndPhase");
