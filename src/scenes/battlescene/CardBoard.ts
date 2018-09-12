class CardBoard extends egret.DisplayObjectContainer {
	private _cards: Card[] = [];
	private _cardPool: Card[] = [];
	public static maxCardNum = 10;

	public constructor() {
		super();
		this.y = LayerManager.Ins.stageHeight - 140;
		this.width = LayerManager.Ins.stageWidth;
	}
	
	public removeCardOfChar(char: Character): void{
		let cardsForDelete: Card[] = [];
		for (let card of this._cards){
			if (card.mCaster == char){
				cardsForDelete.push(card);
			}
		}
		this.removeCards(cardsForDelete);
	}

	private removeCards(cards:Card[]): void{
		for(let index in cards){
			let card = cards[index]
			Util.removeObjFromArray(this._cards, card);
			card.release();
			if (parseInt(index) == cards.length-1){
				// 如果是最后一张，对全体调整
				this.removeCardFromBoard(card, 0);
			} else {
				this.removeCardFromBoard(card, this._cards.length);
			}
		}
	}

	public distCardNormal(){
		let scene = SceneManager.Ins.curScene as BattleScene
		let skills = scene.mManualSkillIdPool;
		if(skills.length == 0){
			ToastInfoManager.Ins.newToast("卡组已空");
			return;
		}
		let index = Math.floor(Math.random() * skills.length);
		let card: Card;
		if (this._cardPool.length > 0){
			card = this._cardPool.pop();
		} else{
			card = new Card();
		}
		let cardInfo = skills[index];
		// if recycle times equals -1, load recycle times from config
		if (cardInfo[2] == -1) {
			cardInfo[2] = ConfigManager.Ins.mSkillConfig[
				cardInfo[0]]['recycleTimes'];
		}
		// initial card
		card.initial(cardInfo[0], cardInfo[1], cardInfo[2]);
		card.mSkillInfoOfPoll = cardInfo;
		skills.splice(index, 1);
		if (cardInfo[2] == 1){
			// if recycle times of skill is 1, remove from skill _cardPool
			card.mSkillInfoOfPoll = null;
		} else if (cardInfo[2] != 0) {
			// else if recycle times not equal 0 recycle time --
			cardInfo[2] -= 1;
		}
		this.addCard(card);
		scene.mBattleUI.remainCardNum = skills.length;
	}

	private _overFlowNum: number = 0;//记录当前场上溢出的卡牌总数，方便表现
	private addCard(card: Card): void{
		if (this._cards.length < CardBoard.maxCardNum){
			this._cards.push(card);
			this.addCardToBoard(card, this._cards.length - 1);
			let scene = SceneManager.Ins.curScene as BattleScene;
			scene.mBattleUI.deckNum = this._cards.length;
		} else {
			this._overFlowNum += 1;
			// 如果是溢出的卡牌，需要立马关闭其touchEnable
			card.touchEnabled = false;
			this.addCardToBoard(card, CardBoard.maxCardNum + this._overFlowNum -1).call(
				()=>{
					this.removeCardFromBoard(card, CardBoard.maxCardNum);
					this._overFlowNum -= 1;
				}
			);
		}

	}

	private adjustCardsPosition(twTime: number = 600, minIndex:number=0): void {
		let cards: Card[] = this._cards;
		for (let i in cards) {
			if (parseInt(i) >= minIndex){
				let card: Card = cards[i]
				this.adjustCardPosition(card, parseInt(i), twTime);
			}
		}
	}

	private adjustCardPosition(card: Card, index: number, twTime: number = 400): egret.Tween {
		let newX = this.getCardX(index);
		let tw = egret.Tween.get(card);
		return tw.to({ x: newX }, twTime);
	}

	private getCardX(index: number): number {
		return 90 * index;
	}

	private addCardToBoard(newCard: Card, index:number): egret.Tween {
		newCard.x = this.width + 100;
		this.addChild(newCard);
		return this.adjustCardPosition(newCard, index, 400)
	}

	public removeCard(card:Card){
		// 逻辑上去除
		let scene = SceneManager.Ins.curScene as BattleScene;
		let cards: Card[] = this._cards;
		if(card.mSkillInfoOfPoll){
			scene.mManualSkillIdPool.push(card.mSkillInfoOfPoll);
			scene.mBattleUI.remainCardNum = scene.mManualSkillIdPool.length;
		}
		card.release();
		let index = cards.indexOf(card);
		cards.splice(index, 1);
		this.removeCardFromBoard(card, index);
		scene.mBattleUI.deckNum = this._cards.length;
	}

	private removeCardFromBoard(card: Card, index:number): void{
		// 表现上去除
		let tw = egret.Tween.get(card);
		let cardx = card.x;
		let cardy = card.y;
		let cardw = card.width;
		let cardh = card.height;
		let newcardx = cardx - 0.25 * cardw;
		let newcardy = cardy - 0.25 * cardh;
		this.adjustCardsPosition(450, index);
		tw.to(
			{
				scaleX: 1.5,
				scaleY: 1.5,
				alpha: 0,
				x: newcardx,
				y: newcardy
			},
			300
		).call(
			() => {
				this.removeChild(card);
				this._cardPool.push(card);
			}
		);
	}

	public release(): void {
		for (let card of this._cards){
			card.release();
			card.removeChildren();
		}
		for (let card of this._cardPool){
			card.removeChildren();
		}
		this._cards = null;
		this._cardPool = null;
		this.removeChildren();
	}

}