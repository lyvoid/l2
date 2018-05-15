/**
 * battle scene中的卡牌版，用于展示卡牌的动画及特效
 * 这里不要修改cards的值，cards的值统一再cardmanager中修改
 * 该类只要管理好自己的表现效果就行了
 */
class CardBoard extends egret.DisplayObjectContainer {
	public constructor(cards: Card[]) {
		super();
		this.cards = cards;
		this.y = LayerManager.Ins.stageHeight - 140;
		this.width = LayerManager.Ins.stageWidth;
	}

	/**
	 * 玩家持有的卡牌列表
	 */
	private cards: Card[];

	/**
	 * 根据当前的cards的数量调整所有卡牌的对应位置
	 */
	private adjustCardsPosition(twTime: number = 600): void {
		let cards: Card[] = this.cards;
		for (let i in cards) {
			let card: Card = cards[i]
			this.adjustCardPosition(card, parseInt(i), twTime);
		}
	}

	/**
	 * 将一张卡牌调整到正确的位置
	 */
	private adjustCardPosition(card: Card, index: number, twTime: number = 600): void {
		let newX = this.getCardX(index);
		let tw = egret.Tween.get(card);
		tw.to({ x: newX }, twTime);
	}

	/**
	 * 计算卡牌的正确的X轴位置
	 */
	private getCardX(index: number): number {
		return 90 * index;
	}

	/**
	 * 添加一张卡牌到cardboard中
	 * 在调用该方法前，需要先将card加入到cards中
	 */
	public addCard(newCard: Card): void {
		newCard.x = this.width + 100;
		this.addChild(newCard);
		let index = this.cards.indexOf(newCard);
		this.adjustCardPosition(newCard, index)
	}

	/**
	 * 从cardboard中移除一张卡牌，此前需要先再cards中移除(在cardmanager中)
	 */
	public removeCard(card: Card): void {
		let tw = egret.Tween.get(card);
		let cardx = card.x;
		let cardy = card.y;
		let cardw = card.width;
		let cardh = card.height;
		let newcardx = cardx - 0.25 * cardw;
		let newcardy = cardy - 0.25 * cardh;
		this.adjustCardsPosition(400);
		tw.to(
			{
				scaleX: 1.5,
				scaleY: 1.5,
				alpha: 0,
				x: newcardx,
				y: newcardy
			},
			400
		).call(() => this.removeChild(card));
	}

	/**
	 * 销毁前要调用该方法释放资源
	 */
	public release(): void {
		this.cards = null;
		this.removeChildren();
	}

}