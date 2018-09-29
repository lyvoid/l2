class L2Filters {
	/**
	 * outer glow of click object
	 */
	private static _outerGlowFilter: egret.GlowFilter = new egret.GlowFilter(
		0x33CCFF, // color  光晕的颜色，十六进制，不包含透明度
		1, // alpha
		40, // blurX 水平模糊量。有效值为 0 到 255.0（浮点）
		40, // blurY垂直模糊量。有效值为 0 到 255.0（浮点）
		2, // strength压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
		egret.BitmapFilterQuality.HIGH,  // quality 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
		false, // inner 指定发光是否为内侧发光，暂未实现
		false // knockout 指定对象是否具有挖空效果，暂未实现
	);

	/**
	 * outer glow of click object
	 */
	private static _outerGlowYellowFilter: egret.GlowFilter = new egret.GlowFilter(
		0xEEEE00, // color  光晕的颜色，十六进制，不包含透明度
		1, // alpha
		40, // blurX 水平模糊量。有效值为 0 到 255.0（浮点）
		40, // blurY垂直模糊量。有效值为 0 到 255.0（浮点）
		2, // strength压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
		egret.BitmapFilterQuality.HIGH,  // quality 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
		false, // inner 指定发光是否为内侧发光，暂未实现
		false // knockout 指定对象是否具有挖空效果，暂未实现
	);

	/**
	 * grey color filter
	 */
	private static _greyColorFlilter: egret.ColorMatrixFilter = new egret.ColorMatrixFilter(
		[
			0.3, 0.6, 0, 0, 0,
			0.3, 0.6, 0, 0, 0,
			0.3, 0.6, 0, 0, 0,
			0, 0, 0, 1, 0
		]
	);

	/**
	 * add a outer glow filter to object
	 */
	public static addOutGlowFilter(obj: any): void {
		L2Filters.addFilter(obj, L2Filters._outerGlowFilter);
	}

	/**
	 * remove outer glow filter from object
	 */
	public static removeOutGlowFilter(obj: any): void {
		L2Filters.removeFilter(obj, L2Filters._outerGlowFilter);
	}

	/**
	 * 增加灰色滤镜
	 */
	public static addGreyFilter(obj: any): void {
		L2Filters.addFilter(obj, L2Filters._greyColorFlilter);
	}

	/**
	 * 删除灰色滤镜
	 */
	public static removeGreyFilter(obj: any): void {
		L2Filters.removeFilter(obj, L2Filters._greyColorFlilter);
	}

	public static addYellowGlow(obj: any): void {
		L2Filters.addFilter(obj, L2Filters._outerGlowYellowFilter)
	}

	public static removeYellowGlow(obj: any): void {
		L2Filters.removeFilter(obj, L2Filters._outerGlowYellowFilter)
	}

	/**
	 * 删除obj的一个滤镜
	 */
	public static removeFilter(obj: any, filter: any): void {
		if (!obj.filters) {
			console.log("没有发现滤镜，不应该有这个情况噢");
			return;
		}
		if (!Util.removeObjFromArray(obj.filters, filter))
			console.log("object have no such filter");
		if (obj.filters.length == 0)
			obj.filters = null;
	}

	/**
	 * 给obj增加一个滤镜
	 */
	public static addFilter(obj: any, filter: any) {
		if (obj.filters) {
			obj.filters.push(filter)
		} else {
			obj.filters = [filter];
		}
	}

}