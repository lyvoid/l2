class UIBattleScene extends eui.Component implements  eui.UIComponent {
	private nextButton:eui.Button;
	private changeButton:eui.Button;
	
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
		this.skinName = "resource/eui_skins/ui/UIBattleScene.exml";
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
	}

	private onComplete(): void{
		this.nextButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			()=>MessageManager.Ins.sendMessage(
				MessageType.ClickNextButton
			),
			this
		);
		this.changeButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			()=>MessageManager.Ins.sendMessage(
				MessageType.ClickChangeButton
			),
			this
		);
	}
	
}