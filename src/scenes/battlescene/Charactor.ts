class Charactor extends egret.DisplayObjectContainer{
	/**
	 * 动画
	 */
	public armatureDisplay: dragonBones.EgretArmatureDisplay;
	public lifeBar: egret.Bitmap;

	/**
	 * 人物当前状态描述，在长按中展示
	 */
	public get desc():string{
		return `ap:${this.attr.ap}\n` + 
		`df:${this.attr.df}\nhp:${this.attr.chp}/${this.attr.mhp}`;
	}

	/**
	 * 属性
	 */
	public attr: Attribute = new Attribute();

	/**
	 * 是否存活
	 */
	public isAlive: boolean = true;

	/**
	 * 主动技能列表
	 */
	public manualSkills: ISkill[];

	/**
	 * 被动技能
	 */
	public passiveSkill: ISkill;

	public testSkill: ISkill = new SkillTmp();

	public bgLayer: egret.DisplayObjectContainer;
	/**
	 * 阵营
	 */
	public camp: CharCamp = CharCamp.self; 

	/**
	 * 前中后排
	 */
	public row: CharRowType = CharRowType.frontRow;
	
	/**
	 * 位置 上中下
	 */
	public position: CharPositionType = CharPositionType.mid;


	public randomTarget():Charactor{
		return this;
	}

	public randomFriend():Charactor{
		return this;
	}

	public hurt(ht:Hurt): void{
		if(!this.isAlive){
			return
		}
		let df = this.attr.df;
		let harm = ht.hurtNumber - df;
		if (harm < 0){
			harm = ht.hurtNumber / 10;
		}
		this.attr.chp -= harm;
		
		if (this.attr.chp <= 0){
			this.isAlive = false;
			this.attr.chp = 0;
			this.parent.removeChild(this);
		}
	}

	public constructor(charactorName:string, dbManager: DBManager) {
		super();
		let bg = new egret.DisplayObjectContainer();
		this.bgLayer = bg;
		this.addChild(bg);
		this.loadArmature(charactorName, dbManager);
		LongTouchUtil.bindLongTouch(this, this);
		let lifebarBg = new egret.Bitmap(RES.getRes("lifebarbg_jpg"));
		lifebarBg.alpha = 0.5;
		lifebarBg.width = 100;
		lifebarBg.y = -210;
		lifebarBg.x = -50;
		let lifebar = new egret.Bitmap(RES.getRes("lifebar_jpg"));
		lifebar.width = 100;
		lifebar.y = -209;
		lifebar.x = -50;
		this.addChild(lifebarBg);
		this.addChild(lifebar);
		this.lifeBar = lifebar;
		
	}

	private loadArmature(charactorName:string, dbManager: DBManager): void{
		let armatureDisplay: dragonBones.EgretArmatureDisplay = dbManager.getArmatureDisplay(
			charactorName);
		let demandArmatureWidth = 100;
		let demandArmatureHeight = 200;
		armatureDisplay.scaleX = demandArmatureWidth / armatureDisplay.width;
		armatureDisplay.scaleY = demandArmatureHeight / armatureDisplay.height;
		armatureDisplay.width = demandArmatureWidth;
		armatureDisplay.height = demandArmatureHeight;
		armatureDisplay.touchEnabled = true;
		armatureDisplay.addEventListener(egret.TouchEvent.TOUCH_TAP,
		()=>{
			MessageManager.Ins.sendMessage(
				MessageType.ClickChar,
				this
			);
		}, this);
		this.addChild(armatureDisplay);
		this.armatureDisplay = armatureDisplay;

		this.addEventListener(
			egret.TouchEvent.TOUCH_BEGIN,
			this.sendBeginTouchMessage,
			this
		);
	}

	private sendBeginTouchMessage(): void{
		MessageManager.Ins.sendMessage(
			MessageType.TouchBegin,
			this.armatureDisplay
		);
	}



	public setPosition(){
		this.y = 300 + 65 * this.position + Math.random() * 30;
		this.scaleX *= this.camp;
		this.x = 120 + this.row * 130 + this.position * 20 + Math.random() * 10;
		if (this.camp == CharCamp.enemy){
			this.x = LayerManager.Ins.stageWidth - this.x;
		}
	}

	public getPositon(): {x:number, y: number}{
		let y = 300 + 65 * this.position + Math.random() * 30;
		let x = 120 + this.row * 130 + this.position * 20 + Math.random() * 10;
		if (this.camp == CharCamp.enemy){
			x = LayerManager.Ins.stageWidth - x;
		}
		return {x: x, y: y}
	}

	public release(): void{
		LongTouchUtil.unbindLongTouch(this, this);
		this.armatureDisplay = null;
		this.bgLayer = null;
	}

}

enum CharCamp{
	self=1,
	enemy=-1,
}

enum CharRowType{
	frontRow,
	midRow,
	backRow
}

enum CharPositionType{
	up,
	mid,
	down
}