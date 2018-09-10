class CharSelectPort extends eui.Component {

	private maskGroup: eui.Group;
	private portImg: eui.Image;
	public userCharId: number;
	private maskLabel: eui.Label;
	public teamOrder: number = -1;
	private isSelectRect: eui.Rect;

	public constructor() {
		super();
		this.skinName = "mySkin.CharSelectPort";
	}

	public initial(userCharId: number, portName:string, rsLoad: ResAsyncLoadManager): void{
		this.userCharId = userCharId;
		this.maskGroup.visible = false;
		let order = UserData.Ins.userTeam.indexOf(userCharId);
		if (order >= 0){
			this.teamOrder = order;
			this.maskGroup.visible = true;
			this.maskLabel.text = order + 1 + "号位";
		}
		rsLoad.getResAsyncAndSetValue(portName, "texture", this.portImg);
	}

	public select(): void{
		this.isSelectRect.visible = true;
	}
	
	public unSelect(): void{
		this.isSelectRect.visible = false;
	}
}