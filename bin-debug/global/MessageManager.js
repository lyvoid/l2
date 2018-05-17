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
 * 全局消息管理 message manager
 * 需要发送特定事件类型时，在EventTypes中增加一个类型，
 * 并通过 sendMessage(EventTypes.type, message) 来发送事件
 * message中放置需要附带的事件或消息信息，
 * 事件（消息）接收方可以收到一个GlobalEvent类型的参数。
 *
 */
var MessageManager = (function (_super) {
    __extends(MessageManager, _super);
    function MessageManager() {
        return _super.call(this) || this;
    }
    Object.defineProperty(MessageManager, "Ins", {
        get: function () {
            if (this.instance == null) {
                this.instance = new MessageManager();
            }
            return this.instance;
        },
        enumerable: true,
        configurable: true
    });
    MessageManager.prototype.initial = function (stage) {
        // 将消息管理对象加入到stage中（需要加入stage才能发送与侦听touch事件）
        stage.addChild(this);
    };
    MessageManager.prototype.sendMessage = function (type, messageContent) {
        if (messageContent === void 0) { messageContent = null; }
        this.dispatchEvent(new Message(messageContent, type));
    };
    return MessageManager;
}(egret.DisplayObject));
__reflect(MessageManager.prototype, "MessageManager");
/**
 * 自定义事件，事件内容放在message里，可以是任意类型
 */
var Message = (function (_super) {
    __extends(Message, _super);
    function Message(messageContent, type, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        var _this = _super.call(this, type, bubbles, cancelable) || this;
        _this.messageContent = messageContent;
        return _this;
    }
    return Message;
}(egret.Event));
__reflect(Message.prototype, "Message");
