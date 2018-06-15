class TargetSelectManager {
	private _targetSelectPool: { [id: number]: TargetSelect } = {};

	public initial(): void {
		this._targetSelectPool = {};
	}

	public getTargetSelect(id: number): TargetSelect {
		let targetSelectPool = this._targetSelectPool;
		if (targetSelectPool[id] != null) {
			return targetSelectPool[id];
		}
		let targetSelect = new TargetSelect();
		let info = ConfigManager.Ins.mTargetSelectConfig[id];
		targetSelect.initial(
			info["targetNum"],
			info["allNum"],
			info["priorType"],
			info["isContFriend"],
			info["isContEnemy"],
			info["isContDead"],
			info["isContAlive"],
			info["isReverse"]
		);
		targetSelectPool[id] = targetSelect;
		return targetSelect;
	}

	public release() {
		let pool = this._targetSelectPool;
		if (pool) {
			for (let i in pool) {
				pool[i].release();
			}
		}
		this._targetSelectPool = null;
	}

}