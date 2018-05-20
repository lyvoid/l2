class BattleScene extends IScene {

	/**
	 * 龙骨管理器
	 */
	public dbManager: DBManager;

	/**
	 * 用户的卡牌
	 */
	public cardBoard: CardBoard;
	public bcr: BattleCR; // 通用资源

	public enemies: Character[];
	public friends: Character[];
	public selectedEnemy: Character;
	public selectedFriend: Character;

	/**
	 * 玩家能量板
	 */
	public playerFireBoard: FireBoard;

	/**
	 * 手动技能池（玩家的卡牌池子）
	 */
	public skillManualPool: IManualSkill[];

	// UI
	public battleUI: UIBattleScene;
	public battleEndPopUp: BattleEndPopUp;
	public popUpInfoWin: LongTouchInfo;

	/**
	 * 演出列表
	 */ 
	public performQue: Queue<[IManualSkill, any]>;
	/**
	 * 待释放技能
	 */
	public skillTodoQue: Queue<IManualSkill>;

	/**
	 * 飘字管理器
	 */
	public damageFloatManager: DamageFloatManager;

	/**
	 * 获胜阵营
	 */
	public winnerCamp: CharCamp;

	public initial() {
		super.initial();
		this.enemies = [];
		this.friends = [];
		this.skillManualPool = [];
		this.dbManager = new DBManager();
		this.cardBoard = new CardBoard();
		this.performQue = new Queue<[IManualSkill, any]>();
		this.skillTodoQue = new Queue<IManualSkill>();
		this.damageFloatManager = new DamageFloatManager();

		let popUpInfo = new LongTouchInfo();
		popUpInfo.width = LayerManager.Ins.stageWidth;
		popUpInfo.height = LayerManager.Ins.stageHeight;
		this.popUpInfoWin = popUpInfo;

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
			MessageManager.Ins.sendMessage(MessageType.LoadingFinish);
			this.setState(BattleSSEnum.PlayerRoundStartPhase);
		});

	}

	private async runScene() {

		// 载入通用资源
		await RES.loadGroup("battlecommon", 0, LayerManager.Ins.loadingLayer);
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

		//  能量槽
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

		let chars: Character[] = [];
		for (let i in [0, 1, 2, 3, 4]) {
			let char1 = new Character("Dragon");
			chars[i] = char1;
			char1.armatureDisplay.animation.play("idle", 0);
			char1.camp = CharCamp.Enemy;
		}
		chars[0].col = CharColType.backRow;
		chars[0].row = CharRowType.down;
		chars[0].setPosition();
		this.selectedEnemy = chars[0];
		chars[0].bgLayer.addChild(this.bcr.enemySlectImg);


		chars[1].col = CharColType.backRow;
		chars[1].row = CharRowType.up;
		chars[1].setPosition();

		chars[2].col = CharColType.midRow;
		chars[2].row = CharRowType.up;
		chars[2].setPosition();

		chars[3].col = CharColType.midRow;
		chars[3].row = CharRowType.down;
		chars[3].setPosition();

		chars[4].col = CharColType.frontRow;
		chars[4].row = CharRowType.down;
		chars[4].setPosition();

		for (let char of chars) {
			let charLayer = LayerManager.getSubLayerAt(
				LayerManager.Ins.gameLayer,
				BattleSLEnum.CharLayer
			);
			charLayer.addChildAt(char, char.row * 1000);
			this.enemies.push(char);
		}

		chars = [];
		for (let i in [0, 1, 2, 3, 4]) {
			let char1 = new Character("Swordsman");
			chars[i] = char1;
			char1.armatureDisplay.animation.play("idle", 0);
		}
		chars[0].col = CharColType.backRow;
		chars[0].row = CharRowType.down;
		chars[0].setPosition();
		this.selectedFriend = chars[0];
		chars[0].bgLayer.addChild(this.bcr.selfSelectImg);


		chars[1].col = CharColType.backRow;
		chars[1].row = CharRowType.up;
		chars[1].setPosition();

		chars[2].col = CharColType.midRow;
		chars[2].row = CharRowType.up;
		chars[2].setPosition();

		chars[3].col = CharColType.midRow;
		chars[3].row = CharRowType.down;
		chars[3].setPosition();

		chars[4].col = CharColType.frontRow;
		chars[4].row = CharRowType.mid;
		chars[4].setPosition();

		for (let char of chars) {
			let charLayer = LayerManager.getSubLayerAt(
				LayerManager.Ins.gameLayer,
				BattleSLEnum.CharLayer
			);
			charLayer.addChildAt(char, char.row * 1000);
			this.friends.push(char);

			// 填充技能池子
			this.skillManualPool = this.skillManualPool.concat(char.manualSkills);
		}

		LayerManager.getSubLayerAt(
			LayerManager.Ins.gameLayer,
			BattleSLEnum.CharLayer
		).addChild(this.cardBoard);

		this.cardBoard.distCardNormal();
		this.cardBoard.distCardNormal();
		this.cardBoard.distCardNormal();
		this.cardBoard.distCardNormal();



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
		this.battleUI = ui;
		let battleEndPopUp = new BattleEndPopUp();
		battleEndPopUp.height = LayerManager.Ins.stageHeight;
		battleEndPopUp.width = LayerManager.Ins.stageWidth;
		this.battleEndPopUp = battleEndPopUp;

		// 点击滤镜动画
		MessageManager.Ins.addEventListener(
			MessageType.TouchBegin,
			this.onObjTouchGlowAnim,
			this
		);


		// 长按显示info;
		MessageManager.Ins.addEventListener(
			MessageType.LongTouchStart,
			this.onObjLongTouchBegin,
			this
		);
		MessageManager.Ins.addEventListener(
			MessageType.LongTouchEnd,
			this.onObjLongTouchEnd,
			this
		);

		// 一个perform演出完成时开始下一个演出
		MessageManager.Ins.addEventListener(
			MessageType.PerformanceEnd,
			this.onPerformEnd,
			this
		);

		// 开始演出
		MessageManager.Ins.addEventListener(
			MessageType.PerformanceChainStart,
			this.onPerformChainStart,
			this
		);

		// 初始化场景中的状态
		this.statePool[BattleSSEnum.EnemyRoundEndPhase] = new EnemyRoundEndPhase(this);
		this.statePool[BattleSSEnum.EnemyRoundStartPhase] = new EnemyRoundStartPhase(this);
		this.statePool[BattleSSEnum.EnemyUseCardPhase] = new EnemyUseCardPhase(this);
		this.statePool[BattleSSEnum.PlayerRoundEndPhase] = new PlayerRoundEndPhase(this);
		this.statePool[BattleSSEnum.PlayerRoundStartPhase] = new PlayerRoundStartPhase(this);
		this.statePool[BattleSSEnum.PlayerUseCardPhase] = new PlayerUseCardPhase(this);

	}

	/**
	 * 判断胜负，并吧胜负信息存储在this.winnerCamp中
	 */
	public judge(){
		let isEnemyAlive: boolean=false;
		let isPlayerAlive: boolean=false;
		for (let char of this.enemies){
			if (char.alive && char.attr.isInBattle){
				isEnemyAlive = true;
				break;
			}
		}
		for (let char of this.friends){
			if (char.alive && char.attr.isInBattle){
				isPlayerAlive = true;
				break;
			}
		}

		if (!isEnemyAlive){
			this.winnerCamp = CharCamp.Player;
		}else if (!isPlayerAlive){
			this.winnerCamp = CharCamp.Enemy;
		}
	}

	/**
	 * 点击开始时候的滤镜动画效果
	 */
	private onObjTouchGlowAnim(e: Message): void {
		let obj = e.messageContent;
		this.bcr.touchGlow.setHolderAnim(obj);
	}

	/**
	 * 长按开始时候弹出info界面加入到popuplayer中
	 * 如果是长按的card还会对其释放者的龙骨动画加入闪烁提示
	 * 同时调用skill的manulachoosetarget得到主要目标
	 * 然后让主要目标的血条开始闪烁
	 */
	private onObjLongTouchBegin(e: Message): void {
		let obj = e.messageContent;
		this.popUpInfoWin.desc.text = obj.desc;
		LayerManager.Ins.popUpLayer.addChild(this.popUpInfoWin);
		if (obj instanceof Card) {
			let card = (obj as Card);
			// 释放者闪烁
			let caster = card.skill.caster;
			if (caster) {
				caster.armatureBlink();
			}

			card.skill.manualChooseTarget();
			// 隐藏目标以外的血条
			for(let char of this.enemies.concat(this.friends)){
				if(card.skill.targets.indexOf(char) < 0){
					char.lifeBarHide();
				}
			}

			// 目标血条闪烁
			card.skill.manualChooseTarget();
			for (let target of card.skill.targets) {
				target.lifeBarBlink();
			}
		}
	}

	/**
	 * 长按停止时的效果
	 * 关闭info界面
	 * 同时关闭所有闪烁动画以及重新展示此前隐藏的内容
	 */
	private onObjLongTouchEnd(e: Message): void {
		let obj = e.messageContent;
		try{
			// 这里有可能还没触发长按时移开手指触发，此时并不存在弹出的窗口
			LayerManager.Ins.popUpLayer.removeChild(this.popUpInfoWin);
		}catch(ignore){}
		if (obj instanceof Card) {
			let card = obj as Card;
			let caster = card.skill.caster
			if (caster) {
				caster.armatureUnBlink();
			}

			for(let char of this.enemies.concat(this.friends)){
				char.lifeBarShow();
			}

			card.skill.caster.armatureDisplay.alpha = 1;
			for (let target of card.skill.targets) {
				target.lifeBarUnBlink();
			}
		}
	}

	/**
	 * 是否正在演出skill的演出内容
	 */
	public isSkillPerforming: boolean = false;
	
	/**
	 * 当收到一个skill的演出结束消息时候调用
	 * 从perfrom队列中获取下一个开始演出
	 * 如果演出已经结束了，会判定一下胜负，如果胜负已分调用相关的处理
	 * 如果胜负未分发送演出全部结束消息
	 */
	private onPerformEnd(): void{
		if (this.performQue.length == 0){
			// 如果演出列表已经空了，就把正在演出状态置为false，同时退出演出
			this.isSkillPerforming = false;
			// 如果演出结束同时游戏结束时，播放游戏结束演出
			if (this.winnerCamp){
				this.onBattleEnd();
			}else{
				MessageManager.Ins.sendMessage(MessageType.SkillPerformAllEnd);
			}
			return;
		}
		let skill: IManualSkill;
		let affectResult:any;
		[skill, affectResult] = this.performQue.pop();
		skill.performance(affectResult);
	}

	/**
	 * 战斗结束
	 */
	private onBattleEnd(): void{
		LayerManager.Ins.maskLayer.visible = true;
		if (this.winnerCamp == CharCamp.Player){
			this.battleEndPopUp.winUIAdjust();
		}else{
			this.battleEndPopUp.lostUIAdjust();
		}
		LayerManager.Ins.popUpLayer.addChild(this.battleEndPopUp);
	}

	/**
	 * 开始技能演出，收到开始演出消息时开始从列表中获取演出事项一个个演出
	 * 如果当前正在演出会直接返回，防止两件事同时被演出
	 */
	private onPerformChainStart(): void{
		if(this.isSkillPerforming){
			// 如果正在演出，那就不管这个消息
			return;
		}
		this.isSkillPerforming = true;
		let skill: IManualSkill;
		let affectResult:any;
		[skill, affectResult] = this.performQue.pop();
		skill.performance(affectResult);
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
		MessageManager.Ins.removeEventListener(
			MessageType.LongTouchStart,
			this.onObjLongTouchBegin,
			this
		);
		MessageManager.Ins.removeEventListener(
			MessageType.PerformanceChainStart,
			this.onPerformChainStart,
			this
		)
		MessageManager.Ins.removeEventListener(
			MessageType.LongTouchEnd,
			this.onObjLongTouchEnd,
			this
		)
		MessageManager.Ins.removeEventListener(
			MessageType.TouchBegin,
			this.onObjTouchGlowAnim,
			this
		);
		MessageManager.Ins.removeEventListener(
			MessageType.PerformanceEnd,
			this.onPerformEnd,
			this
		);

		this.dbManager.release();
		this.dbManager = null;

		this.cardBoard.release();
		this.cardBoard = null;

		this.bcr.release();
		this.bcr = null;

		this.battleUI = null;
		this.battleEndPopUp = null;

		this.damageFloatManager.release();
		this.damageFloatManager = null;
		
		this.playerFireBoard.release();
		this.playerFireBoard = null;

		// 释放载入的美术资源
		this.releaseResource().then(()=>{
			MessageManager.Ins.sendMessage(MessageType.SceneReleaseCompelete);
		});
	}

	private async releaseResource(){
		await RES.destroyRes("battlecommon");
		for (let charactorName of ["Dragon", "Swordsman"]) {
			await RES.destroyRes(`${charactorName}_db_ske_json`);
			await RES.destroyRes(`${charactorName}_db_tex_json`);
			await RES.destroyRes(`${charactorName}_db_tex_png`);
		}
		await RES.destroyRes("bg_json");
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
	PlayerRoundStartPhase,
	PlayerRoundEndPhase,
	PlayerUseCardPhase,
	EnemyRoundStartPhase,
	EnemyRoundEndPhase,
	EnemyUseCardPhase
}
