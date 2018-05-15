class BattleScene extends IScene {

	/**
	 * 龙骨管理器，始终只有一个存在
	 */
	public dbManager: DBManager;

	/**
	 * 用户的卡牌
	 */
	public cards: Card[] = [];
	public cardBoard: CardBoard;
	public cardManager: CardManager;
	public bcr: BattleCR;

	public enemies: Charactor[] = [];
	public friends: Charactor[] = [];

	public selectEnemy: Charactor;
	public selectFriend: Charactor;
	
	public playerFireBoard: FireBoard;

	public initial() {
		super.initial();

		this.dbManager = new DBManager();
		this.cardBoard = new CardBoard(this.cards);
		this.cardManager = new CardManager(this.cards, this.cardBoard);


		// 实例化GameLayer的层
		let gameLayer = LayerManager.Ins.gameLayer;
		gameLayer.addChildAt(
			new egret.DisplayObjectContainer(),
			BattleSLEnum.bgLayer
		);
		gameLayer.addChildAt(
			new egret.DisplayObjectContainer(),
			BattleSLEnum.CharLayer
		);
		gameLayer.addChildAt(
			new egret.DisplayObjectContainer(),
			BattleSLEnum.fgLayer
		);
		gameLayer.addChildAt(
			new egret.DisplayObjectContainer(),
			BattleSLEnum.cardLayer
		);


		this.runScene().catch(e => {
			console.log(e);
		}).then(() => {
			console.log("battlescene场景初始化完成");
		});

	}

	private async runScene() {

		// 载入通用资源
		await RES.loadGroup("battlecommon");
		console.log("战场通用资源载入完成");

		this.bcr = new BattleCR();


		// 载入龙骨资源
		for (let charactorName of ["Dragon", "Swordsman"]) {
			await RES.getResAsync(`${charactorName}_db_ske_json`);
			await RES.getResAsync(`${charactorName}_db_tex_json`);
			await RES.getResAsync(`${charactorName}_db_tex_png`);
		}
		console.log("角色龙骨资源载入完成");


		// 载入背景图片资源
		await RES.getResAsync("bg_json");
		console.log("战斗背景图片载入完成");
		let bgTex_1: egret.Texture = RES.getRes("bg_json.-2_png");
		let img1: egret.Bitmap = new egret.Bitmap(bgTex_1);
		img1.width = LayerManager.Ins.stageWidth;
		LayerManager.getSubLayerAt(
			LayerManager.Ins.gameLayer,
			BattleSLEnum.bgLayer
		).addChild(img1);

		let bgTex_2: egret.Texture = RES.getRes("bg_json.-1_png");
		let img2: egret.Bitmap = new egret.Bitmap(bgTex_2);
		img2.width = LayerManager.Ins.stageWidth;
		LayerManager.getSubLayerAt(
			LayerManager.Ins.gameLayer,
			BattleSLEnum.bgLayer
		).addChild(img2);

		let bgTex_3: egret.Texture = RES.getRes("bg_json.0_png");
		let img3: egret.Bitmap = new egret.Bitmap(bgTex_3);
		img3.width = LayerManager.Ins.stageWidth;
		img3.height = LayerManager.Ins.stageHeight;
		LayerManager.getSubLayerAt(
			LayerManager.Ins.gameLayer,
			BattleSLEnum.bgLayer
		).addChild(img3);

		// 前景
		let bgTex_4: egret.Texture = RES.getRes("bg_json.1_png");
		let img4: egret.Bitmap = new egret.Bitmap(bgTex_4);
		img4.width = LayerManager.Ins.stageWidth;
		img4.y = LayerManager.Ins.stageHeight - img4.height;
		img4.alpha = 0.5;
		LayerManager.getSubLayerAt(
			LayerManager.Ins.gameLayer,
			BattleSLEnum.fgLayer
		).addChild(img4);

		// 加火
		this.playerFireBoard = new FireBoard();
		LayerManager.getSubLayerAt(
			LayerManager.Ins.gameLayer,
			BattleSLEnum.cardLayer
		).addChild(this.playerFireBoard);

		this.playerFireBoard.addFire();
		this.playerFireBoard.addFire();
		this.playerFireBoard.addFire();
		this.playerFireBoard.addFire();
		this.playerFireBoard.addFire();
		this.playerFireBoard.addFire();


		// TODO 初始化游戏角色及UI

		let chars: Charactor[] = [];
		for (let i in [0, 1, 2, 3, 4, 5]) {
			let char1 = new Charactor("Dragon", this.dbManager);
			chars[i] = char1;
			char1.armatureDisplay.animation.play("idle", 0);
			char1.camp = CharCamp.enemy;
		}
		chars[0].row = CharRowType.backRow;
		chars[0].position = CharPositionType.down;
		chars[0].setPosition();
		this.selectEnemy = chars[0];
		chars[0].bgLayer.addChild(this.bcr.enemySlectImg);


		chars[1].row = CharRowType.backRow;
		chars[1].position = CharPositionType.up;
		chars[1].setPosition();

		chars[2].row = CharRowType.midRow;
		chars[2].position = CharPositionType.up;
		chars[2].setPosition();

		chars[3].row = CharRowType.midRow;
		chars[3].position = CharPositionType.down;
		chars[3].setPosition();

		chars[4].row = CharRowType.frontRow;
		chars[4].position = CharPositionType.down;
		chars[4].setPosition();

		chars[5].row = CharRowType.frontRow;
		chars[5].position = CharPositionType.up;
		chars[5].setPosition();

		for (let char of chars) {
			let charLayer = LayerManager.getSubLayerAt(
				LayerManager.Ins.gameLayer,
				BattleSLEnum.CharLayer
			);
			charLayer.addChildAt(char, char.position * 1000);
			this.enemies.push(char);
		}

		chars = [];
		for (let i in [0, 1, 2, 3, 4, 5]) {
			let char1 = new Charactor("Swordsman", this.dbManager);
			chars[i] = char1;
			char1.armatureDisplay.animation.play("idle", 0);
		}
		chars[0].row = CharRowType.backRow;
		chars[0].position = CharPositionType.down;
		chars[0].setPosition();
		this.selectFriend = chars[0];
		chars[0].bgLayer.addChild(this.bcr.selfSelectImg);


		chars[1].row = CharRowType.backRow;
		chars[1].position = CharPositionType.up;
		chars[1].setPosition();

		chars[2].row = CharRowType.midRow;
		chars[2].position = CharPositionType.up;
		chars[2].setPosition();

		chars[3].row = CharRowType.midRow;
		chars[3].position = CharPositionType.down;
		chars[3].setPosition();

		chars[4].row = CharRowType.frontRow;
		chars[4].position = CharPositionType.mid;
		chars[4].setPosition();

		for (let char of chars) {
			let charLayer = LayerManager.getSubLayerAt(
				LayerManager.Ins.gameLayer,
				BattleSLEnum.CharLayer
			);
			charLayer.addChildAt(char, char.position * 1000);
			this.friends.push(char);
		}

		LayerManager.getSubLayerAt(
			LayerManager.Ins.gameLayer,
			BattleSLEnum.CharLayer
		).addChild(this.cardBoard);

		this.cardManager.distCardNormal();
		this.cardManager.distCardNormal();
		this.cardManager.distCardNormal();
		this.cardManager.distCardNormal();



		// chars[5].row = CharRowType.frontRow;
		// chars[5].position = CharPositionType.up;
		// chars[5].setPosition();

		// TODO 填满statePool

		// TODO 设置初始State

		// TODO 初始化UI
		let ui = new UIBattleScene();
		ui.height = LayerManager.Ins.stageHeight;
		ui.width = LayerManager.Ins.stageWidth;
		LayerManager.Ins.uiLayer.addChild(ui);

		// 点击角色显示显示框
		MessageManager.Ins.addEventListener(
			MessageType.ClickChar,
			(e: Message) => {
				let char = e.messageContent as Charactor;
				if (char.camp == CharCamp.enemy) {
					char.bgLayer.addChild(
						this.bcr.enemySlectImg
					);
					this.selectEnemy = char;
				}else{
					char.bgLayer.addChild(
						this.bcr.selfSelectImg
					);
					this.selectFriend = char;
				}
			},
			this
		);

		// 点击滤镜动画
		MessageManager.Ins.addEventListener(
			MessageType.TouchBegin,
			(e: Message) => {
				let obj = e.messageContent;
				this.bcr.touchGlow.setHolderAnim(obj);
			},
			this
		);


		// 长按显示info
		let popUpInfo = new LongTouchInfo();
		popUpInfo.width = LayerManager.Ins.stageWidth;
		popUpInfo.height = LayerManager.Ins.stageHeight;

		MessageManager.Ins.addEventListener(
			MessageType.LongTouchStart,
			(e: Message) => {
				let obj = e.messageContent;
				popUpInfo.desc.text = obj.desc;
				LayerManager.Ins.popUpLayer.addChild(popUpInfo);
				if (obj instanceof Card) {

				}
			},
			this
		);

		MessageManager.Ins.addEventListener(
			MessageType.LongTouchEnd,
			(e: Message) => {
				let obj = e.messageContent;
				LayerManager.Ins.popUpLayer.removeChild(popUpInfo);
				if (obj instanceof Card) {

				}
			},
			this
		);
	}

	private readConfig(): void {

	}

	private async loadResource() {

	}

	public update() {
		super.update();
	}

	public release() {
		super.release();
		this.dbManager.release();
		this.dbManager = null;

		this.cardBoard.release();
		this.cardManager.release();
		this.cards = null;
		this.cardManager = null;
		this.cardBoard = null;


		this.bcr.release();
		this.bcr = null;

		// TODO 释放载入的美术资源
	}
}

/**
 * BattleScene 中所有的层列表
 * BattleScene Layer Names
 */
enum BattleSLEnum {
	bgLayer,
	CharLayer,
	fgLayer,
	cardLayer,
}

/**
 * BattleScene 下的所有状态
 * BattleScene scene status enum
 * 
 */
enum BattleSSEnum {
	BeforeSelect,
}
