class CardManager {

	private cards: Card[] = [];
	private cardBoard: CardBoard;
	private cardObjectPool: Card[] = []; // 对象池

	public constructor(cards: Card[], cardBoard?:CardBoard) {
		this.cards = cards;
		this.cardBoard = cardBoard;
		MessageManager.Ins.addEventListener(
			MessageType.UseCard,
			this.useCard,
			this
		);
		MessageManager.Ins.addEventListener(
			MessageType.ClickNextButton,
			this.distCardNormal,
			this
		);
	}

	private useCard(e:Message): void{
		let card: Card = e.messageContent as Card;
		this.removeCard(card);
	}
	
	public distCardNormal(){
		let card = new Card();
		card.initial();
		this.cards.push(card);
		if(this.cardBoard){
			this.cardBoard.addCard(card);
		}
	}

	public removeCard(card:Card){
		let cards: Card[] = this.cards;
		card.unInitial();
		let index = cards.indexOf(card);
		cards.splice(index, 1);
		if(this.cardBoard){
			this.cardBoard.removeCard(card);
		}
	}

	/**
	 * 销毁前调用
	 */
	public release(): void{
		for (let card of this.cards){
			card.unInitial();
			card.release();
		}
		for(let card of this.cardObjectPool){
			card.release();
		}
		this.cards = null;
		this.cardObjectPool = null;
		this.cardBoard = null;

		MessageManager.Ins.removeEventListener(
			MessageType.RemoveCard,
			this.useCard,
			this
		);	
	}

}