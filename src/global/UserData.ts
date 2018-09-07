class UserData {
	private static _instance: UserData;
	public battleId: number;
	// charId & index; 0 means no char in this index
	public userTeam: [number, number, number, number, number, number];

	public static get Ins(): UserData {
		if (!this._instance) {
			this._instance = new UserData();
		}
		return this._instance;
	}
	private constructor() { }
	public initial(): void {
		// TODO:
		this.battleId = 1;
		
		// TODO: replace by get curUserTeam from service
		this.userTeam = [4, 0, 0, 0, 0, 0];
	}

	public get userDeck(): number[] {
		// TODO: replace by get from service
		return [5]
	};

	/**
	 * get row and col by charactor's index
	 */
	public get getUserTeamInfo(): { charId: number, row: CRType, col: CCType, level: number, }[] {
		let infos = [];
		let userTeam = this.userTeam;
		for (let indexstr in userTeam){
			let index = parseInt(indexstr);
			let characterId = userTeam[index];
			if(characterId == 0) continue;
			let rowT: CRType;
			let rowIdentity = index % 2;
			if (rowIdentity == 0){
				rowT = userTeam[index + 1] != 0 ? CRType.up : CRType.mid;
			} else {
				rowT = userTeam[index - 1] != 0 ? CRType.down : CRType.mid;
			}
			let colT: CCType = Math.floor(index / 2);
			infos.push({ charId: characterId, row: rowT, col: colT, level: 1 });
		}
		return infos;
	};
}
