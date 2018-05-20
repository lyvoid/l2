var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 用于需要长按的对象，直接使用LongTouchUtil.bindLongTouch()来使用
 * 一个时间点最多只有一个单位会触发长按，一旦有单位被touch就会屏蔽掉其他的bind的对象
 * 一旦触发了长按会将遮罩层的touchenable=true，即屏蔽掉除了取消长按外的所有其他事件
 * 触发长按事件时给全局消息管理器发送一个longtouchbegin消息
 * 结束时发送longtouchend消息
 */
var LongTouchUtil = (function () {
    function LongTouchUtil() {
    }
    /**
     * 绑定长按对象，obj长按后发出 Type为 LongTouchBegin，内容为thisObj的Message
     */
    LongTouchUtil.bindLongTouch = function (obj, thisObj) {
        obj.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, thisObj);
        obj.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, thisObj);
        obj.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchOut, thisObj);
    };
    LongTouchUtil.unbindLongTouch = function (obj, thisObj) {
        obj.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, thisObj);
        obj.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, thisObj);
        obj.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchOut, thisObj);
    };
    /**
     * 绑定了长按事件的对象的TouchBegin事件侦听中存在该事件
     * 会将holder置为侦听时设置的thisobj的指向（一般为被点击的对象自己）
     */
    LongTouchUtil.onTouchBegin = function () {
        var _this = this;
        // 如果存在占用对象则直接退出
        if (LongTouchUtil.holderObj) {
            return;
        }
        LongTouchUtil.holderObj = this;
        egret.clearTimeout(LongTouchUtil.touchBeginTime);
        LongTouchUtil.touchBeginTime = egret.setTimeout(function () {
            // 加遮罩，防止二次触发
            LayerManager.Ins.maskLayer.visible = true;
            LongTouchUtil.isInLongTouch = true;
            MessageManager.Ins.sendMessage(MessageType.LongTouchStart, _this);
        }, this, 500);
    };
    /**
     * 由于存在遮罩的原因，这里不再需要发送消息
     * 仅仅需要清空一下计数器即可
     * 如果触发了长按，肯定不存在会有TOUCH_END消息发出来
     */
    LongTouchUtil.onTouchEnd = function () {
        egret.clearTimeout(LongTouchUtil.touchBeginTime);
        LongTouchUtil.holderObj = null;
    };
    /**
     * 如果移动到按住的物体外
     * 已经触发长按和未触发长按
     * 未触发长按不处理
     */
    LongTouchUtil.onTouchOut = function () {
        egret.clearTimeout(LongTouchUtil.touchBeginTime);
        LongTouchUtil.holderObj = null;
        if (LongTouchUtil.isInLongTouch) {
            MessageManager.Ins.sendMessage(MessageType.LongTouchEnd, this);
            LayerManager.Ins.maskLayer.visible = false;
            LongTouchUtil.isInLongTouch = false;
        }
    };
    LongTouchUtil.clear = function () {
        this.isInLongTouch = false;
        this.holderObj = null;
        LayerManager.Ins.maskLayer.visible = false;
        egret.clearTimeout(LongTouchUtil.touchBeginTime);
    };
    LongTouchUtil.isInLongTouch = false;
    return LongTouchUtil;
}());
__reflect(LongTouchUtil.prototype, "LongTouchUtil");
