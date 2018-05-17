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
var Card = (function (_super) {
    __extends(Card, _super);
    function Card(skill) {
        var _this = _super.call(this) || this;
        _this.width = 80;
        _this.height = 130;
        var cardBg = new egret.Bitmap(RES.getRes("cardbg_png"));
        cardBg.width = _this.width;
        cardBg.height = _this.height;
        _this.addChild(cardBg);
        _this.initial(skill);
        return _this;
    }
    Object.defineProperty(Card.prototype, "desc", {
        get: function () {
            return this.skill.desc;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 从对象池调出的时候调用
     */
    Card.prototype.initial = function (skill) {
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        LongTouchUtil.bindLongTouch(this, this);
        this.skill = skill;
    };
    /**
     * 使用后准备放入对象池前调用
     */
    Card.prototype.unInitial = function () {
        this.touchEnabled = false;
        LongTouchUtil.unbindLongTouch(this, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.skill = null;
    };
    Card.prototype.onTouchBegin = function () {
        MessageManager.Ins.sendMessage(MessageType.TouchBegin, this);
    };
    Card.prototype.onTouchTap = function () {
        var scene = SceneManager.Ins.curScene;
        var fireboard = scene.playerFireBoard;
        var fireNeed = this.skill.fireNeed;
        if (fireNeed > fireboard.fireNum) {
            ToastInfoManager.Ins.newToast("能量不足");
            return;
        }
        // 如果目标类型为特定单位，但该单位已经死亡（发生在之前的技能已经把敌方打死但是演出还没结束的时候）
        if (this.skill.targetType == TargetType.SpecialEnemy &&
            (!scene.selectedEnemy.alive)) {
            ToastInfoManager.Ins.newToast("选中目标已死亡");
            return;
        }
        // 使用技能
        this.skill.useSkill();
        // 技能作用效果结束（含连锁技能）以后调用效果
        MessageManager.Ins.sendMessage(MessageType.PerformanceChainStart);
        // 移除所需要的点数
        for (var i = 0; i < this.skill.fireNeed; i++) {
            fireboard.removeFire();
        }
        // 移除卡牌
        scene.cardBoard.removeCard(this);
    };
    /**
     * release 不会调用unInitial，释放前需要自行调用
     */
    Card.prototype.release = function () {
    };
    return Card;
}(egret.DisplayObjectContainer));
__reflect(Card.prototype, "Card");
