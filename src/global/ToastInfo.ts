class ToastInfoManager{

	private _labelPools: eui.Label[] = [];

	private static _instance: ToastInfoManager;

	public static get Ins(): ToastInfoManager{
		let ins = ToastInfoManager._instance
		if (ins != null){
			return ins;
		}
		ins = new ToastInfoManager();
		ToastInfoManager._instance = ins;
		return ins;
	}

	public initial(): void{
	}

	public release(): void{
		this._labelPools = null;
	}

	public newToast(info: string): void{
		let label: eui.Label;
		if (this._labelPools.length > 0){
			label = this._labelPools.pop()
		}else{
			label = new eui.Label();
			label.horizontalCenter = 0;
		}
		label.y = 100;
		label.alpha = 1;
		label.text = info;
		LayerManager.Ins.popUpLayer.addChild(label);
		egret.Tween.get(label).to(
			{y: 20, alpha: 0}, 2000, egret.Ease.quintInOut
		).call(
			()=>{
				LayerManager.Ins.popUpLayer.removeChild(label);
				this._labelPools.push(label);
			}
		)
	}
}