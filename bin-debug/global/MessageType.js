var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MessageType = (function () {
    function MessageType() {
    }
    MessageType.AddCard = "AddCard";
    MessageType.RemoveCard = "RemoveCard";
    MessageType.UseCard = "UseCard";
    // battle scene ui
    // 使用卡牌阶段结束，这个在自动模式下会自动发送该消息
    MessageType.UseCardPhaseEnd = "UseCardPhaseEnd";
    // battle scene character
    MessageType.TouchBegin = "TouchBegin";
    MessageType.LongTouchStart = "LongTouchStart";
    MessageType.LongTouchEnd = "LongTouchEnd";
    // 伤害或治疗消息
    MessageType.HealHp = "HealHp";
    MessageType.HealShield = "HealShield";
    MessageType.HarmHp = "HarmHp";
    MessageType.HarmShield = "HarmShield";
    MessageType.CharDie = "CharDie";
    MessageType.Resurgence = "Resurgence";
    MessageType.PerformanceEnd = "NextPerformance";
    MessageType.PerformanceChainStart = "PerformanceChainStart";
    // 演出全部结束
    MessageType.SkillPerformAllEnd = "SkillPerformAllEnd";
    // 卡牌被点击事件
    MessageType.CardTouchTap = "CardTouchTap";
    return MessageType;
}());
__reflect(MessageType.prototype, "MessageType");
