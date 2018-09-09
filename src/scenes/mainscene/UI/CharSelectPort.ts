class CharSelectPort extends eui.Component {

	private maskGroup: eui.Group;
	private portImg: eui.Image;

	public constructor(isUse: boolean, portName:string, rsLoad: ResAsyncLoadManager) {
		super();
		this.skinName = "mySkin.CharSelectPort";
		this.maskGroup.visible = !isUse;
		rsLoad.getResAsyncAndSetValue(portName, "texture", this.portImg);
	}
	
}