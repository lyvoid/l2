class TargetSelectManager{
	private _targetSelectPool: {[id:number]: TargetSelect} = {};

	public initial(): void{
		this._targetSelectPool = {};
	}

    public getTargetSelect(id: number): TargetSelect{
		let targetSelectPool = this._targetSelectPool;
		if (targetSelectPool[id]!=null){
			return targetSelectPool[id];
		}
		let targetSelect = new TargetSelect();
		// TODO:initial target select by id
		// targetSelect.initial();
		targetSelectPool[id] = targetSelect;
		return targetSelect;
    }

    public release(){
		let pool = this._targetSelectPool;
		for(let i in pool){
			pool[i].release();
		}
        this._targetSelectPool = null;
    }

}