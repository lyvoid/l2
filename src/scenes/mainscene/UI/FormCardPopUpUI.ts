class FormCardPopUpUI extends eui.Component {

	private charInfoLabel: eui.Label;
	private portGroup: eui.Group;
	private _rsLoader: ResAsyncLoadManager = new ResAsyncLoadManager();
	private _selectPort: CardSelectPort;
	private _ports: CardSelectPort[] = [];
	private _portPool: CardSelectPort[] = [];
	private backButton: eui.Button;
	private removeButton: eui.Button;
	private selectButton: eui.Button;

	public constructor() {
		super();
		this.skinName = "mySkin.FormCardPopUpUI";
		this.width = LayerManager.Ins.stageWidth;
		this.height = LayerManager.Ins.stageHeight;
		this.backButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onBackButtonTap,
			this
		);
		this.removeButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onRemoveButtonTap,
			this
		);
		this.selectButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onSelectButtonTap,
			this
		);
		this.initial();
		LayerManager.Ins.popUpLayer.addChild(this);
	}

	public initial(): void {
		let groupWidth = LayerManager.Ins.stageWidth * 0.4;
		let imgWidth = (groupWidth - 20) / 3;
		let userTeam = UserData.Ins.userTeam;
		let skillConfig = ConfigManager.Ins.mSkillConfig;
		let userCard = UserData.Ins.userCards;
		let positionOrder = 0;
		this._ports = [];
		for (let i in userCard) {
			let portName = skillConfig[userCard[i]]["iconName"];
			let x = (imgWidth + 4) * (positionOrder % 3) + 6;
			let y = Math.floor(positionOrder / 3) * (imgWidth + 4) + 6;
			let iInt = parseInt(i);
			let port: CardSelectPort;
			// 如果池中有，优先从池中取
			if (this._portPool.length > 0) {
				port = this._portPool.pop();
			}
			else {
				// 如果池中没有，新建一个，并加一下事件监听
				port = new CardSelectPort();
				port.touchEnabled = true;
				port.addEventListener(
					egret.TouchEvent.TOUCH_TAP,
					this.onPortTap,
					this
				);
			}
			port.initial(iInt, portName, this._rsLoader);
			port.width = imgWidth;
			port.height = imgWidth;
			port.x = x;
			port.y = y;
			this.portGroup.addChild(port);
			if (positionOrder == 0) {
				port.select();
				this._selectPort = port;
				this.setCardInfo(userCard[port.userCardId]);
			}
			this._ports.push(port);
			positionOrder += 1;
		}
	}

	private onPortTap(e: egret.TouchEvent): void {
		this._selectPort.unSelect();
		let port = e.currentTarget as CardSelectPort;
		port.select();
		this._selectPort = port;
		let userCard = UserData.Ins.userCards;
		this.setCardInfo(userCard[port.userCardId]);
	}

	private setCardInfoLabel(info: string): void {
		this.charInfoLabel.textFlow = (new egret.HtmlTextParser).parse(info);;
		let height = this.charInfoLabel.textHeight;
		this.charInfoLabel.height = height;
	}

	private setCardInfo(cardId: number): void {
		let skillInfo = ConfigManager.Ins.mSkillConfig[cardId];
		let buffInfos = ConfigManager.Ins.mBuffConfig;
		let otherInfos = "";
		for (let i of skillInfo["otherInfosOfBuffsId"]) {
			let buffInfo = buffInfos[i];
			otherInfos += `<font color="#7FFF00"><b>` +
				`${buffInfo["buffName"]}:</b></font>${buffInfo["description"]}\n`;
		}
		let info = `
<font color="#7FFF00"><b>${skillInfo['skillName']}(${skillInfo["fireNeed"]}能量)</b></font>

<font color="#EE7942"><b>描述：</b></font>
${skillInfo["description"]}

<font color="#EE7942"><b>其他描述：</b></font>
${otherInfos}
`
		this.setCardInfoLabel(info);
	}

	public onBackButtonTap(): void {
		this.hide();
	}

	public onRemoveButtonTap(): void {
		Util.removeObjFromArray(UserData.Ins.userDeck, this._selectPort.userCardId);
		this._selectPort.outOfDeck();
	}

	public onSelectButtonTap(): void {
		let userDeck = UserData.Ins.userDeck;
		let userCard = UserData.Ins.userCards;
		let selectCard = this._selectPort;
		// if selected char already in user deck
		let curSelectInDeckOrder = userDeck.indexOf(selectCard.userCardId);
		if (curSelectInDeckOrder >= 0) {
			// return
			return;
		}
		userDeck.push(selectCard.userCardId);
		this._selectPort.setInDeck();
	}

	public hide(): void {
		this.visible = false;
		this._portPool = this._portPool.concat(this._ports);
		this._ports = [];
		this.portGroup.removeChildren();
		this._selectPort.unSelect();
		this.enabled = false;
	}

	public show(): void {
		this.initial();
		this.visible = true;
		this.enabled = true;
	}

	public close(): void {
		Util.safeRemoveFromParent(this);
		this.release();
	}

	public release(): void {
		// 释放所有侦听
		this.backButton.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onBackButtonTap,
			this
		);
		this.removeButton.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onRemoveButtonTap,
			this
		);
		this.selectButton.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onSelectButtonTap,
			this
		);
		for (let p of this._portPool.concat(this._ports)) {
			p.removeEventListener(
				egret.TouchEvent.TOUCH_TAP,
				this.onPortTap,
				this
			);
		}
		// 释放引用
		this._ports = null;
		this._portPool = null;
		this._selectPort = null;
		// 释放所有资源
		this._rsLoader.releaseResource();
		this._rsLoader = null;
	}

}