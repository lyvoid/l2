class CardInfoPopupUI extends eui.Component {

	public desc:eui.Label;

	public constructor() {
		super();
		this.skinName = "mySkin.CardInfoPopupUI";
	}

	public setDescFlowText(content: string): void{
		this.desc.textFlow = (new egret.HtmlTextParser).parse(content);
	}
	
}