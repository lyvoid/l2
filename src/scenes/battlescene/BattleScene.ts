class BattleScene extends IScene {
	public mDbManager: DBManager;
	public mBuffManager: BuffManager;
	public mHurtManager: HurtManager;
	public mCardBoard: CardBoard;
	public mSelectImg: egret.Bitmap;
	public mSelectHead: egret.Bitmap;
	public mFilterManager: FilterManager;
	public mEnemies: Character[];
	public mFriends: Character[];
	public mSelectedChar: Character;
	public mPlayerFireBoard: FireBoard;
	public mCardInfoDeck: CardInfo[];
	public mManualSkillManager: ManualSkillManager;
	public mDamageFloatManager: DamageFloatManager;
	public mWinnerCamp: CharCamp;
	public mRound: number;
	public mRsLoader: ResAsyncLoadManager = new ResAsyncLoadManager();

	// ui
	public mBattleUI: UIBattleScene;
	public mBattleEndPopUpUI: BattleEndPopUp;
	public mBattleInfoPopupUI: BattleInfoPopupUI;
	// sub layer
	private _gameBgLayer: egret.DisplayObjectContainer;
	private _gameCharLayer: egret.DisplayObjectContainer;
	private _gameFgLayer: egret.DisplayObjectContainer;
	private _gameCardLayer: egret.DisplayObjectContainer;

	public initial() {
		super.initial();
		// instantiate sub-layer of gamelayer
		let gameLayer = LayerManager.Ins.gameLayer;
		let gameBgLayer = new egret.DisplayObjectContainer();
		let gameCharLayer = new egret.DisplayObjectContainer();
		let gameFgLayer = new egret.DisplayObjectContainer();
		let gameCardLayer = new egret.DisplayObjectContainer();
		gameLayer.addChild(gameBgLayer);
		gameLayer.addChild(gameCharLayer);
		gameLayer.addChild(gameFgLayer);
		gameLayer.addChild(gameCardLayer);
		this._gameBgLayer = gameBgLayer;
		this._gameCharLayer = gameCharLayer;
		this._gameFgLayer = gameFgLayer;
		this._gameCardLayer = gameCardLayer;
		// instantiate ui
		this.mBattleUI = new UIBattleScene();
		this.mBattleEndPopUpUI = new BattleEndPopUp();
		this.mBattleInfoPopupUI = new BattleInfoPopupUI();
		// instantiate select circle
		let selectTex = RES.getRes("selfSelectChar_png");
		let selectImg = new egret.Bitmap(selectTex);
		selectImg.x = -selectImg.width / 2;
		selectImg.y = -selectImg.height / 2;
		this.mSelectImg = selectImg;
		let selectHead = new egret.Bitmap(RES.getRes("selectHead_png"));
		selectHead.x = -selectHead.width / 2;
		this.mSelectHead = selectHead;
		// instantiate filter
		this.mFilterManager = new FilterManager();
		// initialize game round
		this.mRound = 1;
		// initialize game background
		let bgTex_1: egret.Texture = RES.getRes("bg_json.-2_png");
		let img1: egret.Bitmap = new egret.Bitmap(bgTex_1);
		img1.width = LayerManager.Ins.stageWidth;
		this._gameBgLayer.addChild(img1);
		let bgTex_2: egret.Texture = RES.getRes("bg_json.-1_png");
		let img2: egret.Bitmap = new egret.Bitmap(bgTex_2);
		img2.width = LayerManager.Ins.stageWidth;
		this._gameBgLayer.addChild(img2);
		let bgTex_3: egret.Texture = RES.getRes("bg_json.0_png");
		let img3: egret.Bitmap = new egret.Bitmap(bgTex_3);
		img3.width = LayerManager.Ins.stageWidth;
		img3.height = LayerManager.Ins.stageHeight;
		this._gameBgLayer.addChild(img3);
		// initialize game frontground
		let bgTex_4: egret.Texture = RES.getRes("bg_json.1_png");
		let img4: egret.Bitmap = new egret.Bitmap(bgTex_4);
		img4.width = LayerManager.Ins.stageWidth;
		img4.y = LayerManager.Ins.stageHeight - img4.height;
		img4.alpha = 0.5;
		this._gameFgLayer.addChild(img4);
		//  initialize fireboard
		this.mPlayerFireBoard = new FireBoard();
		this._gameCardLayer.addChild(this.mPlayerFireBoard);
		// initialize game content
		this.mEnemies = [];
		this.mFriends = [];
		this.mCardInfoDeck = [];
		this.mDbManager = new DBManager();
		this.mBuffManager = new BuffManager();
		this.mHurtManager = new HurtManager();
		this.mCardBoard = new CardBoard();
		this._gameCardLayer.addChild(this.mCardBoard);
		this.mDamageFloatManager = new DamageFloatManager();
		this.mManualSkillManager = new ManualSkillManager();
		this.mWinnerCamp = CharCamp.Neut;
		// initialize character
		// initial player team
		let teamInfo = UserData.Ins.getUserTeamInfo;
		for (let charInfo of teamInfo) {
			this.mFriends.push(CharFactory.newChar(
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
			this.mEnemies.push(CharFactory.newChar(
				enemyInfo["charId"],
				CharCamp.Enemy,
				enemyInfo["row"],
				enemyInfo["col"]
			));
		}
		// add character to character layer
		let skillConfig = ConfigManager.Ins.mSkillConfig;
		let charLayer = this._gameCharLayer;
		for (let char of this.mFriends.concat(this.mEnemies).sort(Character.sortFnByRow)) {
			charLayer.addChild(char);
			if (char.mCamp == CharCamp.Player) {
				for (let skillId of char.manualSkillsId) {
					let recycleTimes = skillConfig[skillId]["recycleTimes"];
					recycleTimes = recycleTimes == 0 ? -1 : recycleTimes;
					this.mCardInfoDeck.push({
						caster: char,
						skillId: skillId,
						recycleTimes: recycleTimes
					});
				}
			}
		}
		// add user desk card to skill mpool
		let userCards = UserData.Ins.userCards;
		for (let userCardId of UserData.Ins.userDeck) {
			let skillId = userCards[userCardId];
			let recycleTimes = skillConfig[skillId]["recycleTimes"];
			recycleTimes = recycleTimes == 0 ? -1 : recycleTimes;
			this.mCardInfoDeck.push({
				skillId: skillId,
				recycleTimes: recycleTimes
			});
		}
		this.mBattleUI.remainCardNum = this.mCardInfoDeck.length;
		// select a default Enemy
		this.mEnemies[0].onSelect();
		// initialize scene state
		this.setState(new PlayerRoundStartPhase(), 0);
	}

	public async loadResource() {
		let rsLoader = this.mRsLoader;
		let awaits = [];
		awaits.push(rsLoader.loadGroup("battlecommon", 0, LayerManager.Ins.loadingUI));

		// 载入龙骨资源
		let charCodes = new MySet<string>();
		let charConfig = ConfigManager.Ins.mCharConfig;
		for (let info of UserData.Ins.getUserTeamInfo) {
			charCodes.add(charConfig[info.charId]["charCode"]);
		}
		let battleInfo = ConfigManager.Ins.mBattleConfig[UserData.Ins.battleId];
		let enemiesInfo = ConfigManager.Ins.mBattleEnemyConfig;
		let enemiesId = battleInfo["enemy"];
		for (let i of enemiesId) {
			charCodes.add(charConfig[i]["charCode"]);
		}
		for (let charactorName of charCodes.data) {
			awaits.push(rsLoader.getResAsync(`${charactorName}_ske_json`));
			awaits.push(rsLoader.getResAsync(`${charactorName}_tex_json`));
			awaits.push(rsLoader.getResAsync(`${charactorName}_tex_png`));
		}
		// 载入game层背景图片资源
		awaits.push(rsLoader.getResAsync("bg_json"));
		for (let wait of awaits) {
			await wait;
		}
	}

	public releaseResource() {
		let rsLoader = this.mRsLoader;
		rsLoader.releaseResource();
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
			UserData.Ins.battleId += 1;
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
		if (this.mWinnerCamp == CharCamp.Player) {
			this.mBattleEndPopUpUI.winUIAdjust();
		} else {
			this.mBattleEndPopUpUI.lostUIAdjust();
		}
		LayerManager.Ins.popUpLayer.addChild(this.mBattleEndPopUpUI);
	}

	// 用来锁住，一次只能有一个skill在cast，保证cast顺序正确
	private _castQueue: { cast: () => void }[] = [];
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

	public update() {
		super.update();
	}

	public release() {
		super.release();
		
		this.mDbManager.release();
		this.mDbManager = null;

		this.mCardBoard.release();
		this.mCardBoard = null;

		this.mDamageFloatManager.release();
		this.mDamageFloatManager = null;

		this.mPlayerFireBoard.release();
		this.mPlayerFireBoard = null;

		this.mSelectImg = null;
		this.mSelectedChar = null;
		this.mFilterManager.release();
		this.mFilterManager = null;

		this._castQueue = null;

		// release ui
		this.mBattleUI.release();
		this.mBattleInfoPopupUI.release();
		this.mBattleEndPopUpUI.release();
		this.mBattleInfoPopupUI = null;
		this.mBattleUI = null;
		this.mBattleEndPopUpUI = null;

		for (let char of this.mEnemies.concat(this.mFriends)) {
			char.release();
		}
		this.mFriends = null;
		this.mEnemies = null;

		this.mBuffManager.release();
		this.mBuffManager = null;

		this.mHurtManager.release();
		this.mHurtManager = null;

		this.mCardInfoDeck = null;

		this.mManualSkillManager.release();
		this.mManualSkillManager = null;

		this._gameBgLayer = null;
		this._gameCardLayer = null;
		this._gameCharLayer = null;
		this._gameFgLayer = null;
	}

	public setState(state: ISceneState, delay = 1000): void {
		// add a delay in default setState
		if ((SceneManager.Ins.curScene as BattleScene).mWinnerCamp == CharCamp.Neut) {
			egret.setTimeout(super.setState, this, delay, state);
		}
	}

}