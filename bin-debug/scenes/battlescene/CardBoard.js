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
        _this.overFlowNum = 0;
        return _this;
    }
    /**
     * 删除对应的角色的卡牌
     */
    CardBoard.prototype.removeCardOfChar = function (char) {
        var cardsForDelete = [];
        for (var _i = 0, _a = this.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            if (card.skill.caster === char) {
                cardsForDelete.push(card);
            }
        }
        this.removeCards(cardsForDelete);
    };
    /**
     * 删除多张卡牌
     */
    CardBoard.prototype.removeCards = function (cards) {
        for (var index in cards) {
            var card = cards[index];
            Util.removeObjFromArray(this.cards, card);
            card.unInitial();
            if (parseInt(index) == cards.length - 1) {
                // 如果是最后一张，对全体调整
                this.removeCardFromBoard(card, 0);
            }
            else {
                this.removeCardFromBoard(card, this.cards.length);
            }
        }
    };
    CardBoard.prototype.distCardNormal = function () {
        var scene = SceneManager.Ins.curScene;
        var skills = scene.mManualSkillIdPool;
        var index = Math.floor(Math.random() * skills.length);
        var skill = scene.mManualSkillManager.newSkill(skills[index][0], skills[index][1]);
        var card;
        if (this.cardPool.length > 0) {
            card = this.cardPool.pop();
            card.setSkill(skill);
        }
        else {
            card = new Card(skill);
        }
        this.addCard(card);
    };
    CardBoard.prototype.addCard = function (card) {
        var _this = this;
        if (this.cards.length < CardBoard.maxCardNum) {
            card.initial();
            this.cards.push(card);
            this.addCardToBoard(card, this.cards.length - 1);
            var scene = SceneManager.Ins.curScene;
            var cardNumLabel = scene.mBattleUI.cardNumLabel;
            cardNumLabel.text = this.cards.length + "/" + CardBoard.maxCardNum;
            if (this.cards.length == CardBoard.maxCardNum) {
                cardNumLabel.textColor = 0xFF0000;
            }
            else {
                cardNumLabel.textColor = 0xADFF2F;
            }
        }
        else {
            this.overFlowNum += 1;
            this.addCardToBoard(card, CardBoard.maxCardNum + this.overFlowNum - 1).call(function () {
                _this.removeCardFromBoard(card, CardBoard.maxCardNum);
                _this.overFlowNum -= 1;
            });
        }
    };
    /**
     * 根据当前的cards的数量调整所有卡牌的对应位置
     */
    CardBoard.prototype.adjustCardsPosition = function (twTime, minIndex) {
        if (twTime === void 0) { twTime = 600; }
        if (minIndex === void 0) { minIndex = 0; }
        var cards = this.cards;
        for (var i in cards) {
            if (parseInt(i) >= minIndex) {
                var card = cards[i];
                this.adjustCardPosition(card, parseInt(i), twTime);
            }
        }
    };
    /**
     * 将一张卡牌调整到正确的位置
     */
    CardBoard.prototype.adjustCardPosition = function (card, index, twTime) {
        if (twTime === void 0) { twTime = 400; }
        var newX = this.getCardX(index);
        var tw = egret.Tween.get(card);
        return tw.to({ x: newX }, twTime);
    };
    /**
     * 计算卡牌的正确的X轴位置
     */
    CardBoard.prototype.getCardX = function (index) {
        return 90 * index;
    };
    /**
     * 添加一张卡牌到cardboard中
     */
    CardBoard.prototype.addCardToBoard = function (newCard, index) {
        newCard.x = this.width + 100;
        this.addChild(newCard);
        return this.adjustCardPosition(newCard, index, 400);
    };
    /**
     * 从玩家手中移除一张卡牌
     */
    CardBoard.prototype.removeCard = function (card) {
        // 逻辑上去除
        var cards = this.cards;
        card.unInitial();
        var index = cards.indexOf(card);
        cards.splice(index, 1);
        this.removeCardFromBoard(card, index);
        var scene = SceneManager.Ins.curScene;
        var cardNumLabel = scene.mBattleUI.cardNumLabel;
        cardNumLabel.text = this.cards.length + "/" + CardBoard.maxCardNum;
        cardNumLabel.textColor = 0xADFF2F;
    };
    CardBoard.prototype.removeCardFromBoard = function (card, index) {
        var _this = this;
        // 表现上去除
        var tw = egret.Tween.get(card);
        var cardx = card.x;
        var cardy = card.y;
        var cardw = card.width;
        var cardh = card.height;
        var newcardx = cardx - 0.25 * cardw;
        var newcardy = cardy - 0.25 * cardh;
        this.adjustCardsPosition(450, index);
        tw.to({
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            x: newcardx,
            y: newcardy
        }, 300).call(function () {
            _this.removeChild(card);
            _this.cardPool.push(card);
        });
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
    CardBoard.maxCardNum = 10;
    return CardBoard;
}(egret.DisplayObjectContainer));
__reflect(CardBoard.prototype, "CardBoard");
