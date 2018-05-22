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
    function Card(skill) {
        var _this = _super.call(this) || this;
        _this.width = 80;
        _this.height = 130;
        var cardBg = new egret.Bitmap(RES.getRes("cardbg_png"));
        cardBg.width = _this.width;
        cardBg.height = _this.height;
        _this.addChild(cardBg);
        _this.setSkill(skill);
        return _this;
    }
    Object.defineProperty(Card.prototype, "desc", {
        get: function () {
            return this.skill.desc;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 从对象池调出的时候调用，主要是绑定好事件
     */
    Card.prototype.initial = function () {
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        LongTouchUtil.bindLongTouch(this, this);
        ;
    };
    /**
     * TODO: 这里还需要根据skill的图标资源名，给对应卡片设置对应贴图资源
     */
    Card.prototype.setSkill = function (skill) {
        this.skill = skill;
        this.alpha = 1;
        this.scaleX = 1;
        this.scaleY = 1;
        this.y = 0;
    };
    /**
     * 使用后准备放入对象池前调用
     * 解除事件侦听
     */
    Card.prototype.unInitial = function () {
        this.touchEnabled = false;
        LongTouchUtil.unbindLongTouch(this, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.skill = null;
    };
    /**
     * 点击开始时发送touchbegin消息，附带信息为卡牌自己
     * touchbegin统一在scene里做处理
     */
    Card.prototype.onTouchBegin = function () {
        SceneManager.Ins.curScene.filterManager.setOutGlowHolderWithAnim(this);
    };
    /**
     * 被点击时发送cardtouchtap事件，附带信息为卡牌自己
     * 事件在scene中处理
     */
    Card.prototype.onTouchTap = function () {
        MessageManager.Ins.sendMessage(MessageType.CardTouchTap, this);
    };
    /**
     * release 不会调用unInitial，释放前需要自行调用
     */
    Card.prototype.release = function () {
        this.skill = null;
    };
    return Card;
}(egret.DisplayObjectContainer));
__reflect(Card.prototype, "Card");
