/**
 * 用于需要长按的对象，直接使用LongTouchUtil.bindLongTouch()来使用
 * 一个时间点最多只有一个单位会触发长按，一旦有单位被touch就会屏蔽掉其他的bind的对象
 * 一旦触发了长按会将遮罩层的touchenable=true，即屏蔽掉除了取消长按外的所有其他事件
 * thisObj 需要实现onLongTouchBegin 与 onLongTouchEnd 方法
 */
class LongTouchUtil {
	private static touchBeginTime;
	public static holderObj; // 一个时间点只能有一个对象进入长按逻辑
	public static isInLongTouch: boolean = false;
	private static longTouchMask = new egret.DisplayObjectContainer();

	/**
	 * 绑定长按对象，长按Obj后调用thisObj.onLongTouchBegin()
	 * 取消长按后调用 thisObj.onLongTouchEnd()
	 * thisObj 需要实现onLongTouchBegin 与 onLongTouchEnd 方法
	 */
	public static bindLongTouch(obj: egret.EventDispatcher, thisObj: any): void {

		obj.addEventListener(
			egret.TouchEvent.TOUCH_BEGIN,
			LongTouchUtil.onTouchBegin,
			thisObj
		);
		obj.addEventListener(
			egret.TouchEvent.TOUCH_END,
			LongTouchUtil.onTouchEnd,
			thisObj
		);
		obj.addEventListener(
			egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,
			LongTouchUtil.onTouchOut,
			thisObj
		);
	}

	public static unbindLongTouch(obj: egret.EventDispatcher, thisObj: any): void {
		obj.removeEventListener(
			egret.TouchEvent.TOUCH_BEGIN,
			LongTouchUtil.onTouchBegin,
			thisObj
		);
		obj.removeEventListener(
			egret.TouchEvent.TOUCH_END,
			LongTouchUtil.onTouchEnd,
			thisObj
		);
		obj.removeEventListener(
			egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,
			LongTouchUtil.onTouchOut,
			thisObj
		);
	}

	/**
	 * 绑定了长按事件的对象的TouchBegin事件侦听中存在该事件
	 * 这里面的this指向的是bindLongTouch中输入的thisObj
	 */
	private static onTouchBegin(): void {
		// 如果存在占用对象则直接退出
		if (LongTouchUtil.holderObj) {
			return
		}
		LongTouchUtil.holderObj = this;

		egret.clearTimeout(LongTouchUtil.touchBeginTime);
		LongTouchUtil.touchBeginTime = egret.setTimeout(
			() => {
				// 加遮罩，防止二次触发
				let lm = LayerManager.Ins;
				LongTouchUtil.longTouchMask.addChild(lm.maskBg);
				lm.maskLayer.addChild(LongTouchUtil.longTouchMask);
				LongTouchUtil.isInLongTouch = true;
				this.onLongTouchBegin();
			},
			this,
			500
		);
	}


	/**
	 * 由于存在遮罩的原因，这里不再需要发送消息
	 * 仅仅需要清空一下计数器即可
	 * 如果触发了长按，肯定不存在会有TOUCH_END消息发出来
	 */
	private static onTouchEnd(): void {
		egret.clearTimeout(LongTouchUtil.touchBeginTime);
		LongTouchUtil.holderObj = null;
	}

	/**
	 * 如果移动到按住的物体外
	 * 已经触发长按和未触发长按
	 * 未触发长按不处理
	 */
	private static onTouchOut(): void {
		egret.clearTimeout(LongTouchUtil.touchBeginTime);
		LongTouchUtil.holderObj = null;
		if (LongTouchUtil.isInLongTouch) {
			this.onLongTouchEnd();
			Util.safeRemove(LongTouchUtil.longTouchMask);
		}
	}

	// 防止编译器报错而已
	private static onLongTouchEnd() { }
	private static onLongTouchBegin() { }

	public static clear(): void {
		LongTouchUtil.isInLongTouch = false;
		LongTouchUtil.holderObj = null;
		Util.safeRemove(LongTouchUtil.longTouchMask);
		egret.clearTimeout(LongTouchUtil.touchBeginTime);
	}

}