/**
 * 全局消息管理 message manager
 * 需要发送特定事件类型时，在EventTypes中增加一个类型，
 * 并通过 sendMessage(EventTypes.type, message) 来发送事件
 * message中放置需要附带的事件或消息信息，
 * 事件（消息）接收方可以收到一个GlobalEvent类型的参数。
 * 
 */
class MessageManager extends egret.DisplayObject{
	private constructor() {
		super();
	}

	private static instance: MessageManager;

	public static get Ins(){
		if(this.instance == null){
			this.instance = new MessageManager();
		}
		return this.instance;
	}

	public initial(stage: egret.Stage): void{
		// 将消息管理对象加入到stage中（需要加入stage才能发送与侦听touch事件）
		stage.addChild(this);
	}


	public sendMessage(type: string, messageContent:any=null){
		this.dispatchEvent(new Message(messageContent, type));
	}

}

/**
 * 自定义事件，事件内容放在message里，可以是任意类型
 */
class Message extends egret.Event{
	public messageContent: any;
    public constructor(messageContent: any, type:string, bubbles:boolean=false, cancelable:boolean=false)
    {
        super(type, bubbles, cancelable);
		this.messageContent = messageContent;
    }
}