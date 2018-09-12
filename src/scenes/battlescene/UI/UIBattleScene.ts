class UIBattleScene extends eui.Component {
	private addCardButton: eui.Button;
	private addFireButton: eui.Button;
	private roundEndButton: eui.Button;
	private cardNumLabel: eui.Label;
	private fireNumLabel: eui.Label;
	private roundLabel: eui.Label;
	private remainCardInfo: eui.Label;
	private cardRemainHelpRect: eui.Rect;
	private fireRemainHelpRect: eui.Rect;
	private fireHelpArrayImg: eui.Image;

	public set remainCardNum(value: number){
		this.remainCardInfo.text = `${value}`;
		this.remainCardInfo.textColor = value==0 ? 0xEE2C2C : 0x7FFF00;
	};

	public set fireNum(value: number){
		this.fireNumLabel.text = `${value}/${FireBoard.maxFireNum}`;
		this.fireNumLabel.textColor = value==0 ? 0xEE2C2C : 0x7FFF00;
	}

	public set round(value: number){
		this.roundLabel.text = `第 ${value} 回合`;
	}

	public set deckNum(value: number){
		this.cardNumLabel.text = `${value}/${CardBoard.maxCardNum}`;
		this.cardNumLabel.textColor = value==0 ? 0xEE2C2C : 0x7FFF00;
	}

	public showRoundEndButton():void{
		this.roundEndButton.visible = true;
	}


	public constructor() {
		super();
		this.skinName = "mySkin.UIBattleScene";
		this.height = LayerManager.Ins.stageHeight;
		this.width = LayerManager.Ins.stageWidth;
		LayerManager.Ins.uiLayer.addChild(this);
		this.roundEndButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onRoundEndButtonTap,
			this
		);
		this.cardRemainHelpRect.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onCardRemainHelpRectTap,
			this
		);
		this.fireRemainHelpRect.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onFireRemainHelpRectTap,
			this
		);
		// 两个作弊功能
		this.addCardButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onACBTTap,
			this
		);
		this.addFireButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onAFBTTap,
			this
		);
	}

	public fireSufficentAnim(): void{
		let fireHelpArrayImg = this.fireHelpArrayImg;
		fireHelpArrayImg.visible = true;
		fireHelpArrayImg.alpha = 1;
		egret.Tween.removeTweens(fireHelpArrayImg);
		egret.Tween.get(fireHelpArrayImg).to({
			alpha: 0
		}, 1000).call(
			()=>{
				fireHelpArrayImg.visible = false;
			}
		)
	}

	private onRoundEndButtonTap(): void {
		this.roundEndButton.visible = false;
		// 回合结束
		let scene = SceneManager.Ins.curScene as BattleScene;
		scene.setState(new PlayerRoundEndPhase());
	}

	private onACBTTap(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		scene.mCardBoard.distCardNormal();
	}

	private onAFBTTap(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		scene.mPlayerFireBoard.addFires(2);
	}

	private onCardRemainHelpRectTap(): void{
		let battleInfoPopupUI = (SceneManager.Ins.curScene as BattleScene).mBattleInfoPopupUI;
		battleInfoPopupUI.setDescFlowText(
`1.开场时人物的技能将变成卡牌进入卡组;
2.回合开始时将从卡组中随机两张发放;
3.卡牌释放后将重新回到卡组;
4.每次卡牌被消耗时，减少1次使用次数;
5.使用次数为零的卡牌将从游戏中排除,不会再回到卡组;
6.战场中一旦有角色被排除出游戏外，相关的卡牌也会同时从游戏中排除;
`
		);
		
		battleInfoPopupUI.setOnLeft();
		battleInfoPopupUI.addBgTapExit();
		LayerManager.Ins.popUpLayer.addChild(battleInfoPopupUI);
	}

	private onFireRemainHelpRectTap(): void{
		let battleInfoPopupUI = (SceneManager.Ins.curScene as BattleScene).mBattleInfoPopupUI;
		battleInfoPopupUI.setDescFlowText(
`1.使用卡牌需要消耗能量;
2.无法释放需求能量高于当前能量的卡牌;
3.回合开始时能量将回复至当前回合数的点数;
4.能量最高能只积攒10点;
`
		);
		battleInfoPopupUI.setOnRight();
		battleInfoPopupUI.addBgTapExit();
		LayerManager.Ins.popUpLayer.addChild(battleInfoPopupUI);
	}

	public release(): void {
		this.addCardButton.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onACBTTap,
			this
		);
		this.addFireButton.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onAFBTTap,
			this
		);
		this.roundEndButton.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onRoundEndButtonTap,
			this
		);
		this.cardRemainHelpRect.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onCardRemainHelpRectTap,
			this
		);
		this.fireRemainHelpRect.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onFireRemainHelpRectTap,
			this
		);
	}

}