var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var LongTouchUtil = (function () {
    function LongTouchUtil() {
    }
    LongTouchUtil.bindLongTouch = function (obj, thisObj) {
        obj.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchStart, thisObj);
        obj.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchFinish, thisObj);
        obj.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchOut, thisObj);
    };
    LongTouchUtil.unbindLongTouch = function (obj, thisObj) {
        obj.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchStart, thisObj);
        obj.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchFinish, thisObj);
        obj.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchOut, thisObj);
    };
    /**
     * 绑定了长按事件的对象的TouchBegin事件侦听中存在该事件
     * 会将holder置为侦听时设置的thisobj的指向（一般为被点击的对象自己）
     */
    LongTouchUtil.onTouchStart = function () {
        var _this = this;
        // 如果存在占用对象则直接退出
        if (LongTouchUtil.holderObj) {
            return;
        }
        LongTouchUtil.holderObj = this;
        if (LongTouchUtil.touchBeginTime) {
            egret.clearTimeout(LongTouchUtil.touchBeginTime);
        }
        LongTouchUtil.touchBeginTime = egret.setTimeout(function () {
            // 加遮罩，防止二次触发
            LayerManager.Ins.maskLayer.touchEnabled = true;
            MessageManager.Ins.sendMessage(MessageType.LongTouchStart, _this);
            console.log("long tap");
        }, this, 500);
    };
    /**
     * 由于存在遮罩的原因，这里不再需要发送消息
     * 仅仅需要清空一下计数器即可
     * 如果触发了长按，肯定不存在会有TOUCH_END消息发出来
     */
    LongTouchUtil.onTouchFinish = function () {
        egret.clearTimeout(LongTouchUtil.touchBeginTime);
        LongTouchUtil.holderObj = null;
        console.log("on Touch Finish");
    };
    /**
     * 如果移动到按住的物体外，存在两个情况，
     * 已经触发长按和未触发长按，可以按照相同逻辑处理
     */
    LongTouchUtil.onTouchOut = function () {
        egret.clearTimeout(LongTouchUtil.touchBeginTime);
        MessageManager.Ins.sendMessage(MessageType.LongTouchEnd, this);
        LayerManager.Ins.maskLayer.touchEnabled = false;
        LongTouchUtil.holderObj = null;
        console.log("on touch out ");
    };
    return LongTouchUtil;
}());
__reflect(LongTouchUtil.prototype, "LongTouchUtil");
