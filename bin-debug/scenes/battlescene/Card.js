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
var Card = (function (_super) {
    __extends(Card, _super);
    function Card() {
        var _this = _super.call(this) || this;
        _this.desc = "对目标造成攻击的伤害";
        _this.skill = new SkillTmp();
        _this.width = 80;
        _this.height = 130;
        var cardBg = new egret.Bitmap(RES.getRes("cardbg_png"));
        cardBg.width = _this.width;
        cardBg.height = _this.height;
        _this.addChild(cardBg);
        _this.initial();
        return _this;
    }
    Card.prototype.sendUseCardMessage = function () {
        MessageManager.Ins.sendMessage(MessageType.UseCard, this);
    };
    /**
     * 从对象池调出的时候调用
     */
    Card.prototype.initial = function () {
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sendUseCardMessage, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.sendBeginTouchMessage, this);
        LongTouchUtil.bindLongTouch(this, this);
        // TODO Tmp
        this.caster = SceneManager.Ins.curScene.friends[0];
    };
    /**
     * 使用后准备放入对象池前调用
     */
    Card.prototype.unInitial = function () {
        this.touchEnabled = false;
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.sendUseCardMessage, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.sendBeginTouchMessage, this);
    };
    Card.prototype.sendBeginTouchMessage = function () {
        MessageManager.Ins.sendMessage(MessageType.TouchBegin, this);
    };
    /**
     * release 不会调用unInitial，释放前需要自行调用
     */
    Card.prototype.release = function () {
    };
    return Card;
}(egret.DisplayObjectContainer));
__reflect(Card.prototype, "Card");
