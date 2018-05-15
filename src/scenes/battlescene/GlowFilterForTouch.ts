/**
 * GlowFilter for touch
 */
class TouchGlowManager {

	private holder: any;
	private glowFilter: egret.GlowFilter;
	private glowTw: egret.Tween;

	public constructor() {
		let color: number = 0x33CCFF;        /// 光晕的颜色，十六进制，不包含透明度
		let alpha: number = 0.8;             /// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
		let blurX: number = 200;              /// 水平模糊量。有效值为 0 到 255.0（浮点）
		let blurY: number = 200;              /// 垂直模糊量。有效值为 0 到 255.0（浮点）
		let strength: number = 2;            /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
		let quality: number = egret.BitmapFilterQuality.HIGH;        /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
		let inner: boolean = false;            /// 指定发光是否为内侧发光，暂未实现
		let knockout: boolean = false;            /// 指定对象是否具有挖空效果，暂未实现
		this.glowFilter = new egret.GlowFilter(color, alpha, blurX, blurY,
			strength, quality, inner, knockout);
	}

	/**
	 * 为holder增加一个滤镜动画
	 */
	public setHolderAnim(holder: any) {
		this.setHolder(holder);
		if(this.glowTw){
			egret.Tween.removeTweens(this.glowTw);
		}
		this.glowTw = egret.Tween.get(this.glowFilter);
		this.glowTw.to({alpha: 0}, 800).call(
			this.removeFromHolder
		);
	}

	/**
	 * 加上一个滤镜
	 */
	public setHolder(holder: any) {
		this.removeFromHolder();
		this.holder = holder;
		this.glowFilter.alpha = 0.8
		holder.filters = [this.glowFilter];
	}

	/**
	 * 移除holder的全部滤镜
	 */
	private removeFromHolder() {
		if (this.holder) {
			this.holder.filters = null;
		}
	}

	/**
	 * 释放资源，销毁前手动调用
	 */
	public release() {
		this.removeFromHolder();
		this.holder = null;
		this.glowFilter = null;
	}
}