class HurtManager {
	private _hurtPool: Hurt[];

	public constructor(){
		this._hurtPool = [];
	}

	public newHurt(id: number): Hurt{
		let hurtPool = this._hurtPool;
		let hurt: Hurt;
		if (hurtPool.length > 0){
			hurt = hurtPool.pop();
		}else{
			hurt = new Hurt();
		}
		// TODO: hurt initial by id
		// hurt.initial();
		return hurt;
	}

	public recycle(hurt: Hurt): void{
		hurt.uninitial();
		this._hurtPool.push(hurt);
	}

	public release(): void{
		this._hurtPool = null;
	}
}