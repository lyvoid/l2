class BuffManager {
	private _buffPool:Buff[] = [];

	public newBuff(id: number): Buff{
		let buff: Buff;
		let pool = this._buffPool;
		if (pool.length > 0){
			buff = pool.pop();
		} else {
			buff = new Buff();
		}
		// TODO: initial
		// buff.initial();
		return buff;
	}

	public recycle(buff: Buff): void{
		buff.uninitial();
		this._buffPool.push(buff);
	}

	public release(): void{
		for (let buff of this._buffPool){
			buff.release();
		}
		this._buffPool = null;
	}
}