class UserData {
	private static _instance: UserData;
	public battleId: number;
	// charOfUser_id & index; 0 means no char in this index
	public userTeam: [number, number, number, number, number, number];
	// key:charOfUser_id;value:char_id, TODO:里面的内容之后要换成含升级信息的内容
	public userArmy: {[index:number]:number} = {};

	// key userCardId, value: cardId
	public userCards: {[index: number]:number} = {};
	// value: userCardId
	public userDeck: number[];

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
		this.userTeam = [-1, -1, -1, -1, -1, -1];
		this.userArmy = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
		this.userCards = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110];
		this.userDeck = [];
	}

	public get cardIdOfUserDeck(): number[] {
		let result = [];
		for(let i of this.userDeck){
			result.push(this.userCards[i])
		}
		return result;
	}

	/**
	 * get row and col by charactor's index
	 */
	public get getUserTeamInfo(): { charId: number, row: CRType, col: CCType, level: number, }[] {
		let infos = [];
		let userTeam = this.userTeam;
		let userArmy = this.userArmy;
		for (let indexstr in userTeam){
			let index = parseInt(indexstr);
			let userCharID = userTeam[index];
			if(userCharID < 0) continue;
			let charId = userArmy[userTeam[index]];
			let rowT: CRType;
			let rowIdentity = index % 2;
			if (rowIdentity == 0){
				rowT = userTeam[index + 1] != 0 ? CRType.up : CRType.mid;
			} else {
				rowT = userTeam[index - 1] != 0 ? CRType.down : CRType.mid;
			}
			let colT: CCType = Math.floor(index / 2);
			infos.push({ charId: charId, row: rowT, col: colT, level: 1 });
		}
		return infos;
	}

}
