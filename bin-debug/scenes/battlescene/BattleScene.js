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
        _this.isPerformance = false; // 是否正在演出
        return _this;
    }
    BattleScene.prototype.initial = function () {
        _super.prototype.initial.call(this);
        this.enemies = [];
        this.friends = [];
        this.skillManualPool = [];
        this.dbManager = new DBManager();
        this.cardBoard = new CardBoard();
        this.performQue = new Queue();
        this.skillTodoQue = new Queue();
        this.damageFloatManager = new DamageFloatManager();
        var popUpInfo = new LongTouchInfo();
        popUpInfo.width = LayerManager.Ins.stageWidth;
        popUpInfo.height = LayerManager.Ins.stageHeight;
        this.popUpInfoWin = popUpInfo;
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
            var _i, _a, charactorName, bgTex_1, img1, bgTex_2, img2, bgTex_3, img3, bgTex_4, img4, chars, i, char1, _b, chars_1, char, charLayer, i, char1, _c, chars_2, char, charLayer, ui;
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
                        //  能量槽
                        this.playerFireBoard = new FireBoard();
                        LayerManager.getSubLayerAt(LayerManager.Ins.gameLayer, BattleSLEnum.cardLayer).addChild(this.playerFireBoard);
                        this.playerFireBoard.addFire();
                        this.playerFireBoard.addFire();
                        this.playerFireBoard.addFire();
                        this.playerFireBoard.addFire();
                        this.playerFireBoard.addFire();
                        this.playerFireBoard.addFire();
                        chars = [];
                        for (i in [0, 1, 2, 3, 4]) {
                            char1 = new Character("Dragon");
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
                        for (_c = 0, chars_2 = chars; _c < chars_2.length; _c++) {
                            char = chars_2[_c];
                            charLayer = LayerManager.getSubLayerAt(LayerManager.Ins.gameLayer, BattleSLEnum.CharLayer);
                            charLayer.addChildAt(char, char.row * 1000);
                            this.friends.push(char);
                            // 填充技能池子
                            this.skillManualPool = this.skillManualPool.concat(char.manualSkills);
                        }
                        LayerManager.getSubLayerAt(LayerManager.Ins.gameLayer, BattleSLEnum.CharLayer).addChild(this.cardBoard);
                        this.cardBoard.distCardNormal();
                        this.cardBoard.distCardNormal();
                        this.cardBoard.distCardNormal();
                        this.cardBoard.distCardNormal();
                        ui = new UIBattleScene();
                        ui.height = LayerManager.Ins.stageHeight;
                        ui.width = LayerManager.Ins.stageWidth;
                        LayerManager.Ins.uiLayer.addChild(ui);
                        // 点击滤镜动画
                        MessageManager.Ins.addEventListener(MessageType.TouchBegin, this.onObjTouchGlowAnim, this);
                        // 长按显示info;
                        MessageManager.Ins.addEventListener(MessageType.LongTouchStart, this.onObjLongTouchBegin, this);
                        MessageManager.Ins.addEventListener(MessageType.LongTouchEnd, this.onObjLongTouchEnd, this);
                        // 一个perform演出完成时开始下一个演出
                        MessageManager.Ins.addEventListener(MessageType.PerformanceEnd, this.onPerformEnd, this);
                        // 开始演出
                        MessageManager.Ins.addEventListener(MessageType.PerformanceChainStart, this.onPerformChainStart, this);
                        return [2 /*return*/];
                }
            });
        });
    };
    BattleScene.prototype.onObjTouchGlowAnim = function (e) {
        var obj = e.messageContent;
        this.bcr.touchGlow.setHolderAnim(obj);
    };
    BattleScene.prototype.onObjLongTouchBegin = function (e) {
        var obj = e.messageContent;
        this.popUpInfoWin.desc.text = obj.desc;
        LayerManager.Ins.popUpLayer.addChild(this.popUpInfoWin);
        if (obj instanceof Card) {
            var card = obj;
            // 释放者闪烁
            var caster = card.skill.caster;
            if (caster) {
                caster.armatureBlink();
            }
            card.skill.manualChooseTarget();
            // 隐藏目标以外的血条
            for (var _i = 0, _a = this.enemies.concat(this.friends); _i < _a.length; _i++) {
                var char = _a[_i];
                if (card.skill.targets.indexOf(char) < 0) {
                    char.lifeBarHide();
                }
            }
            // 目标血条闪烁
            card.skill.manualChooseTarget();
            for (var _b = 0, _c = card.skill.targets; _b < _c.length; _b++) {
                var target = _c[_b];
                target.lifeBarBlink();
            }
        }
    };
    BattleScene.prototype.onObjLongTouchEnd = function (e) {
        var obj = e.messageContent;
        try {
            // 这里有可能还没触发长按时移开手指触发，此时并不存在弹出的窗口
            LayerManager.Ins.popUpLayer.removeChild(this.popUpInfoWin);
        }
        catch (ignore) { }
        if (obj instanceof Card) {
            var card = obj;
            var caster = card.skill.caster;
            if (caster) {
                caster.armatureUnBlink();
            }
            for (var _i = 0, _a = this.enemies.concat(this.friends); _i < _a.length; _i++) {
                var char = _a[_i];
                char.lifeBarShow();
            }
            card.skill.caster.armatureDisplay.alpha = 1;
            for (var _b = 0, _c = card.skill.targets; _b < _c.length; _b++) {
                var target = _c[_b];
                target.lifeBarUnBlink();
            }
        }
    };
    // 一个perform演出完毕时开始下一个演出
    BattleScene.prototype.onPerformEnd = function () {
        if (this.performQue.length == 0) {
            // 如果演出列表已经空了，就把正在演出状态置为false，同时退出演出
            this.isPerformance = false;
            return;
        }
        this.isPerformance = true;
        var skill;
        var affectResult;
        _a = this.performQue.pop(), skill = _a[0], affectResult = _a[1];
        skill.performance(affectResult);
        var _a;
    };
    BattleScene.prototype.onPerformChainStart = function () {
        if (this.isPerformance) {
            // 如果正在演出，那就不管这个消息
            return;
        }
        this.isPerformance = true;
        var skill;
        var affectResult;
        _a = this.performQue.pop(), skill = _a[0], affectResult = _a[1];
        skill.performance(affectResult);
        var _a;
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
        MessageManager.Ins.removeEventListener(MessageType.LongTouchStart, this.onObjLongTouchBegin, this);
        MessageManager.Ins.removeEventListener(MessageType.PerformanceChainStart, this.onPerformChainStart, this);
        MessageManager.Ins.removeEventListener(MessageType.LongTouchEnd, this.onObjLongTouchEnd, this);
        MessageManager.Ins.removeEventListener(MessageType.TouchBegin, this.onObjTouchGlowAnim, this);
        MessageManager.Ins.removeEventListener(MessageType.PerformanceEnd, this.onPerformEnd, this);
        this.dbManager.release();
        this.dbManager = null;
        this.cardBoard.release();
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
