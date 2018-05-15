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
    MessageType.ClickNextButton = "ClickNextButton";
    MessageType.ClickChangeButton = "ClickChangeButton";
    // battle scene character
    MessageType.ClickChar = "ClickChar";
    MessageType.TouchBegin = "TouchBegin";
    MessageType.LongTouchStart = "LongTouchStart";
    MessageType.LongTouchEnd = "LongTouchEnd";
    return MessageType;
}());
__reflect(MessageType.prototype, "MessageType");
