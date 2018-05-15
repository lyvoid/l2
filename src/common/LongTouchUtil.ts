/**
 * 用于需要长按的对象，直接使用LongTouchUtil.bindLongTouch()来使用
 * 一个时间点最多只有一个单位会触发长按，一旦有单位被touch就会屏蔽掉其他的bind的对象
 * 一旦触发了长按会将遮罩层的touchenable=true，即屏蔽掉除了取消长按外的所有其他事件
 * 触发长按事件时给全局消息管理器发送一个longtouchbegin消息
 * 结束时发送longtouchend消息
 */
class LongTouchUtil {
	private static touchBeginTime;
	private static holderObj; // 一个时间点只能有一个对象进入长按逻辑
	public static bindLongTouch(obj: egret.EventDispatcher, thisObj:any): void{
		
		obj.addEventListener(
			egret.TouchEvent.TOUCH_BEGIN,
			this.onTouchStart,
			thisObj
		);
		obj.addEventListener(
			egret.TouchEvent.TOUCH_END,
			this.onTouchFinish,
			thisObj
		);
		obj.addEventListener(
			egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,
			this.onTouchOut,
			thisObj
		);
	}

	public static unbindLongTouch(obj: egret.EventDispatcher, thisObj:any): void{
		obj.removeEventListener(
			egret.TouchEvent.TOUCH_BEGIN,
			this.onTouchStart,
			thisObj
		);
		obj.removeEventListener(
			egret.TouchEvent.TOUCH_END,
			this.onTouchFinish,
			thisObj
		);
		obj.removeEventListener(
			egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,
			this.onTouchOut,
			thisObj
		);
	}

	/**
	 * 绑定了长按事件的对象的TouchBegin事件侦听中存在该事件
	 * 会将holder置为侦听时设置的thisobj的指向（一般为被点击的对象自己）
	 */
	private static onTouchStart(): void{
		// 如果存在占用对象则直接退出
		if (LongTouchUtil.holderObj){
			return
		}
		LongTouchUtil.holderObj = this;

		if (LongTouchUtil.touchBeginTime){
			egret.clearTimeout(LongTouchUtil.touchBeginTime); 
		}
		LongTouchUtil.touchBeginTime = egret.setTimeout(
			()=>{
				// 加遮罩，防止二次触发
				LayerManager.Ins.maskLayer.touchEnabled = true;
				MessageManager.Ins.sendMessage(MessageType.LongTouchStart, this);
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
	public static onTouchFinish(): void{
		egret.clearTimeout(LongTouchUtil.touchBeginTime); 
		LongTouchUtil.holderObj = null;
	}

	/**
	 * 如果移动到按住的物体外，存在两个情况，
	 * 已经触发长按和未触发长按，可以按照相同逻辑处理
	 */
	public static onTouchOut(): void{
		egret.clearTimeout(LongTouchUtil.touchBeginTime); 
		MessageManager.Ins.sendMessage(MessageType.LongTouchEnd, this);
		LayerManager.Ins.maskLayer.touchEnabled = false;
		LongTouchUtil.holderObj = null;
	}
}