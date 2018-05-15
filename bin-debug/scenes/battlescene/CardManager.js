var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var CardManager = (function () {
    function CardManager(cards, cardBoard) {
        this.cards = [];
        this.cardObjectPool = []; // 对象池
        this.cards = cards;
        this.cardBoard = cardBoard;
        MessageManager.Ins.addEventListener(MessageType.UseCard, this.useCard, this);
        MessageManager.Ins.addEventListener(MessageType.ClickNextButton, this.distCardNormal, this);
    }
    CardManager.prototype.useCard = function (e) {
        var card = e.messageContent;
        this.removeCard(card);
    };
    CardManager.prototype.distCardNormal = function () {
        var card = new Card();
        card.initial();
        this.cards.push(card);
        if (this.cardBoard) {
            this.cardBoard.addCard(card);
        }
    };
    CardManager.prototype.removeCard = function (card) {
        var cards = this.cards;
        card.unInitial();
        var index = cards.indexOf(card);
        cards.splice(index, 1);
        if (this.cardBoard) {
            this.cardBoard.removeCard(card);
        }
    };
    /**
     * 销毁前调用
     */
    CardManager.prototype.release = function () {
        for (var _i = 0, _a = this.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            card.unInitial();
            card.release();
        }
        for (var _b = 0, _c = this.cardObjectPool; _b < _c.length; _b++) {
            var card = _c[_b];
            card.release();
        }
        this.cards = null;
        this.cardObjectPool = null;
        this.cardBoard = null;
        MessageManager.Ins.removeEventListener(MessageType.RemoveCard, this.useCard, this);
    };
    return CardManager;
}());
__reflect(CardManager.prototype, "CardManager");
