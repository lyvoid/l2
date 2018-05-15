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
         * 用户的卡牌
         */
        _this.cards = [];
        _this.enemies = [];
        _this.friends = [];
        return _this;
    }
    BattleScene.prototype.initial = function () {
        _super.prototype.initial.call(this);
        this.dbManager = new DBManager();
        this.cardBoard = new CardBoard(this.cards);
        this.cardManager = new CardManager(this.cards, this.cardBoard);
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
        });
    };
    BattleScene.prototype.runScene = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _i, _a, charactorName, bgTex_1, img1, bgTex_2, img2, bgTex_3, img3, bgTex_4, img4, chars, i, char1, _b, chars_1, char, charLayer, i, char1, _c, chars_2, char, charLayer, ui, popUpInfo;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: 
                    // 载入通用资源
                    return [4 /*yield*/, RES.loadGroup("battlecommon")];
                    case 1:
                        // 载入通用资源
                        _d.sent();
                        console.log("战场通用资源载入完成");
                        this.bcr = new BattleCR();
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
                        // 载入背景图片资源
                        return [4 /*yield*/, RES.getResAsync("bg_json")];
                    case 8:
                        // 载入背景图片资源
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
                        // 加火
                        this.playerFireBoard = new FireBoard();
                        LayerManager.getSubLayerAt(LayerManager.Ins.gameLayer, BattleSLEnum.cardLayer).addChild(this.playerFireBoard);
                        this.playerFireBoard.addFire();
                        this.playerFireBoard.addFire();
                        this.playerFireBoard.addFire();
                        this.playerFireBoard.addFire();
                        this.playerFireBoard.addFire();
                        this.playerFireBoard.addFire();
                        chars = [];
                        for (i in [0, 1, 2, 3, 4, 5]) {
                            char1 = new Charactor("Dragon", this.dbManager);
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
                        for (_b = 0, chars_1 = chars; _b < chars_1.length; _b++) {
                            char = chars_1[_b];
                            charLayer = LayerManager.getSubLayerAt(LayerManager.Ins.gameLayer, BattleSLEnum.CharLayer);
                            charLayer.addChildAt(char, char.position * 1000);
                            this.enemies.push(char);
                        }
                        chars = [];
                        for (i in [0, 1, 2, 3, 4, 5]) {
                            char1 = new Charactor("Swordsman", this.dbManager);
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
                        for (_c = 0, chars_2 = chars; _c < chars_2.length; _c++) {
                            char = chars_2[_c];
                            charLayer = LayerManager.getSubLayerAt(LayerManager.Ins.gameLayer, BattleSLEnum.CharLayer);
                            charLayer.addChildAt(char, char.position * 1000);
                            this.friends.push(char);
                        }
                        LayerManager.getSubLayerAt(LayerManager.Ins.gameLayer, BattleSLEnum.CharLayer).addChild(this.cardBoard);
                        this.cardManager.distCardNormal();
                        this.cardManager.distCardNormal();
                        this.cardManager.distCardNormal();
                        this.cardManager.distCardNormal();
                        ui = new UIBattleScene();
                        ui.height = LayerManager.Ins.stageHeight;
                        ui.width = LayerManager.Ins.stageWidth;
                        LayerManager.Ins.uiLayer.addChild(ui);
                        // 点击角色显示显示框
                        MessageManager.Ins.addEventListener(MessageType.ClickChar, function (e) {
                            var char = e.messageContent;
                            if (char.camp == CharCamp.enemy) {
                                char.bgLayer.addChild(_this.bcr.enemySlectImg);
                                _this.selectEnemy = char;
                            }
                            else {
                                char.bgLayer.addChild(_this.bcr.selfSelectImg);
                                _this.selectFriend = char;
                            }
                        }, this);
                        // 点击滤镜动画
                        MessageManager.Ins.addEventListener(MessageType.TouchBegin, function (e) {
                            var obj = e.messageContent;
                            _this.bcr.touchGlow.setHolderAnim(obj);
                        }, this);
                        popUpInfo = new LongTouchInfo();
                        popUpInfo.width = LayerManager.Ins.stageWidth;
                        popUpInfo.height = LayerManager.Ins.stageHeight;
                        MessageManager.Ins.addEventListener(MessageType.LongTouchStart, function (e) {
                            var obj = e.messageContent;
                            popUpInfo.desc.text = obj.desc;
                            LayerManager.Ins.popUpLayer.addChild(popUpInfo);
                            if (obj instanceof Card) {
                            }
                        }, this);
                        MessageManager.Ins.addEventListener(MessageType.LongTouchEnd, function (e) {
                            var obj = e.messageContent;
                            LayerManager.Ins.popUpLayer.removeChild(popUpInfo);
                            if (obj instanceof Card) {
                            }
                        }, this);
                        return [2 /*return*/];
                }
            });
        });
    };
    BattleScene.prototype.readConfig = function () {
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
        this.cardManager.release();
        this.cards = null;
        this.cardManager = null;
        this.cardBoard = null;
        this.bcr.release();
        this.bcr = null;
        // TODO 释放载入的美术资源
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
    BattleSSEnum[BattleSSEnum["BeforeSelect"] = 0] = "BeforeSelect";
})(BattleSSEnum || (BattleSSEnum = {}));
