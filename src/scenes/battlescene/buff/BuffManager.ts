class BuffManager {
	private _buffPool:Buff[] = [];

	public newBuff(id: number): Buff{
		let buffConfig = ConfigManager.Ins.mBuffConfig;
		let buff: Buff;
		let pool = this._buffPool;
		if (pool.length > 0){
			buff = pool.pop();
		} else {
			buff = new Buff();
		}
		// TODO: initial
		let buffInfo = buffConfig[id];
		// buff.initial();
		return buff;
	}

	public recycle(buff: Buff): void{
		this._buffPool.push(buff);
	}

	public release(): void{
		this._buffPool = null;
	}
}