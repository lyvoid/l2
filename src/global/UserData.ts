class UserData {
	private static _instance: UserData;
	public battleId: number;
	// charOfUser_id & index; 0 means no char in this index
	public userTeam: [number, number, number, number, number, number];
	// key:charOfUser_id;value:char_id, TODO:里面的内容之后要换成含升级信息的内容
	public userArmy: {[index:number]:number} = {}; 

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
		this.userTeam = [8, -1, -1, -1, -1, -1];
		this.userArmy[1] = 1;
		this.userArmy[4] = 1;
		this.userArmy[8] = 2;
		this.userArmy[12] = 1;
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
		let userArmy = this.userArmy;
		for (let indexstr in userTeam){
			let index = parseInt(indexstr);
			let characterId = userArmy[userTeam[index]];
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
	}

}
