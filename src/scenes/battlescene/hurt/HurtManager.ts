class HurtManager {
	private _hurtPool: Hurt[];

	public constructor(){
		this._hurtPool = [];
	}

	public newHurt(id: number, fromChar: Character=null): Hurt{
		let hurtPool = this._hurtPool;
		let hurt: Hurt;
		if (hurtPool.length > 0){
			hurt = hurtPool.pop();
		}else{
			hurt = new Hurt();
		}
		let info = ConfigManager.Ins.mHurtConfig[id];
		hurt.initial(
			info["hurtType"],
			info["rate"],
			info["isAbs"],
			info["absValue"],
			info["isPericeShield"],
			info["idDoubleShield"],
			info["isResurgence"],
			info["isRemoveFromGame"],
			info["isRemoveFromGameWhenDie"],
			fromChar
		);
		return hurt;
	}

	public recycle(hurt: Hurt): void{
		this._hurtPool.push(hurt);
	}

	public release(): void{
		this._hurtPool = null;
	}
}