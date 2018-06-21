class BattleScene extends IScene {
	public mDbManager: DBManager;
	public mBuffManager: BuffManager;
	public mHurtManager: HurtManager;
	public mCardBoard: CardBoard;
	public mSelectImg: egret.Bitmap;
	public mFilterManager: FilterManager;
	public mEnemies: Character[];
	public mFriends: Character[];
	public mSelectedChar: Character;
	public mPlayerFireBoard: FireBoard;
	public mManualSkillIdPool: [number, Character][];
	public mManualSkillManager: ManualSkillManager;
	public mTargetSelectManager: TargetSelectManager;
	public _charFactory: CharFactory;
	public mRound: number;

	// ui
	public mBattleUI: UIBattleScene;
	public mBattleEndPopUp: BattleEndPopUp;
	public mCardInfoPopupUI: CardInfoPopupUI;
	public mCharInfoPopupUI: CharacterInfoPopupUI;
	private _castQueue: { cast: () => void }[];

	public mDamageFloatManager: DamageFloatManager;
	public mWinnerCamp: CharCamp;
	public mPhaseUtil: PhaseUtil;

	public initial() {
		super.initial();

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
			SceneManager.Ins.onSceneLoadingCompelete();
			this.setState(BattleSSEnum.PlayerRoundStartPhase);
		});

	}

	private async runScene() {

		// 载入通用资源
		await RES.loadGroup("battlecommon", 0, LayerManager.Ins.loadingLayer);
		console.log("战场通用资源载入完成");

		// 初始化UI
		let ui = new UIBattleScene();
		ui.height = LayerManager.Ins.stageHeight;
		ui.width = LayerManager.Ins.stageWidth;
		LayerManager.Ins.uiLayer.addChild(ui);
		this.mBattleUI = ui;
		let battleEndPopUp = new BattleEndPopUp();
		battleEndPopUp.height = LayerManager.Ins.stageHeight;
		battleEndPopUp.width = LayerManager.Ins.stageWidth;
		this.mBattleEndPopUp = battleEndPopUp;

		let charInfoPopupUI = new CharacterInfoPopupUI();
		charInfoPopupUI.width = LayerManager.Ins.stageWidth;
		charInfoPopupUI.height = LayerManager.Ins.stageHeight;
		this.mCharInfoPopupUI = charInfoPopupUI;

		let popUpInfo = new CardInfoPopupUI();
		popUpInfo.width = LayerManager.Ins.stageWidth;
		popUpInfo.height = LayerManager.Ins.stageHeight;
		this.mCardInfoPopupUI = popUpInfo;

		// 选择圈及滤镜初始化
		let selectTex = RES.getRes("selfSelectChar_png");
		let selectImg = new egret.Bitmap(selectTex);
		selectImg.x = -selectImg.width / 2;
		selectImg.y = -selectImg.height / 2;
		this.mSelectImg = selectImg;
		this.mFilterManager = new FilterManager();
		this.mRound = 1;

		// 载入龙骨资源
		for (let charactorName of ["Dragon", "Swordsman"]) {
			await RES.getResAsync(`${charactorName}_db_ske_json`);
			await RES.getResAsync(`${charactorName}_db_tex_json`);
			await RES.getResAsync(`${charactorName}_db_tex_png`);
		}
		console.log("角色龙骨资源载入完成");

		// 载入game层背景图片资源
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

		//  初始化能量槽
		this.mPlayerFireBoard = new FireBoard();
		LayerManager.getSubLayerAt(
			LayerManager.Ins.gameLayer,
			BattleSLEnum.cardLayer
		).addChild(this.mPlayerFireBoard);
		this.mPlayerFireBoard.addFires(2);

		// 初始化game层的内容
		this.mEnemies = [];
		this.mFriends = [];
		this.mManualSkillIdPool = [];
		this.mDbManager = new DBManager();
		this.mBuffManager = new BuffManager();
		this.mHurtManager = new HurtManager();
		this.mCardBoard = new CardBoard();
		this.mDamageFloatManager = new DamageFloatManager();
		this.mPhaseUtil = new PhaseUtil();
		this.mManualSkillManager = new ManualSkillManager();
		this.mTargetSelectManager = new TargetSelectManager();
		this._castQueue = [];
		this.mWinnerCamp = CharCamp.Neut;
		this._charFactory = new CharFactory();

		// initial char
		let charFactory = this._charFactory;
		// initial player team
		let teamInfo = UserData.Ins.curUserTeam;
		for (let charInfo of teamInfo) {
			this.mFriends.push(charFactory.newChar(
				charInfo.charId,
				CharCamp.Player,
				charInfo.row,
				charInfo.col,
			));
		}
		// initial enmey
		let battleInfo = ConfigManager.Ins.mBattleConfig[UserData.Ins.battleId];
		let enemiesInfo = ConfigManager.Ins.mBattleEnemyConfig;
		let enemiesId = battleInfo["enemy"];
		for (let id of enemiesId) {
			let enemyInfo = enemiesInfo[id];
			this.mEnemies.push(charFactory.newChar(
				enemyInfo["charId"],
				CharCamp.Enemy,
				enemyInfo["row"],
				enemyInfo["col"]
			));
		}
		// add char to char layer
		let charLayer = LayerManager.getSubLayerAt(
			LayerManager.Ins.gameLayer,
			BattleSLEnum.CharLayer
		);
		for (let char of this.mFriends.concat(this.mEnemies).sort(Character.sortFnByRow)) {
			charLayer.addChild(char);
			if (char.mCamp == CharCamp.Player) {
				for (let skillid of char.manualSkillsId) {
					this.mManualSkillIdPool.push([skillid, char]);
				}
			}
		}
		// select a default Enemy
		this.mEnemies[0].onSelect();


		// 发放游戏开始的卡牌
		LayerManager.getSubLayerAt(
			LayerManager.Ins.gameLayer,
			BattleSLEnum.CharLayer
		).addChild(this.mCardBoard);

		// 初始2张卡牌
		this.mCardBoard.distCardNormal();
		this.mCardBoard.distCardNormal();

		// 初始化场景中的StatePool
		this.statePool[BattleSSEnum.EnemyRoundEndPhase] = new EnemyRoundEndPhase();
		this.statePool[BattleSSEnum.EnemyRoundStartPhase] = new EnemyRoundStartPhase();
		this.statePool[BattleSSEnum.EnemyUseCardPhase] = new EnemyUseCardPhase();
		this.statePool[BattleSSEnum.PlayerRoundEndPhase] = new PlayerRoundEndPhase();
		this.statePool[BattleSSEnum.PlayerRoundStartPhase] = new PlayerRoundStartPhase();
		this.statePool[BattleSSEnum.PlayerUseCardPhase] = new PlayerUseCardPhase();
	}

	/**
	 * 判断胜负，并吧胜负信息存储在this.winnerCamp中
	 */
	public judge() {
		let isEnemyAlive: boolean = false;
		let isPlayerAlive: boolean = false;
		for (let char of this.mEnemies) {
			if (char.alive && char.isInBattle) {
				isEnemyAlive = true;
				break;
			}
		}
		for (let char of this.mFriends) {
			if (char.alive && char.isInBattle) {
				isPlayerAlive = true;
				break;
			}
		}

		if (!isEnemyAlive) {
			this.mWinnerCamp = CharCamp.Player;
		} else if (!isPlayerAlive) {
			this.mWinnerCamp = CharCamp.Enemy;
		}

		if (this.mWinnerCamp != CharCamp.Neut) {
			// 延迟两秒跳战斗结果，方便演出
			egret.setTimeout(
				this.onBattleEnd,
				this,
				2000
			);
		}
	}

	/**
	 * 战斗结束
	 */
	private onBattleEnd(): void {
		let lm = LayerManager.Ins
		lm.maskLayer.addChild(lm.maskBg);
		if (this.mWinnerCamp == CharCamp.Player) {
			this.mBattleEndPopUp.winUIAdjust();
		} else {
			this.mBattleEndPopUp.lostUIAdjust();
		}
		LayerManager.Ins.popUpLayer.addChild(this.mBattleEndPopUp);
	}

	// 用来锁住，一次只能有一个skill在cast，保证cast顺序正确
	private _isInCast: boolean = false;
	public addToCastQueue(input: { cast: () => void } = null): void {
		if (input) {
			this._castQueue.push(input);
		}
		if (this._isInCast) {
			return;
		}
		this._isInCast = true;
		let q = this._castQueue;
		while (q.length > 0) {
			q.shift().cast();
		}
		this._isInCast = false;
	}

	private async loadResource() {

	}

	public update() {
		super.update();
	}

	public release() {
		super.release();

		this.mDbManager.release();
		this.mDbManager = null;

		this.mCardBoard.release();
		this.mCardBoard = null;

		this.mBattleUI = null;
		this.mBattleEndPopUp = null;

		this.mDamageFloatManager.release();
		this.mDamageFloatManager = null;

		this.mPlayerFireBoard.release();
		this.mPlayerFireBoard = null;

		this.mPhaseUtil.release();
		this.mPhaseUtil = null;
		LongTouchUtil.clear();

		this.mSelectImg = null;
		this.mSelectedChar = null;
		this.mFilterManager.release();
		this.mFilterManager = null;

		// 释放载入的美术资源
		this.releaseResource().then(() => {
			SceneManager.Ins.onSceneReleaseCompelete();
		});
	}

	private async releaseResource() {
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
