class NetManager {
	private constructor() {
	}

	private static instance: NetManager;

	public static get Ins() {
		if (this.instance == null) {
			this.instance = new NetManager();
		}
		return this.instance;
	}

	private _socket: egret.WebSocket;
	public initial(): void {
		this.connect();
	}

	private _connectRetryTime = 0;
	private _curMsgNum = 1;
	public get msgNum(): number { return this._curMsgNum++; }
	private connect(): void {
		const url = "ws://localhost:5000/echo";
		let socket = new egret.WebSocket();
		socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, () => {
			this.handleMessage(socket.readUTF());
		}, this);
		socket.addEventListener(egret.Event.CONNECT, () => {
			console.log("connected to service");
			this._connectRetryTime = 0
		}, this);
		socket.addEventListener(egret.Event.CLOSE, () => {
			this._connectRetryTime += 1;
			egret.setTimeout(
				this.connect,
				this,
				500 * (2 ** this._connectRetryTime)
			);
			console.log(`connect break, try to reconnect in ${this._connectRetryTime}st time`);
		}, this);
		socket.connectByUrl(url);
		this._socket = socket;
	}

	private handleMessage(msg: string): void {
		console.log(msg);
	}
}