class ToastInfoManager{

	private static _labelPools: eui.Label[] = [];

	public static newToast(info: string, color:number=0xFFFFFF): void{
		let label: eui.Label;
		if (this._labelPools.length > 0){
			label = this._labelPools.pop()
		}else{
			label = new eui.Label();
			label.horizontalCenter = 0;
		}
		label.textColor = color;
		label.y = LayerManager.Ins.stageHeight/2;
		label.alpha = 1;
		label.size = 30;
		label.text = info;
		label.bold = true;
		LayerManager.Ins.popUpLayer.addChild(label);
		egret.Tween.get(label).to(
			{y: label.y - 100, alpha: 0}, 6000, egret.Ease.circOut
		).call(
			()=>{
				LayerManager.Ins.popUpLayer.removeChild(label);
				this._labelPools.push(label);
			}
		)
	}
}