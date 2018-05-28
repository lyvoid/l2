var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var BattleScene = (function (_super) {
    __extends(BattleScene, _super);
    function BattleScene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * 是否正在演出skill的演出内容
         */
        _this.isPerforming = false;
        return _this;
    }
    BattleScene.prototype.initial = function () {
        var _this = this;
        _super.prototype.initial.call(this);
        // 实例化GameLayer的层
        var gameLayer = LayerManager.Ins.gameLayer;
        gameLayer.addChildAt(new egret.DisplayObjectContainer(), BattleSLEnum.bgLayer);
        gameLayer.addChildAt(new egret.DisplayObjectContainer(), BattleSLEnum.CharLayer);
        gameLayer.addChildAt(new egret.DisplayObjectContainer(), BattleSLEnum.fgLayer);
        gameLayer.addChildAt(new egret.DisplayObjectContainer(), BattleSLEnum.cardLayer);
        this.runScene().catch(function (e) {
            console.log(e);
        }).then(function () {
            console.log("battlescene场景初始化完成");
            SceneManager.Ins.onSceneLoadingCompelete();
            _this.setState(BattleSSEnum.PlayerRoundStartPhase);
        });
    };
    BattleScene.prototype.runScene = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ui, battleEndPopUp, charInfoPopupUI, popUpInfo, selfSelectTex, enemySelectTex, selfSelectImg, enemySlectImg, _i, _a, charactorName, bgTex_1, img1, bgTex_2, img2, bgTex_3, img3, bgTex_4, img4, chars, i, char1, _b, chars_1, char, charLayer, i, char1, _c, chars_2, char, charLayer, buff;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: 
                    // 载入通用资源
                    return [4 /*yield*/, RES.loadGroup("battlecommon", 0, LayerManager.Ins.loadingLayer)];
                    case 1:
                        // 载入通用资源
                        _d.sent();
                        console.log("战场通用资源载入完成");
                        ui = new UIBattleScene();
                        ui.height = LayerManager.Ins.stageHeight;
                        ui.width = LayerManager.Ins.stageWidth;
                        LayerManager.Ins.uiLayer.addChild(ui);
                        this.battleUI = ui;
                        battleEndPopUp = new BattleEndPopUp();
                        battleEndPopUp.height = LayerManager.Ins.stageHeight;
                        battleEndPopUp.width = LayerManager.Ins.stageWidth;
                        this.battleEndPopUp = battleEndPopUp;
                        charInfoPopupUI = new CharacterInfoPopupUI();
                        charInfoPopupUI.width = LayerManager.Ins.stageWidth;
                        charInfoPopupUI.height = LayerManager.Ins.stageHeight;
                        this.charInfoPopupUI = charInfoPopupUI;
                        popUpInfo = new CardInfoPopupUI();
                        popUpInfo.width = LayerManager.Ins.stageWidth;
                        popUpInfo.height = LayerManager.Ins.stageHeight;
                        this.cardInfoPopupUI = popUpInfo;
                        selfSelectTex = RES.getRes("selfSelectChar_png");
                        enemySelectTex = RES.getRes("enemySelectChar_png");
                        selfSelectImg = new egret.Bitmap(selfSelectTex);
                        selfSelectImg.x = -selfSelectImg.width / 2;
                        selfSelectImg.y = -selfSelectImg.height / 2;
                        enemySlectImg = new egret.Bitmap(enemySelectTex);
                        enemySlectImg.x = selfSelectImg.x;
                        enemySlectImg.y = selfSelectImg.y;
                        this.selfSelectImg = selfSelectImg;
                        this.enemySlectImg = enemySlectImg;
                        this.filterManager = new FilterManager();
                        _i = 0, _a = ["Dragon", "Swordsman"];
                        _d.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        charactorName = _a[_i];
                        return [4 /*yield*/, RES.getResAsync(charactorName + "_db_ske_json")];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, RES.getResAsync(charactorName + "_db_tex_json")];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, RES.getResAsync(charactorName + "_db_tex_png")];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7:
                        console.log("角色龙骨资源载入完成");
                        // 载入game层背景图片资源
                        return [4 /*yield*/, RES.getResAsync("bg_json")];
                    case 8:
                        // 载入game层背景图片资源
                        _d.sent();
                        console.log("战斗背景图片载入完成");
                        bgTex_1 = RES.getRes("bg_json.-2_png");
                        img1 = new egret.Bitmap(bgTex_1);
                        img1.width = LayerManager.Ins.stageWidth;
                        LayerManager.getSubLayerAt(LayerManager.Ins.gameLayer, BattleSLEnum.bgLayer).addChild(img1);
                        bgTex_2 = RES.getRes("bg_json.-1_png");
                        img2 = new egret.Bitmap(bgTex_2);
                        img2.width = LayerManager.Ins.stageWidth;
                        LayerManager.getSubLayerAt(LayerManager.Ins.gameLayer, BattleSLEnum.bgLayer).addChild(img2);
                        bgTex_3 = RES.getRes("bg_json.0_png");
                        img3 = new egret.Bitmap(bgTex_3);
                        img3.width = LayerManager.Ins.stageWidth;
                        img3.height = LayerManager.Ins.stageHeight;
                        LayerManager.getSubLayerAt(LayerManager.Ins.gameLayer, BattleSLEnum.bgLayer).addChild(img3);
                        bgTex_4 = RES.getRes("bg_json.1_png");
                        img4 = new egret.Bitmap(bgTex_4);
                        img4.width = LayerManager.Ins.stageWidth;
                        img4.y = LayerManager.Ins.stageHeight - img4.height;
                        img4.alpha = 0.5;
                        LayerManager.getSubLayerAt(LayerManager.Ins.gameLayer, BattleSLEnum.fgLayer).addChild(img4);
                        //  初始化能量槽
                        this.playerFireBoard = new FireBoard();
                        LayerManager.getSubLayerAt(LayerManager.Ins.gameLayer, BattleSLEnum.cardLayer).addChild(this.playerFireBoard);
                        this.playerFireBoard.addFires(2);
                        // 初始化game层的内容
                        this.enemies = [];
                        this.friends = [];
                        this.skillManualPool = [];
                        this.dbManager = new DBManager();
                        this.cardBoard = new CardBoard();
                        this.performQue = new Queue();
                        this.castQue = new Queue();
                        this.damageFloatManager = new DamageFloatManager();
                        this.phaseUtil = new PhaseUtil();
                        chars = [];
                        for (i in [0, 1, 2, 3, 4]) {
                            char1 = new Character("Dragon");
                            chars[i] = char1;
                            char1.playDBAnim("idle", 0);
                            char1.camp = CharCamp.Enemy;
                        }
                        chars[0].col = CharColType.backRow;
                        chars[0].row = CharRowType.down;
                        chars[0].setPosition();
                        this.setSelectTarget(chars[0]);
                        chars[0].bgLayer.addChild(this.enemySlectImg);
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
                        for (_b = 0, chars_1 = chars; _b < chars_1.length; _b++) {
                            char = chars_1[_b];
                            charLayer = LayerManager.getSubLayerAt(LayerManager.Ins.gameLayer, BattleSLEnum.CharLayer);
                            charLayer.addChildAt(char, char.row * 1000);
                            this.enemies.push(char);
                        }
                        chars = [];
                        for (i in [0, 1, 2, 3, 4]) {
                            char1 = new Character("Swordsman");
                            chars[i] = char1;
                            char1.playDBAnim("idle", 0);
                        }
                        chars[0].col = CharColType.backRow;
                        chars[0].row = CharRowType.down;
                        chars[0].setPosition();
                        this.setSelectTarget(chars[0]);
                        chars[0].bgLayer.addChild(this.selfSelectImg);
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
                        for (_c = 0, chars_2 = chars; _c < chars_2.length; _c++) {
                            char = chars_2[_c];
                            charLayer = LayerManager.getSubLayerAt(LayerManager.Ins.gameLayer, BattleSLEnum.CharLayer);
                            buff = new Buff();
                            buff.id = 12345;
                            buff.layId = 12345;
                            buff.maxLayer = 2;
                            buff.attachToChar(char);
                            buff.attachToChar(char);
                            buff = new Buff();
                            buff.id = 12344;
                            buff.layId = 12344;
                            buff.attachToChar(char);
                            charLayer.addChildAt(char, char.row * 1000);
                            this.friends.push(char);
                            // TODO: 填充技能池子
                            this.skillManualPool = this.skillManualPool.concat(char.manualSkills);
                        }
                        // 发放游戏开始的卡牌
                        LayerManager.getSubLayerAt(LayerManager.Ins.gameLayer, BattleSLEnum.CharLayer).addChild(this.cardBoard);
                        // 初始2张卡牌
                        this.cardBoard.distCardNormal();
                        this.cardBoard.distCardNormal();
                        // 初始化场景中的StatePool
                        this.statePool[BattleSSEnum.EnemyRoundEndPhase] = new EnemyRoundEndPhase(this);
                        this.statePool[BattleSSEnum.EnemyRoundStartPhase] = new EnemyRoundStartPhase(this);
                        this.statePool[BattleSSEnum.EnemyUseCardPhase] = new EnemyUseCardPhase(this);
                        this.statePool[BattleSSEnum.PlayerRoundEndPhase] = new PlayerRoundEndPhase(this);
                        this.statePool[BattleSSEnum.PlayerRoundStartPhase] = new PlayerRoundStartPhase(this);
                        this.statePool[BattleSSEnum.PlayerUseCardPhase] = new PlayerUseCardPhase(this);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 判断胜负，并吧胜负信息存储在this.winnerCamp中
     */
    BattleScene.prototype.judge = function () {
        var isEnemyAlive = false;
        var isPlayerAlive = false;
        for (var _i = 0, _a = this.enemies; _i < _a.length; _i++) {
            var char = _a[_i];
            if (char.alive && char.isInBattle) {
                isEnemyAlive = true;
                break;
            }
        }
        for (var _b = 0, _c = this.friends; _b < _c.length; _b++) {
            var char = _c[_b];
            if (char.alive && char.isInBattle) {
                isPlayerAlive = true;
                break;
            }
        }
        if (!isEnemyAlive) {
            this.winnerCamp = CharCamp.Player;
        }
        else if (!isPlayerAlive) {
            this.winnerCamp = CharCamp.Enemy;
        }
    };
    BattleScene.prototype.startTodoSkill = function () {
        if (this.castQue.length > 0) {
            this.castQue.pop().cast();
        }
    };
    /**
     * 一个技能演出结束的时候自行调用
     * 从perfrom队列中获取下一个开始演出
     * 如果演出已经结束了，会判定一下胜负，如果胜负已分调用相关的处理
     * 如果胜负未分发送演出全部结束消息
     */
    BattleScene.prototype.onePerformEnd = function () {
        this.isPerforming = false;
        if (this.performQue.length == 0) {
            // 如果演出结束同时游戏结束时，播放游戏结束演出
            if (this.winnerCamp) {
                this.onBattleEnd();
            }
            else {
                // 如果游戏没有结束，发送演出全部结束消息
                MessageManager.Ins.sendMessage(MessageType.PerformAllEnd);
            }
            return;
        }
        this.performStart();
    };
    /**
     * 战斗结束
     */
    BattleScene.prototype.onBattleEnd = function () {
        var lm = LayerManager.Ins;
        lm.maskLayer.addChild(lm.maskBg);
        if (this.winnerCamp == CharCamp.Player) {
            this.battleEndPopUp.winUIAdjust();
        }
        else {
            this.battleEndPopUp.lostUIAdjust();
        }
        LayerManager.Ins.popUpLayer.addChild(this.battleEndPopUp);
    };
    /**
     * 开始技能演出，收到开始演出消息时开始从列表中获取演出事项一个个演出
     * 如果当前正在演出会直接返回，防止两件事同时被演出
     */
    BattleScene.prototype.performStart = function () {
        if (this.isPerforming) {
            // 如果正在演出，那就不管这个消息
            return;
        }
        this.isPerforming = true;
        var performanceObj;
        var affectResult;
        _a = this.performQue.pop(), performanceObj = _a[0], affectResult = _a[1];
        performanceObj.performance(affectResult);
        var _a;
    };
    BattleScene.prototype.readConfig = function () {
    };
    /**
     * 设置选中对象
     */
    BattleScene.prototype.setSelectTarget = function (value) {
        if (value.camp === CharCamp.Enemy) {
            value.bgLayer.addChild(this.enemySlectImg);
            this.selectedEnemy = value;
        }
        else {
            value.bgLayer.addChild(this.selfSelectImg);
            this.selectedFriend = value;
        }
    };
    BattleScene.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    BattleScene.prototype.update = function () {
        _super.prototype.update.call(this);
    };
    BattleScene.prototype.release = function () {
        _super.prototype.release.call(this);
        this.dbManager.release();
        this.dbManager = null;
        this.cardBoard.release();
        this.cardBoard = null;
        this.battleUI = null;
        this.battleEndPopUp = null;
        this.damageFloatManager.release();
        this.damageFloatManager = null;
        this.playerFireBoard.release();
        this.playerFireBoard = null;
        this.phaseUtil.clear();
        this.phaseUtil = null;
        LongTouchUtil.clear();
        this.selfSelectImg = null;
        this.enemySlectImg = null;
        this.filterManager.release();
        this.filterManager = null;
        // 释放载入的美术资源
        this.releaseResource().then(function () {
            SceneManager.Ins.onSceneReleaseCompelete();
        });
    };
    BattleScene.prototype.releaseResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, charactorName;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, RES.destroyRes("battlecommon")];
                    case 1:
                        _b.sent();
                        _i = 0, _a = ["Dragon", "Swordsman"];
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        charactorName = _a[_i];
                        return [4 /*yield*/, RES.destroyRes(charactorName + "_db_ske_json")];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, RES.destroyRes(charactorName + "_db_tex_json")];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, RES.destroyRes(charactorName + "_db_tex_png")];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [4 /*yield*/, RES.destroyRes("bg_json")];
                    case 8:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return BattleScene;
}(IScene));
__reflect(BattleScene.prototype, "BattleScene");
/**
 * BattleScene 中所有的层列表
 * BattleScene Layer Names
 */
var BattleSLEnum;
(function (BattleSLEnum) {
    BattleSLEnum[BattleSLEnum["bgLayer"] = 0] = "bgLayer";
    BattleSLEnum[BattleSLEnum["CharLayer"] = 1] = "CharLayer";
    BattleSLEnum[BattleSLEnum["fgLayer"] = 2] = "fgLayer";
    BattleSLEnum[BattleSLEnum["cardLayer"] = 3] = "cardLayer";
})(BattleSLEnum || (BattleSLEnum = {}));
/**
 * BattleScene 下的所有状态
 * BattleScene scene status enum
 *
 */
var BattleSSEnum;
(function (BattleSSEnum) {
    BattleSSEnum[BattleSSEnum["PlayerRoundStartPhase"] = 0] = "PlayerRoundStartPhase";
    BattleSSEnum[BattleSSEnum["PlayerRoundEndPhase"] = 1] = "PlayerRoundEndPhase";
    BattleSSEnum[BattleSSEnum["PlayerUseCardPhase"] = 2] = "PlayerUseCardPhase";
    BattleSSEnum[BattleSSEnum["EnemyRoundStartPhase"] = 3] = "EnemyRoundStartPhase";
    BattleSSEnum[BattleSSEnum["EnemyRoundEndPhase"] = 4] = "EnemyRoundEndPhase";
    BattleSSEnum[BattleSSEnum["EnemyUseCardPhase"] = 5] = "EnemyUseCardPhase";
})(BattleSSEnum || (BattleSSEnum = {}));
