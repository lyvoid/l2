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
 * 卡牌区域，负责玩家的卡牌管理
 */
var CardBoard = (function (_super) {
    __extends(CardBoard, _super);
    function CardBoard() {
        var _this = _super.call(this) || this;
        _this.cards = [];
        _this.cardPool = [];
        _this.y = LayerManager.Ins.stageHeight - 140;
        _this.width = LayerManager.Ins.stageWidth;
        MessageManager.Ins.addEventListener(MessageType.ClickNextButton, _this.distCardNormal, _this);
        return _this;
    }
    CardBoard.prototype.distCardNormal = function () {
        var skills = SceneManager.Ins.curScene.skillManualPool;
        var index = Math.floor(Math.random() * skills.length);
        var card = new Card(skills[index]);
        this.cards.push(card);
        this.addCardToBoard(card);
    };
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
    CardBoard.prototype.addCardToBoard = function (newCard) {
        newCard.x = this.width + 100;
        this.addChild(newCard);
        var index = this.cards.indexOf(newCard);
        this.adjustCardPosition(newCard, index);
    };
    /**
     * 从cardboard中移除一张卡牌，主要是表现效果
     * 表现前需要先从cards中移除对应卡牌
     */
    CardBoard.prototype.removeCardFromBoard = function (card) {
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
     * 从玩家手中移除一张卡牌
     */
    CardBoard.prototype.removeCard = function (card) {
        var cards = this.cards;
        card.unInitial();
        var index = cards.indexOf(card);
        cards.splice(index, 1);
        this.removeCardFromBoard(card);
    };
    /**
     * 销毁前要调用该方法释放资源
     */
    CardBoard.prototype.release = function () {
        for (var _i = 0, _a = this.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            card.unInitial();
            card.release();
        }
        for (var _b = 0, _c = this.cardPool; _b < _c.length; _b++) {
            var card = _c[_b];
            card.release();
        }
        this.cards = null;
        this.cardPool = null;
    };
    return CardBoard;
}(egret.DisplayObjectContainer));
__reflect(CardBoard.prototype, "CardBoard");
