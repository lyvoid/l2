class LongTouchInfo extends eui.Component implements  eui.UIComponent {

	public desc:eui.Label;


	public constructor() {
		super();
		this.skinName = "resource/eui_skins/ui/LongTouchInfo.exml";
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
	}
	
}