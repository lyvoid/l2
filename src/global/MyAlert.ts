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

	public constructor(){
		super();
		this.skinName = "mySkin.MyAlert"
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