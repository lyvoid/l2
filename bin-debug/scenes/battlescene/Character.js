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
        /**
         * 阵营
         */
        _this.camp = CharCamp.Self;
        /**
         * 前中后三排 站位
         */
        _this.col = CharColType.frontRow;
        /**
         * 位置 上中下三行
         */
        _this.row = CharRowType.mid;
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
        _this.lifeBar = lifeBar;
        _this.lifeBarFg = lifeBarFg;
        // 加护盾条
        var shieldBar = new egret.Bitmap(RES.getRes("lifebarbg_jpg"));
        shieldBar.height = 8;
        shieldBar.y = 13;
        shieldBar.width = 80 * _this.attr.shield / _this.attr.maxShield;
        lifeBar.addChild(shieldBar);
        _this.shieldBar = shieldBar;
        // 加技能
        _this.manualSkills = [];
        var skill1 = new SkillTmp(_this);
        _this.manualSkills.push(skill1);
        return _this;
    }
    Object.defineProperty(Character.prototype, "desc", {
        /**
         * 人物当前状态描述，在长按中展示
         */
        get: function () {
            return this.attr.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "alive", {
        /**
         * 是否存活
         */
        get: function () {
            return this.attr.curHp != 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 播放血条动画，血条在1s内从之前的状态到达当前血量的状态
     */
    Character.prototype.lifeBarAnim = function (newHp) {
        if (!newHp) {
            newHp = this.attr.curHp;
        }
        var lifeBarNewLen = 100 * newHp / this.attr.maxHp;
        return egret.Tween.get(this.lifeBarFg).to({
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
        return egret.Tween.get(this.shieldBar).to({
            width: lifeBarNewLen,
        }, 1000, egret.Ease.quintOut);
    };
    Character.prototype.loadArmature = function (charactorName) {
        // 从当前场景中获取dbManager，因此在实例化charactor前
        var dbManager = SceneManager.Ins.curScene.dbManager;
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
        this.armatureDisplay = armatureDisplay;
        // 绑定长按动作
        LongTouchUtil.bindLongTouch(armatureDisplay, this);
        // 绑定TouchBegin事件（发送TouchBegin消息）
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
    };
    Character.prototype.onTouchBegin = function () {
        MessageManager.Ins.sendMessage(MessageType.TouchBegin, this.armatureDisplay);
    };
    /**
     * 点击时触发
     * 将选中框移动到该角色的bgLayer中，
     * 同时将scene下的selectEnemy及Friend调整为合适的对象
     */
    Character.prototype.onTouchTap = function () {
        var battleScene = SceneManager.Ins.curScene;
        if (this.camp == CharCamp.Enemy) {
            this.bgLayer.addChild(battleScene.bcr.enemySlectImg);
            battleScene.selectedEnemy = this;
        }
        else {
            this.bgLayer.addChild(battleScene.bcr.selfSelectImg);
            battleScene.selectedFriend = this;
        }
    };
    /**
     * 隐藏生命条
     */
    Character.prototype.lifeBarHide = function () {
        this.lifeBar.visible = false;
    };
    /**
     * 显示生命条
     */
    Character.prototype.lifeBarShow = function () {
        this.lifeBar.visible = true;
    };
    /**
     * 生命条开始闪烁
     */
    Character.prototype.lifeBarBlink = function () {
        egret.Tween.get(this.lifeBar, { loop: true }).to({ alpha: 0 }, 300).to({ alpha: 1 }, 300);
    };
    /**
     * 停止生命条闪烁
     */
    Character.prototype.lifeBarUnBlink = function () {
        egret.Tween.removeTweens(this.lifeBar);
        this.lifeBar.alpha = 1;
    };
    /**
     * 将角色设置为应该在的位置
     */
    Character.prototype.setPosition = function () {
        // 修改动画朝向为正确朝向
        this.armatureDisplay.scaleX = Math.abs(this.armatureDisplay.scaleX) * this.camp;
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
        egret.Tween.get(this.armatureDisplay, { loop: true }).to({ alpha: 0 }, 300).to({ alpha: 1 }, 300);
    };
    /**
     * 获取对比后的属性改动信息
     */
    /**
     * db动画停止闪烁
     */
    Character.prototype.armatureUnBlink = function () {
        egret.Tween.removeTweens(this.armatureDisplay);
    };
    Character.prototype.release = function () {
        LongTouchUtil.unbindLongTouch(this.armatureDisplay, this);
        this.armatureDisplay.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        this.armatureDisplay.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.armatureDisplay = null;
        for (var _i = 0, _a = this.manualSkills; _i < _a.length; _i++) {
            var skill = _a[_i];
            skill.release();
        }
        this.manualSkills = null;
        this.attr = null;
        this.lifeBarFg = null;
        this.bgLayer = null;
        this.lifeBar = null;
        this.shieldBar = null;
    };
    return Character;
}(egret.DisplayObjectContainer));
__reflect(Character.prototype, "Character");
var CharCamp;
(function (CharCamp) {
    CharCamp[CharCamp["Self"] = 1] = "Self";
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
