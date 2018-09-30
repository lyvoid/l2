class SelectCharPopUpUI extends eui.Component {

	private charInfoLabel: eui.Label;
	private portGroup: eui.Group;
	private orderLabel: eui.Label;
	private _selectPort: CharSelectPort;
	private _ports: CharSelectPort[] = [];
	private _portPool: CharSelectPort[] = [];
	private backButton: eui.Button;
	private removeButton: eui.Button;
	private selectButton: eui.Button;
	private _formCharPopUp: FormCharPopUpUI;
	private _inOrder: number;

	public constructor(order: number, forCharPopUp: FormCharPopUpUI) {
		super();
		this.skinName = "mySkin.FormCardPopUpUI";
		this.width = LayerManager.Ins.stageWidth;
		this.height = LayerManager.Ins.stageHeight;
		LayerManager.Ins.popUpLayer.addChild(this);
		this._formCharPopUp = forCharPopUp;
		this.backButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onBackButtonTap,
			this
		);
		this.removeButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onRemoveButtonTap,
			this
		);
		this.selectButton.addEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onSelectButtonTap,
			this
		);
		this.initial(order);
	}

	public initial(order: number): void {
		this.orderLabel.text = "更换" + (order + 1) + "号位";
		this._inOrder = order; // 进入时候的order
		let groupWidth = LayerManager.Ins.stageWidth * 0.4;
		let imgWidth = (groupWidth - 20) / 3;
		let userTeam = UserData.Ins.userTeam;
		let charConfig = ConfigManager.Ins.mCharConfig;
		let userArmy = UserData.Ins.userArmy;
		let positionOrder = 0;
		this._ports = [];
		for (let i in userArmy) {
			let portName = charConfig[userArmy[i]]["charCode"] + "_portrait_png";
			let x = (imgWidth + 4) * (positionOrder % 3) + 6;
			let y = Math.floor(positionOrder / 3) * (imgWidth + 4) + 6;
			let iInt = parseInt(i);
			let port: CharSelectPort;
			// 如果池中有，优先从池中取
			if (this._portPool.length > 0) {
				port = this._portPool.pop();
			}
			else {
				// 如果池中没有，新建一个，并加一下事件监听
				port = new CharSelectPort();
				port.touchEnabled = true;
				port.addEventListener(
					egret.TouchEvent.TOUCH_TAP,
					this.onPortTap,
					this
				);
			}
			port.initial(iInt, portName);
			port.width = imgWidth;
			port.height = imgWidth;
			port.x = x;
			port.y = y;
			this.portGroup.addChild(port);
			if (positionOrder == 0) {
				// 默认选中第0个
				port.select();
				this._selectPort = port;
				this.setCharInfo(userArmy[port.userCharId]);
			}
			this._ports.push(port);
			positionOrder += 1;
		}
	}

	private onPortTap(e: egret.TouchEvent): void {
		this._selectPort.unSelect();
		let port = e.currentTarget as CharSelectPort;
		port.select();
		this._selectPort = port;
		let userArmy = UserData.Ins.userArmy;
		this.setCharInfo(userArmy[port.userCharId]);
	}

	private setCharInfoLabel(info: string): void {
		this.charInfoLabel.textFlow = (new egret.HtmlTextParser).parse(info);;
		let height = this.charInfoLabel.textHeight;
		this.charInfoLabel.height = height;
	}

	private setCharInfo(charId: number): void {
		let charInfo = ConfigManager.Ins.mCharConfig[charId];
		let skillInfos = ConfigManager.Ins.mSkillConfig;
		let buffInfos = ConfigManager.Ins.mBuffConfig;
		let manualSkillInfos = "";
		let passiveSkillInfos = "";
		let otherInfos = "";
		let otherInfoOfBuff = new MySet<number>();
		for (let i of charInfo["manualSkillsId"]) {
			let skillinfo = skillInfos[i]
			otherInfoOfBuff.addList(skillinfo["otherInfosOfBuffsId"]);
			let recycleTimes = skillinfo["recycleTimes"];
			let recycleTimesStr = recycleTimes == 0 ? "无限" : recycleTimes;
			manualSkillInfos += `<font color="#FFFFE0"><b>` +
				`${skillinfo["skillName"]}(${skillinfo["fireNeed"]}能量, ${recycleTimesStr}次,${skillinfo["maxCd"]}冷却)</b></font>:${skillinfo["description"]}\n`;
		}
		for (let i of charInfo["passiveSkillsId"]) {
			let buffInfo = buffInfos[i];
			passiveSkillInfos += `<font color="#FFFFE0"><b>` +
				`${buffInfo["buffName"]}</b></font>:${buffInfo["description"]}\n`;
		}
		for (let i of otherInfoOfBuff.data) {
			let buffInfo = buffInfos[i];
			otherInfos += `<font color="#FFFFE0"><b>` +
				`${buffInfo["buffName"]}</b></font>:${buffInfo["description"]}\n`;
		}
		let info = `<font color="#7FFF00" size="35"><b>${charInfo['charName']}</b></font>
<font size="25">${charInfo["feature"]}</font>


<font color="#FFFFE0"><b>--------属性--------</b></font>
生命:<font color="#FFFFE0">${charInfo["hp"]}</font>/${charInfo["maxHp"]}
护盾:<font color="#FFFFE0">${charInfo["shield"]}</font>/${charInfo["maxShield"]}
攻击:<font color="#FFFFE0">${charInfo["ap"]}</font>
物理护甲:<font color="#FFFFE0">${charInfo["arPys"]}</font>
魔法护甲:<font color="#FFFFE0">${charInfo["arMagic"]}</font>
穿甲:<font color="#FFFFE0">${charInfo["pierceAr"]}</font>
魔法减伤:<font color="#FFFFE0">${Math.floor(charInfo["magicDamageReducePerc"] * 100)}</font>%
最终魔法减伤:<font color="#FFFFE0">${charInfo["magicDamageReduceAbs"]}</font>
物理减伤:<font color="#FFFFE0">${Math.floor(charInfo["pysDamageReducePerc"] * 100)}</font>%
最终物理减伤:<font color="#FFFFE0">${charInfo["pysDamageReduceAbs"]}</font>


<font color="#FFFFE0"><b>--------主动技能--------</b></font>
${manualSkillInfos}


<font color="#FFFFE0"><b>--------被动技能--------</b></font>
${passiveSkillInfos}


<font color="#FFFFE0"><b>--------补充信息--------</b></font>
${otherInfos}
`
		this.setCharInfoLabel(info);
	}

	public onBackButtonTap(): void {
		this.hide();
		this._formCharPopUp.show();
	}

	public onRemoveButtonTap(): void {
		UserData.Ins.userTeam[this._inOrder] = -1;
		this.hide();
		this._formCharPopUp.show();
	}

	public onSelectButtonTap(): void {
		let userTeam = UserData.Ins.userTeam;
		let userArmy = UserData.Ins.userArmy;
		let selectUserCharId = this._selectPort.userCharId;
		let selectCharId = userArmy[selectUserCharId];
		// if selected char already in user team
		let curSelectInTeamOrder = userTeam.indexOf(selectUserCharId);
		if (curSelectInTeamOrder >= 0) {
			// remove this char from team
			userTeam[curSelectInTeamOrder] = -1;
		} else {
			// if user already have such char id in userTeam
			for (let i of userTeam) {
				if (userArmy[i] == selectCharId) {
					MyAlert.Ins.show("队伍中不可以使用相同角色哦");
					return;
				}
			}
		}
		UserData.Ins.userTeam[this._inOrder] = selectUserCharId;
		this.hide();
		this._formCharPopUp.show();
	}

	public hide(): void {
		this.visible = false;
		this._portPool = this._portPool.concat(this._ports);
		this._ports = [];
		this.portGroup.removeChildren();
		this._selectPort.unSelect();
		this._selectPort = null;
		this.enabled = false;
	}

	public show(order: number): void {
		this.initial(order);
		this.visible = true;
		this.enabled = true;
	}

	public close(): void {
		Util.safeRemoveFromParent(this);
		this.release();
	}

	public release(): void {
		// 释放所有侦听
		this.backButton.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onBackButtonTap,
			this
		);
		this.removeButton.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onRemoveButtonTap,
			this
		);
		this.selectButton.removeEventListener(
			egret.TouchEvent.TOUCH_TAP,
			this.onSelectButtonTap,
			this
		);
		for (let p of this._portPool.concat(this._ports)) {
			p.removeEventListener(
				egret.TouchEvent.TOUCH_TAP,
				this.onPortTap,
				this
			);
		}
		// 释放引用
		this._ports = null;
		this._portPool = null;
		this._formCharPopUp = null;
		this._selectPort = null;
	}

}