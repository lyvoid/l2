class LoadingUI extends eui.UILayer implements RES.PromiseTaskReporter{

	public constructor(stageHeight: number, stageWidth: number) {
		super();
		let blackBg = new egret.Shape();
		blackBg.graphics.beginFill(0x0);
		blackBg.graphics.drawRect(0, 0, stageWidth, stageHeight);
		blackBg.graphics.endFill();
		this.addChild(blackBg);
		let imageBg = new egret.Bitmap(RES.getRes("loadingbg_png"));
		let scale = stageWidth / imageBg.width;
		imageBg.scaleX = scale;
		imageBg.scaleY = scale;
		imageBg.y = (stageHeight - imageBg.height * scale) / 2;
		this.addChild(imageBg);
		this.textField = new eui.Label();
		this.textField.bottom = 15;
		this.textField.horizontalCenter = 0;
		this.addChild(this.textField);
	}

	private textField: eui.Label;

	public onProgress(current: number, total: number): void {
        this.textField.text = `Loading...${current}/${total}`;
    }
}
