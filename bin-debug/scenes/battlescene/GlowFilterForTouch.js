var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * GlowFilter for touch
 */
var TouchGlowManager = (function () {
    function TouchGlowManager() {
        var color = 0x33CCFF; /// 光晕的颜色，十六进制，不包含透明度
        var alpha = 0.8; /// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
        var blurX = 200; /// 水平模糊量。有效值为 0 到 255.0（浮点）
        var blurY = 200; /// 垂直模糊量。有效值为 0 到 255.0（浮点）
        var strength = 2; /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
        var quality = 3 /* HIGH */; /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
        var inner = false; /// 指定发光是否为内侧发光，暂未实现
        var knockout = false; /// 指定对象是否具有挖空效果，暂未实现
        this.glowFilter = new egret.GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
    }
    /**
     * 为holder增加一个滤镜动画
     */
    TouchGlowManager.prototype.setHolderAnim = function (holder) {
        this.setHolder(holder);
        if (this.glowTw) {
            egret.Tween.removeTweens(this.glowTw);
        }
        this.glowTw = egret.Tween.get(this.glowFilter);
        this.glowTw.to({ alpha: 0 }, 800).call(this.removeFromHolder);
    };
    /**
     * 加上一个滤镜
     */
    TouchGlowManager.prototype.setHolder = function (holder) {
        this.removeFromHolder();
        this.holder = holder;
        this.glowFilter.alpha = 0.8;
        holder.filters = [this.glowFilter];
    };
    /**
     * 移除holder的全部滤镜
     */
    TouchGlowManager.prototype.removeFromHolder = function () {
        if (this.holder) {
            this.holder.filters = null;
        }
    };
    /**
     * 释放资源，销毁前手动调用
     */
    TouchGlowManager.prototype.release = function () {
        this.removeFromHolder();
        this.holder = null;
        this.glowFilter = null;
    };
    return TouchGlowManager;
}());
__reflect(TouchGlowManager.prototype, "TouchGlowManager");
