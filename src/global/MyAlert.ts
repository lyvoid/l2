/**
 * my common alert window
 */
class MyAlert extends eui.Component{
	private infoLabel: eui.Label;
	private comfirmButton: eui.Button;
	private static _ins: MyAlert;
	public static get Ins():MyAlert{
		if (MyAlert._ins == null){
			MyAlert._ins = new MyAlert();
		}
		return MyAlert._ins;
	}

	private constructor(){
		super();
		this.skinName = "mySkin.MyAlert";
		this.width = LayerManager.Ins.stageWidth;
		this.height = LayerManager.Ins.stageHeight;
		this.comfirmButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			()=>{
				this.hide();
			},
			this
		);
	}

	public show(info: string): void{
		LayerManager.Ins.popUpLayer.addChild(this);
		this.infoLabel.text = info;
	}

	public hide(): void{
		Util.safeRemoveFromParent(this);
	}

}