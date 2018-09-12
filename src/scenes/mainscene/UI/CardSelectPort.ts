class CardSelectPort extends eui.Component {

	private maskGroup: eui.Group;
	private portImg: eui.Image;
	public userCardId: number;
	private maskLabel: eui.Label;
	private isSelectRect: eui.Rect;

	public constructor() {
		super();
		this.skinName = "mySkin.CharSelectPort";
	}

	public initial(userCardId: number, portName: string): void {
		this.userCardId = userCardId;
		this.maskGroup.visible = false;
		if (UserData.Ins.userDeck.indexOf(userCardId) >= 0) {
			// if card in user deck, show mask
			this.setInDeck();
		}
		let rsLoader = (SceneManager.Ins.curScene as MainScene).mRsLoader;
		rsLoader.getResAsyncAndSetValue(portName, "texture", this.portImg);
	}

	public setInDeck(): void {
		this.maskGroup.visible = true;
		this.maskLabel.text = "卡组中";
	}

	public outOfDeck(): void{
		this.maskGroup.visible = false;
	}

	public select(): void {
		this.isSelectRect.visible = true;
	}

	public unSelect(): void {
		this.isSelectRect.visible = false;
	}
}