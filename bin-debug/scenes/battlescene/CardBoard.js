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
 * battle scene中的卡牌版，用于展示卡牌的动画及特效
 * 这里不要修改cards的值，cards的值统一再cardmanager中修改
 * 该类只要管理好自己的表现效果就行了
 */
var CardBoard = (function (_super) {
    __extends(CardBoard, _super);
    function CardBoard(cards) {
        var _this = _super.call(this) || this;
        _this.cards = cards;
        _this.y = LayerManager.Ins.stageHeight - 140;
        _this.width = LayerManager.Ins.stageWidth;
        return _this;
    }
    /**
     * 根据当前的cards的数量调整所有卡牌的对应位置
     */
    CardBoard.prototype.adjustCardsPosition = function (twTime) {
        if (twTime === void 0) { twTime = 600; }
        var cards = this.cards;
        for (var i in cards) {
            var card = cards[i];
            this.adjustCardPosition(card, parseInt(i), twTime);
        }
    };
    /**
     * 将一张卡牌调整到正确的位置
     */
    CardBoard.prototype.adjustCardPosition = function (card, index, twTime) {
        if (twTime === void 0) { twTime = 600; }
        var newX = this.getCardX(index);
        var tw = egret.Tween.get(card);
        tw.to({ x: newX }, twTime);
    };
    /**
     * 计算卡牌的正确的X轴位置
     */
    CardBoard.prototype.getCardX = function (index) {
        return 90 * index;
    };
    /**
     * 添加一张卡牌到cardboard中
     * 在调用该方法前，需要先将card加入到cards中
     */
    CardBoard.prototype.addCard = function (newCard) {
        newCard.x = this.width + 100;
        this.addChild(newCard);
        var index = this.cards.indexOf(newCard);
        this.adjustCardPosition(newCard, index);
    };
    /**
     * 从cardboard中移除一张卡牌，此前需要先再cards中移除(在cardmanager中)
     */
    CardBoard.prototype.removeCard = function (card) {
        var _this = this;
        var tw = egret.Tween.get(card);
        var cardx = card.x;
        var cardy = card.y;
        var cardw = card.width;
        var cardh = card.height;
        var newcardx = cardx - 0.25 * cardw;
        var newcardy = cardy - 0.25 * cardh;
        this.adjustCardsPosition(400);
        tw.to({
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            x: newcardx,
            y: newcardy
        }, 400).call(function () { return _this.removeChild(card); });
    };
    /**
     * 销毁前要调用该方法释放资源
     */
    CardBoard.prototype.release = function () {
        this.cards = null;
        this.removeChildren();
    };
    return CardBoard;
}(egret.DisplayObjectContainer));
__reflect(CardBoard.prototype, "CardBoard");
