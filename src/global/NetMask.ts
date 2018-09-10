class NetMask extends eui.UILayer {

	private _label: eui.Label;
	private static _labelTexts: string[] = [
		"connect", "connect.", "connect..", "connect..."
	];
	private _curTextIndex = 0;
	public constructor() {
		super();
		let label: eui.Label = new eui.Label();
		this._label = label;
		label.text = NetMask._labelTexts[0];
		label.textColor = 0x7FFF00;
		label.bottom = 10;
		label.right = 10;
		label.width = 150;
		this.addChild(label);
	}

	public show(n: number): void {
		this.visible = true;
		this.touchEnabled = true;
		this._hideNumbers.add(n);
		this.startAni();
	}

	private _hideNumbers: MySet<number> = new MySet<number>();
	public hide(): void;
	public hide(n: number): void;
	public hide(n: number = -1): void {
		this._hideNumbers.remove(n);
		if (this._hideNumbers.data.length == 0) {
			this.visible = false;
			this.touchEnabled = false;
		}
	}

	private startAni(): void {
		if (this._curTextIndex < NetMask._labelTexts.length - 1) {
			this._label.text = NetMask._labelTexts[this._curTextIndex += 1];
		} else {
			this._label.text = NetMask._labelTexts[this._curTextIndex = 0];
		}
		if (this.visible) {
			egret.setTimeout(
				this.startAni,
				this,
				400
			);
		}
	}
}