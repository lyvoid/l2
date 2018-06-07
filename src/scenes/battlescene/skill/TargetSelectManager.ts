class TargetSelectManager{
	private _targetSelectPool: {[id:number]: TargetSelect};

    public constructor(){
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
        this._targetSelectPool = null;
    }

}