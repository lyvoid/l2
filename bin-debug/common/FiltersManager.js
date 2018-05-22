var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 点击滤镜动画管理器，点击的时候会有一个外发光效果，同时只有一个单位处于holder状态
 */
var FilterManager = (function () {
    function FilterManager() {
        var color = 0x33CCFF; /// 光晕的颜色，十六进制，不包含透明度
        var alpha = 1; /// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
        var blurX = 80; /// 水平模糊量。有效值为 0 到 255.0（浮点）
        var blurY = 80; /// 垂直模糊量。有效值为 0 到 255.0（浮点）
        var strength = 2; /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
        var quality = 3 /* HIGH */; /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
        var inner = false; /// 指定发光是否为内侧发光，暂未实现
        var knockout = false; /// 指定对象是否具有挖空效果，暂未实现
        this.touchBeginOutGlowFilter = new egret.GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
        var colorMatrix = [
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0, 0, 0, 1, 0
        ];
        this.greyColFlilter = new egret.ColorMatrixFilter(colorMatrix);
    }
    /**
     * 为holder增加一个滤镜动画
     */
    FilterManager.prototype.setOutGlowHolderWithAnim = function (holder) {
        this.setOutGrowFilterHolder(holder);
        egret.Tween.removeTweens(this.touchBeginOutGlowFilter);
        egret.Tween.get(this.touchBeginOutGlowFilter).to({ alpha: 0 }, 800).call(this.removeOutFilterFromHolder);
    };
    /**
     * 增加一个灰色滤镜
     */
    FilterManager.prototype.addGreyFilter = function (obj) {
        FilterManager.addFilter(obj, this.greyColFlilter);
    };
    /**
     * 删除这个灰色滤镜
     */
    FilterManager.prototype.removeGreyFilter = function (obj) {
        FilterManager.removeFilter(obj, this.greyColFlilter);
    };
    /**
     * 删除一个filter
     */
    FilterManager.removeFilter = function (obj, filter) {
        if (!obj.filters) {
            console.log("没有发现滤镜，不应该有这个情况噢");
            return;
        }
        if (obj.filters.length > 1)
            Util.deleteObjFromList(obj.filters, filter);
        else
            obj.filters = null;
    };
    /**
     * 给obj增加一个滤镜
     */
    FilterManager.addFilter = function (obj, filter) {
        if (obj.filters) {
            obj.filters.push(filter);
        }
        else {
            obj.filters = [filter];
        }
    };
    /**
     * 给holder加上一个滤镜(无动画)
     */
    FilterManager.prototype.setOutGrowFilterHolder = function (holder) {
        this.removeOutFilterFromHolder();
        this.touchBeginHolder = holder;
        this.touchBeginOutGlowFilter.alpha = 1;
        FilterManager.addFilter(holder, this.touchBeginOutGlowFilter);
    };
    /**
     * 移除holder的全部滤镜
     */
    FilterManager.prototype.removeOutFilterFromHolder = function () {
        if (this.touchBeginHolder) {
            FilterManager.removeFilter(this.touchBeginHolder, this.touchBeginOutGlowFilter);
        }
    };
    /**
     * 释放资源，销毁前手动调用
     */
    FilterManager.prototype.release = function () {
        this.removeOutFilterFromHolder();
        this.touchBeginHolder = null;
        this.touchBeginOutGlowFilter = null;
        this.greyColFlilter = null;
    };
    return FilterManager;
}());
__reflect(FilterManager.prototype, "FilterManager");
