class CharSelectPort extends eui.Component {

	private maskGroup: eui.Group;
	private portImg: eui.Image;
	public userCharId: number;
	private maskLabel: eui.Label;
	private isSelectRect: eui.Rect;

	public constructor() {
		super();
		this.skinName = "mySkin.CharSelectPort";
	}

	public initial(userCharId: number, portName:string): void{
		this.userCharId = userCharId;
		this.maskGroup.visible = false;
		let order = UserData.Ins.userTeam.indexOf(userCharId);
		if (order >= 0){
			this.maskGroup.visible = true;
			this.maskLabel.text = order + 1 + "号位";
		}
		let rsLoader = (SceneManager.Ins.curScene as MainScene).mRsLoader;
		rsLoader.getResAsyncAndSetValue(portName, "texture", this.portImg);
	}

	public select(): void{
		this.isSelectRect.visible = true;
	}
	
	public unSelect(): void{
		this.isSelectRect.visible = false;
	}
}