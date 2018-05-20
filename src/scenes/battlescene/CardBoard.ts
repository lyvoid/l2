/**
 * 卡牌区域，负责玩家的卡牌管理
 */
class CardBoard extends egret.DisplayObjectContainer {

	/**
	 * 玩家持有的卡牌列表
	 */
	private cards: Card[];
	private cardPool: Card[]; // 对象池

	public constructor() {
		super();
		this.cards = [];
		this.cardPool = [];

		this.y = LayerManager.Ins.stageHeight - 140;
		this.width = LayerManager.Ins.stageWidth;
	}

	public distCardNormal(){
		let skills = (SceneManager.Ins.curScene as BattleScene).skillManualPool;
		let index = Math.floor(Math.random() * skills.length);
		let card: Card;
		if (this.cardPool.length > 0){
			card = this.cardPool.pop();
			card.setSkill(skills[index]);
		} else{
			card = new Card(skills[index]);
		}
		card.initial();
		this.cards.push(card);
		this.addCardToBoard(card);
	}

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
	public addCardToBoard(newCard: Card): void {
		newCard.x = this.width + 100;
		this.addChild(newCard);
		let index = this.cards.indexOf(newCard);
		this.adjustCardPosition(newCard, index)
	}

	/**
	 * 从cardboard中移除一张卡牌，主要是表现效果
	 * 表现前需要先从cards中移除对应卡牌
	 */
	private removeCardFromBoard(card: Card): void {
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
	 * 从玩家手中移除一张卡牌
	 */
	public removeCard(card:Card){
		let cards: Card[] = this.cards;
		card.unInitial();
		let index = cards.indexOf(card);
		cards.splice(index, 1);
		this.removeCardFromBoard(card);
		this.cardPool.push(card);
	}

	/**
	 * 销毁前要调用该方法释放资源
	 */
	public release(): void {
		for (let card of this.cards){
			card.unInitial();
			card.release();
		}
		for(let card of this.cardPool){
			card.release();
		}
		this.cards = null;
		this.cardPool = null;

	}

}