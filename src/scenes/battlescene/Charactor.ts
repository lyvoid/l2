class Charactor extends egret.DisplayObjectContainer{
	/**
	 * 动画
	 */
	public armatureDisplay: dragonBones.EgretArmatureDisplay;

	public desc: string = "21sdf";
	
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

	public constructor(charactorName:string, dbManager: DBManager) {
		super();
		let bg = new egret.DisplayObjectContainer();
		this.bgLayer = bg;
		this.addChild(bg);
		this.loadArmature(charactorName, dbManager);
		LongTouchUtil.bindLongTouch(this, this);
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