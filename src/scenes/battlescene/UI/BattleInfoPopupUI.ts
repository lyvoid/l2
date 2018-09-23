class BattleInfoPopupUI extends eui.Component {

	private desc: eui.Label;
	private contentGroup: eui.Group;
	private infoScroller: eui.Scroller;
	private bg: eui.Rect;

	private _ny: number;
	public constructor() {
		super();
		this.skinName = "mySkin.BattleInfoPopupUI";
		this.width = LayerManager.Ins.stageWidth;
		this.height = LayerManager.Ins.stageHeight;
		this._ny = this.infoScroller.viewport.scrollV;
		this.bg.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onBgTap,
			this
		);
	}

	public setDescFlowText(content: string): void {
		this.desc.textFlow = (new egret.HtmlTextParser).parse(content);
		this.desc.height = this.desc.textHeight;
		this.infoScroller.viewport.scrollV = this._ny;
	}

	public setOnRight(): void {
		this.contentGroup.horizontalCenter = 280;
	}

	private onBgTap(): void {
		MessageManager.Ins.sendMessage(MessageType.BattleInfoPopUpClose);
		this.hide();
	}

	public setOnLeft(): void {
		this.contentGroup.horizontalCenter = -280;
	}

	public show(): void {
		LayerManager.Ins.popUpLayer.addChild(this);
	}

	public hide(): void {
		LayerManager.Ins.popUpLayer.removeChild(this);
	}

	public release(): void {
		this.bg.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onBgTap,
			this
		);
	}

}