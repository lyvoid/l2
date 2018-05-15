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
var Charactor = (function (_super) {
    __extends(Charactor, _super);
    function Charactor(charactorName, dbManager) {
        var _this = _super.call(this) || this;
        /**
         * 属性
         */
        _this.attr = new Attribute();
        /**
         * 是否存活
         */
        _this.isAlive = true;
        _this.testSkill = new SkillTmp();
        /**
         * 阵营
         */
        _this.camp = CharCamp.self;
        /**
         * 前中后排
         */
        _this.row = CharRowType.frontRow;
        /**
         * 位置 上中下
         */
        _this.position = CharPositionType.mid;
        var bg = new egret.DisplayObjectContainer();
        _this.bgLayer = bg;
        _this.addChild(bg);
        _this.loadArmature(charactorName, dbManager);
        LongTouchUtil.bindLongTouch(_this, _this);
        var lifebarBg = new egret.Bitmap(RES.getRes("lifebarbg_jpg"));
        lifebarBg.alpha = 0.5;
        lifebarBg.width = 100;
        lifebarBg.y = -210;
        lifebarBg.x = -50;
        var lifebar = new egret.Bitmap(RES.getRes("lifebar_jpg"));
        lifebar.width = 100;
        lifebar.y = -209;
        lifebar.x = -50;
        _this.addChild(lifebarBg);
        _this.addChild(lifebar);
        _this.lifeBar = lifebar;
        return _this;
    }
    Object.defineProperty(Charactor.prototype, "desc", {
        /**
         * 人物当前状态描述，在长按中展示
         */
        get: function () {
            return "ap:" + this.attr.ap + "\n" +
                ("df:" + this.attr.df + "\nhp:" + this.attr.chp + "/" + this.attr.mhp);
        },
        enumerable: true,
        configurable: true
    });
    Charactor.prototype.randomTarget = function () {
        return this;
    };
    Charactor.prototype.randomFriend = function () {
        return this;
    };
    Charactor.prototype.hurt = function (ht) {
        if (!this.isAlive) {
            return;
        }
        var df = this.attr.df;
        var harm = ht.hurtNumber - df;
        if (harm < 0) {
            harm = ht.hurtNumber / 10;
        }
        this.attr.chp -= harm;
        if (this.attr.chp <= 0) {
            this.isAlive = false;
            this.attr.chp = 0;
            this.parent.removeChild(this);
        }
    };
    Charactor.prototype.loadArmature = function (charactorName, dbManager) {
        var _this = this;
        var armatureDisplay = dbManager.getArmatureDisplay(charactorName);
        var demandArmatureWidth = 100;
        var demandArmatureHeight = 200;
        armatureDisplay.scaleX = demandArmatureWidth / armatureDisplay.width;
        armatureDisplay.scaleY = demandArmatureHeight / armatureDisplay.height;
        armatureDisplay.width = demandArmatureWidth;
        armatureDisplay.height = demandArmatureHeight;
        armatureDisplay.touchEnabled = true;
        armatureDisplay.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            MessageManager.Ins.sendMessage(MessageType.ClickChar, _this);
        }, this);
        this.addChild(armatureDisplay);
        this.armatureDisplay = armatureDisplay;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.sendBeginTouchMessage, this);
    };
    Charactor.prototype.sendBeginTouchMessage = function () {
        MessageManager.Ins.sendMessage(MessageType.TouchBegin, this.armatureDisplay);
    };
    Charactor.prototype.setPosition = function () {
        this.y = 300 + 65 * this.position + Math.random() * 30;
        this.armatureDisplay.scaleX *= this.camp;
        this.x = 120 + this.row * 130 + this.position * 20 + Math.random() * 10;
        if (this.camp == CharCamp.enemy) {
            this.x = LayerManager.Ins.stageWidth - this.x;
        }
    };
    Charactor.prototype.getPositon = function () {
        var y = 300 + 65 * this.position + Math.random() * 30;
        var x = 120 + this.row * 130 + this.position * 20 + Math.random() * 10;
        if (this.camp == CharCamp.enemy) {
            x = LayerManager.Ins.stageWidth - x;
        }
        return { x: x, y: y };
    };
    Charactor.prototype.release = function () {
        LongTouchUtil.unbindLongTouch(this, this);
        this.armatureDisplay = null;
        this.bgLayer = null;
    };
    return Charactor;
}(egret.DisplayObjectContainer));
__reflect(Charactor.prototype, "Charactor");
var CharCamp;
(function (CharCamp) {
    CharCamp[CharCamp["self"] = 1] = "self";
    CharCamp[CharCamp["enemy"] = -1] = "enemy";
})(CharCamp || (CharCamp = {}));
var CharRowType;
(function (CharRowType) {
    CharRowType[CharRowType["frontRow"] = 0] = "frontRow";
    CharRowType[CharRowType["midRow"] = 1] = "midRow";
    CharRowType[CharRowType["backRow"] = 2] = "backRow";
})(CharRowType || (CharRowType = {}));
var CharPositionType;
(function (CharPositionType) {
    CharPositionType[CharPositionType["up"] = 0] = "up";
    CharPositionType[CharPositionType["mid"] = 1] = "mid";
    CharPositionType[CharPositionType["down"] = 2] = "down";
})(CharPositionType || (CharPositionType = {}));
