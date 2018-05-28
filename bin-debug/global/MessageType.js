var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MessageType = (function () {
    function MessageType() {
    }
    // 载入过程事件
    MessageType.LoadingProcess = "LoadingProcess";
    // BattleScene
    // 伤害或治疗消息
    MessageType.HealHp = "HealHp";
    MessageType.HealShield = "HealShield";
    MessageType.HarmHp = "HarmHp";
    MessageType.HarmShield = "HarmShield";
    MessageType.CharDie = "CharDie";
    MessageType.Resurgence = "Resurgence";
    // 开始回合
    MessageType.EnemyRoundStart = "EnemyRoundStart";
    MessageType.PlayerRoundStart = "PlayerRoundStart";
    // 演出全部结束
    MessageType.PerformAllEnd = "PerformAllEnd";
    // 卡牌被点击事件
    MessageType.CardTouchTap = "CardTouchTap";
    return MessageType;
}());
__reflect(MessageType.prototype, "MessageType");
