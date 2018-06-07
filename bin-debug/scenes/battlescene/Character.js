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
/**
 * 场景中的一个角色，该类的实例应该只会出现在BattleScene中
 */
var Character = (function (_super) {
    __extends(Character, _super);
    function Character(charactorName) {
        var _this = _super.call(this) || this;
        _this.mCharName = "还没有名字";
        _this.mFeature = "特征是什么呢？";
        _this._isInBattle = true;
        _this.camp = CharCamp.Player;
        _this.col = CharColType.frontRow; //前中后三排 站位
        _this.row = CharRowType.mid; //位置 上中下三行
        // 背景层
        var bg = new egret.DisplayObjectContainer();
        _this.bgLayer = bg;
        _this.addChild(bg);
        // 载入龙骨动画
        _this.loadArmature(charactorName);
        // 加属性
        _this.attr = new Attribute();
        _this.attr.char = _this;
        // 加血条
        var lifeBar = new egret.DisplayObjectContainer();
        lifeBar.x = -50;
        lifeBar.y = -210;
        var lifebarBg = new egret.Bitmap(RES.getRes("lifebarbg_jpg"));
        lifebarBg.alpha = 0.5;
        lifebarBg.width = 100;
        lifeBar.addChild(lifebarBg);
        var lifeBarFg = new egret.Bitmap(RES.getRes("lifebar_jpg"));
        lifeBarFg.width = 100;
        lifeBarFg.y = 1;
        lifeBar.addChild(lifeBarFg);
        _this.addChild(lifeBar);
        _this._headBar = lifeBar;
        _this._lifeBarFg = lifeBarFg;
        // 加buff条
        var buffLine = new egret.DisplayObjectContainer();
        buffLine.y = -12;
        _this.mBuffLine = buffLine;
        _this._headBar.addChild(buffLine);
        // 加护盾条
        var shieldBar = new egret.Bitmap(RES.getRes("lifebarbg_jpg"));
        shieldBar.height = 8;
        shieldBar.y = 13;
        shieldBar.width = 80 * _this.attr.shield / _this.attr.maxShield;
        lifeBar.addChild(shieldBar);
        _this._shieldBar = shieldBar;
        // 加技能
        _this.mManualSkillsId = [];
        // TODO: push skill id to mManualSkillsId
        // for (let id of [1,2]){
        // 	this.mManualSkillsId.push(id);
        // }
        _this.mPassiveSkills = [];
        _this.mBuffs = [];
        _this.mHideBuffs = [];
        return _this;
    }
    Object.defineProperty(Character.prototype, "alive", {
        get: function () { return this.attr.hp != 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "description", {
        get: function () {
            var color = "#000000";
            if (this.camp === CharCamp.Enemy) {
                color = "#EE2C2C";
            }
            else if (this.camp === CharCamp.Player) {
                color = "#7FFF00";
            }
            return "<b><font color=\"" + color + "\">" + this.mCharName + "</font></b>" +
                ("\n<font color=\"#3D3D3D\" size=\"15\">" + this.mFeature + "</font>\n\n" + this.attr.toString());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "statDescription", {
        get: function () {
            var passiveSkillsDesc = "";
            var buffsDesc = "";
            var skillsDesc = "";
            for (var _i = 0, _a = this.mPassiveSkills; _i < _a.length; _i++) {
                var buff = _a[_i];
                passiveSkillsDesc = passiveSkillsDesc + "<font color=\"#7FFF00\"><b>" +
                    (buff.buffName + ":</b></font>" + buff.desc + "\n");
            }
            for (var _b = 0, _c = this.mBuffs; _b < _c.length; _b++) {
                var buff = _c[_b];
                var remainRound = buff.remainRound + "";
                remainRound = remainRound == "-1" ? "" : "(" + remainRound + "\u56DE\u5408)";
                var remainAffect = buff.remainAffectTime + "";
                remainAffect = remainAffect == "-1" ? "" : "(" + remainAffect + "\u6B21)";
                buffsDesc = buffsDesc + "<font color=\"#7FFF00\"><b>" +
                    ("" + buff.buffName + remainRound + remainAffect + "(" + buff.layer + "\u5C42):</b></font>" + buff.desc + "\n");
            }
            return "<font color=\"#EE7942\"><b>\u88AB\u52A8\u6280\u80FD</b></font>\n" + passiveSkillsDesc + "\n\n<font color=\"#EE7942\"><b>\u5F53\u524D\u72B6\u6001</b></font>\n" + buffsDesc;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "isInBattle", {
        get: function () {
            return this._isInBattle;
        },
        set: function (value) {
            // 如果角色本来在游戏中但被排除出游戏
            if (this._isInBattle && (!value)) {
                var scene = SceneManager.Ins.curScene;
                if (this.camp == CharCamp.Player) {
                    // 移除手牌中属于当前角色的牌
                    scene.mCardBoard.removeCardOfChar(this);
                    // 移除SkillPool中归属于该角色的技能
                    var skillPools = scene.mManualSkillIdPool;
                    var skillsForDelete = [];
                    for (var _i = 0, skillPools_1 = skillPools; _i < skillPools_1.length; _i++) {
                        var skill = skillPools_1[_i];
                        if (skill[1] == this) {
                            skillsForDelete.push(skill);
                        }
                    }
                    for (var _a = 0, skillsForDelete_1 = skillsForDelete; _a < skillsForDelete_1.length; _a++) {
                        var skill = skillsForDelete_1[_a];
                        Util.removeObjFromArray(skillPools, skill);
                    }
                }
                // 更新排除出游戏状态
                this._isInBattle = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 播放血条动画，血条在1s内从之前的状态到达当前血量的状态
     */
    Character.prototype.lifeBarAnim = function (newHp) {
        if (!newHp) {
            newHp = this.attr.hp;
        }
        var lifeBarNewLen = 100 * newHp / this.attr.maxHp;
        return egret.Tween.get(this._lifeBarFg).to({
            width: lifeBarNewLen,
        }, 1000, egret.Ease.quintOut);
    };
    /**
     * 播放shield条动画
     */
    Character.prototype.lifeBarShieldAnim = function (newShield) {
        if (!newShield) {
            newShield = this.attr.shield;
        }
        var lifeBarNewLen = 80 * newShield / this.attr.maxHp;
        return egret.Tween.get(this._shieldBar).to({
            width: lifeBarNewLen,
        }, 1000, egret.Ease.quintOut);
    };
    Character.prototype.loadArmature = function (charactorName) {
        // 从当前场景中获取dbManager，因此在实例化charactor前
        var dbManager = SceneManager.Ins.curScene.mDbManager;
        var armatureDisplay = dbManager.getArmatureDisplay(charactorName);
        // 设置龙骨动画资源大小
        var demandArmatureWidth = 100;
        var demandArmatureHeight = 200;
        armatureDisplay.scaleX = demandArmatureWidth / armatureDisplay.width;
        armatureDisplay.scaleY = demandArmatureHeight / armatureDisplay.height;
        armatureDisplay.width = demandArmatureWidth;
        armatureDisplay.height = demandArmatureHeight;
        // 增加动画点击事件
        armatureDisplay.touchEnabled = true;
        armatureDisplay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        // 龙骨动画添加到Character中
        this.addChild(armatureDisplay);
        this.mArmatureDisplay = armatureDisplay;
        // 绑定长按动作
        LongTouchUtil.bindLongTouch(armatureDisplay, this);
        // 绑定TouchBegin事件（发送TouchBegin消息）
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
    };
    /**
     * 播放龙骨动画
     */
    Character.prototype.playDBAnim = function (animationName, animationTimes, animationNameBack) {
        if (animationTimes === void 0) { animationTimes = -1; }
        if (animationNameBack === void 0) { animationNameBack = "idle"; }
        if (this.mArmatureDisplay.animation.animationNames.indexOf(animationName) >= 0) {
            this.mArmatureDisplay.animation.play(animationName, animationTimes);
        }
        else {
            this.mArmatureDisplay.animation.play(animationNameBack, animationTimes);
        }
    };
    Character.prototype.onLongTouchEnd = function () {
        var scene = SceneManager.Ins.curScene;
        LayerManager.Ins.popUpLayer.removeChild(scene.mCharInfoPopupUI);
    };
    Character.prototype.onLongTouchBegin = function () {
        var scene = SceneManager.Ins.curScene;
        scene.mCharInfoPopupUI.setDescFlowText(this.description);
        scene.mCharInfoPopupUI.setSkillDescFlowText(this.statDescription);
        LayerManager.Ins.popUpLayer.addChild(scene.mCharInfoPopupUI);
    };
    /**
     * 停止龙骨动画
     */
    Character.prototype.stopDBAnim = function () {
        this.mArmatureDisplay.animation.stop();
    };
    // 点击的时候播放外发光滤镜动画
    Character.prototype.onTouchBegin = function () {
        SceneManager.Ins.curScene.mFilterManager.setOutGlowHolderWithAnim(this.mArmatureDisplay);
    };
    /**
     * 点击时触发
     * 将选中框移动到该角色的bgLayer中，
     * 同时将scene下的selectEnemy及Friend调整为合适的对象
     */
    Character.prototype.onTouchTap = function () {
        this.setAsSelect();
    };
    /**
     * 隐藏生命条
     */
    Character.prototype.lifeBarHide = function () {
        this._headBar.visible = false;
    };
    /**
     * 显示生命条
     */
    Character.prototype.lifeBarShow = function () {
        this._headBar.visible = true;
    };
    /**
     * 生命条开始闪烁
     */
    Character.prototype.lifeBarBlink = function () {
        egret.Tween.get(this._headBar, { loop: true }).to({ alpha: 0 }, 300).to({ alpha: 1 }, 300);
    };
    /**
     * 停止生命条闪烁
     */
    Character.prototype.lifeBarUnBlink = function () {
        egret.Tween.removeTweens(this._headBar);
        this._headBar.alpha = 1;
    };
    /**
     * 将角色设置为应该在的位置
     */
    Character.prototype.setPosition = function () {
        // 修改动画朝向为正确朝向
        this.mArmatureDisplay.scaleX = Math.abs(this.mArmatureDisplay.scaleX) * this.camp;
        // 修改动画位置
        var newP = this.getPositon();
        this.x = newP.x;
        this.y = newP.y;
    };
    /**
     * 获取角色应该在的位置
     */
    Character.prototype.getPositon = function () {
        var y = 300 + 65 * this.row + Math.random() * 30;
        var x = 120 + this.col * 130 + this.row * 20 + Math.random() * 10;
        if (this.camp == CharCamp.Enemy) {
            x = LayerManager.Ins.stageWidth - x;
        }
        return { x: x, y: y };
    };
    /**
     * db动画闪烁
     */
    Character.prototype.armatureBlink = function () {
        egret.Tween.get(this.mArmatureDisplay, { loop: true }).to({ alpha: 0 }, 300).to({ alpha: 1 }, 300);
    };
    Character.prototype.setAsSelect = function () {
        var scene = SceneManager.Ins.curScene;
        this.bgLayer.addChild(scene.mSelectImg);
        scene.mSelectedChar = this;
    };
    /**
     * db动画停止闪烁
     */
    Character.prototype.armatureUnBlink = function () {
        egret.Tween.removeTweens(this.mArmatureDisplay);
    };
    Character.prototype.release = function () {
        LongTouchUtil.unbindLongTouch(this.mArmatureDisplay, this);
        this.mArmatureDisplay.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        this.mArmatureDisplay.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.mArmatureDisplay = null;
        this.mManualSkillsId = null;
        this.attr = null;
        this._lifeBarFg = null;
        this.bgLayer = null;
        this._headBar = null;
        this._shieldBar = null;
    };
    return Character;
}(egret.DisplayObjectContainer));
__reflect(Character.prototype, "Character");
var CharCamp;
(function (CharCamp) {
    CharCamp[CharCamp["Player"] = 1] = "Player";
    CharCamp[CharCamp["Neut"] = 0] = "Neut";
    CharCamp[CharCamp["Enemy"] = -1] = "Enemy";
})(CharCamp || (CharCamp = {}));
var CharColType;
(function (CharColType) {
    CharColType[CharColType["frontRow"] = 0] = "frontRow";
    CharColType[CharColType["midRow"] = 1] = "midRow";
    CharColType[CharColType["backRow"] = 2] = "backRow";
})(CharColType || (CharColType = {}));
var CharRowType;
(function (CharRowType) {
    CharRowType[CharRowType["up"] = 0] = "up";
    CharRowType[CharRowType["mid"] = 1] = "mid";
    CharRowType[CharRowType["down"] = 2] = "down";
})(CharRowType || (CharRowType = {}));
