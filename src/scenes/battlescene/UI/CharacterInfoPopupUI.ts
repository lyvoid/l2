class CharacterInfoPopupUI extends eui.Component {
	public desc: eui.Label;
	public skillDesc: eui.Label;
	public constructor() {
		super();
		this.skinName = "mySkin.CharacterInfo";
	}

	public setDescFlowText(content: string): void{
		this.desc.textFlow = (new egret.HtmlTextParser).parse(content);
	}

	public setSkillDescFlowText(content: string): void{
		this.skillDesc.textFlow = (new egret.HtmlTextParser).parse(content);
	}

	public release():void{
		this.desc = null;
		this.skillDesc = null;
		this.removeChildren();
	}
}