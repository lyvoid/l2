class ToastInfoManager{

	private labelPools: eui.Label[] = [];

	private static instance: ToastInfoManager;

	public static get Ins(): ToastInfoManager{
		let ins = ToastInfoManager.instance
		if (ins == null){
			return ins;
		}
		ins = new ToastInfoManager();
		ToastInfoManager.instance = ins;
		return ins;
	}

	private constructor() {
	}

	public initial(){
	}

	public newToast(info: string): void{
		let label: eui.Label;
		if (this.labelPools.length > 0){
			label = this.labelPools.pop()
		}else{
			label = new eui.Label();
			label.horizontalCenter = 0;
		}
		label.y = 100;
		label.alpha = 1;
		label.text = info;
		LayerManager.Ins.popUpLayer.addChild(label);
		egret.Tween.get(label).to(
			{y: 20, alpha: 0}, 1000
		).call(
			()=>{
				LayerManager.Ins.popUpLayer.removeChild(label);
				this.labelPools.push(label);
			}
		)
	}
}