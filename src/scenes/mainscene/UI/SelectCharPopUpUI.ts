class SelectCharPopUpUI extends eui.Component{

	private charInfoLabel: eui.Label;
	private portGroup: eui.Group;
	private _rsLoader: ResAsyncLoadManager = new ResAsyncLoadManager();
	private orderLabel: eui.Label;

	public constructor(order: number) {
		super();
		this.skinName = "mySkin.SelectCharPopUpUI";
		this.width = LayerManager.Ins.stageWidth;
		this.height = LayerManager.Ins.stageHeight;
		LayerManager.Ins.popUpLayer.addChild(this);
		this.initial(order);
	}

	public initial(order: number): void{
		this.orderLabel.text = order + 1 + "号位";
		let groupWidth = LayerManager.Ins.stageWidth * 0.4;
		let imgWidth = (groupWidth - 20) / 3;
		let userTeam = UserData.Ins.userTeam;
		let charConfig = ConfigManager.Ins.mCharConfig;
		let userArmy = UserData.Ins.userArmy;
		for (let i in userArmy){
			let portName = charConfig[userArmy[i]]["charCode"] + "_portrait_png";
			let iInt = parseInt(i);
			let x = (imgWidth + 4) * (iInt % 3) + 6;
			let y = Math.floor(iInt / 3) * (imgWidth + 4) + 6;
			let img = new CharSelectPort(userTeam.indexOf(iInt)>=0, portName, this._rsLoader);
			img.width = imgWidth;
			img.height = imgWidth;
			img.x = x;
			img.y = y;
			this.portGroup.addChild(img);
		}
	}

	private setCharInfoLabel(info: string): void{
		this.charInfoLabel.textFlow = (new egret.HtmlTextParser).parse(info);;
		let height = this.charInfoLabel.textHeight;
		this.charInfoLabel.height = height * (1 + (height - 320) / 150);
	}

	private setCharInfo(charId: number): void{
		let charInfo = ConfigManager.Ins.mCharConfig[charId];
		let skillInfos = ConfigManager.Ins.mSkillConfig;
		let buffInfos = ConfigManager.Ins.mBuffConfig;
		let manualSkillInfos = "";
		let passiveSkillInfos = "";
		let otherInfos = "";
		for(let i of charInfo["manualSkillsId"]){
			let skillinfo = skillInfos[i]
			manualSkillInfos += `<font color="#7FFF00"><b>` +
				`${skillinfo["skillName"]}(${skillinfo["fireNeed"]}能量):</b></font>${skillinfo["description"]}\n`
		}
		for (let i of charInfo["passiveSkillsId"]){
			let buffInfo = buffInfos[i];
			passiveSkillInfos += `<font color="#7FFF00"><b>` +
				`${buffInfo["buffName"]}:</b></font>${buffInfo["description"]}\n`;
		}
		for (let i of charInfo["otherBuffInfos"]){
			let buffInfo = buffInfos[i];
			otherInfos += `<font color="#7FFF00"><b>` +
				`${buffInfo["buffName"]}:</b></font>${buffInfo["description"]}\n`;
		}
		let info = `
<font color="#7FFF00"><b>${charInfo['charName']}</b></font>

<font color="#EE7942"><b>主动技能：</b></font>
${manualSkillInfos}

<font color="#EE7942"><b>被动技能：</b></font>
${passiveSkillInfos}

<font color="#EE7942"><b>其他描述：</b></font>
${otherInfos}
`
		this.setCharInfoLabel(info);
	}

	public hide(): void{
		this.visible = false;
		this.enabled = false;
	}

	public show(order: number): void{
		this.initial(order);
		this.visible = true;
		this.enabled = true;
	}

	public close(): void{
		Util.safeRemoveFromParent(this);
		this.release();
	}

	public release(): void{
		// 释放所有资源
		this._rsLoader.releaseResource();
	}

}