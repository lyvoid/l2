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
var PlayerUseCardPhase = (function (_super) {
    __extends(PlayerUseCardPhase, _super);
    function PlayerUseCardPhase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlayerUseCardPhase.prototype.initial = function () {
        _super.prototype.initial.call(this);
        ToastInfoManager.Ins.newToast("我方出牌阶段");
        // 显示下一个回合的按键
        this.scene.battleUI.roundEndButton.visible = true;
        // 绑定卡牌tap使用事件
        MessageManager.Ins.addEventListener(MessageType.CardTouchTap, this.onCardTouchTap, this);
        // TODO 自动模式下自动释放技能
        // 收到按键消息，准备跳转下一个阶段
        MessageManager.Ins.addEventListener(MessageType.UseCardPhaseEnd, this.onUseCardPhaseEnd, this);
        // TODO 如果自动模式发送回合结束消息
        // MessageManager.Ins.sendMessage(MessageType.UseCardPhaseEnd);
    };
    PlayerUseCardPhase.prototype.onUseCardPhaseEnd = function () {
        MessageManager.Ins.removeEventListener(MessageType.UseCardPhaseEnd, this.onUseCardPhaseEnd, this);
        PhaseUtil.changePhase(BattleSSEnum.PlayerRoundEndPhase);
    };
    PlayerUseCardPhase.prototype.onCardTouchTap = function (e) {
        var card = e.messageContent;
        var scene = this.scene;
        if (scene.winnerCamp) {
            ToastInfoManager.Ins.newToast("胜负已分");
            return;
        }
        var fireboard = scene.playerFireBoard;
        var fireNeed = card.skill.fireNeed;
        if (fireNeed > fireboard.fireNum) {
            ToastInfoManager.Ins.newToast("能量不足");
            return;
        }
        if (card.skill.targetType == TargetType.SpecialEnemy &&
            (!scene.selectedEnemy.attr.isInBattle)) {
            ToastInfoManager.Ins.newToast("选中目标已从游戏中排除");
            return;
        }
        // 如果目标类型为特定单位，但该单位已经死亡
        // （发生在之前的技能已经把敌方打死但是演出还没结束的时候）
        if (card.skill.targetType == TargetType.SpecialEnemy &&
            (!scene.selectedEnemy.alive)) {
            ToastInfoManager.Ins.newToast("选中目标已死亡");
            return;
        }
        // 使用技能
        card.skill.useSkill();
        // 移除所需要的点数
        for (var i = 0; i < card.skill.fireNeed; i++) {
            fireboard.removeFire();
        }
        // 移除卡牌
        scene.cardBoard.removeCard(card);
    };
    PlayerUseCardPhase.prototype.unInitial = function () {
        _super.prototype.unInitial.call(this);
        MessageManager.Ins.removeEventListener(MessageType.CardTouchTap, this.onCardTouchTap, this);
        // 隐藏回合结束按键，已经在按键的tap事件中隐藏了，这里不额外隐藏
        // this.scene.battleUI.roundEndButton.visible = false;
    };
    return PlayerUseCardPhase;
}(ISceneState));
__reflect(PlayerUseCardPhase.prototype, "PlayerUseCardPhase");
