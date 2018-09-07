class LoadingUI extends eui.UILayer implements RES.PromiseTaskReporter{

	private _loadProgressTF: eui.Label;

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
		this._loadProgressTF = new eui.Label();
		this._loadProgressTF.bottom = 15;
		this._loadProgressTF.horizontalCenter = 0;
		this.addChild(this._loadProgressTF);
	}

	public initial(): void{
		this._loadProgressTF.text = "Loading...";
	}

	public onProgress(current: number, total: number): void {
        this._loadProgressTF.text = `Loading...${current}/${total}`;
    }

}
