class UserData {
	private static _instance: UserData;
	public static get Ins(): UserData {
		if (!this._instance) {
			this._instance = new UserData();
		}
		return this._instance;
	}

	public battleId: number;
	public curUserTeam: { charId: number, row: CRType, col: CCType, level: number, }[]
	private constructor() { }
	public initial(): void {
		// TODO:
		this.battleId = 1;

		// TODO: replace by get curUserTeam from service
		let curUserTeam = [];
		curUserTeam.push({ charId: 3, row: CRType.up, col: CCType.front, level: 1 });
		curUserTeam.push({ charId: 2, row: CRType.down, col: CCType.front, level: 1 });
		curUserTeam.push({ charId: 3, row: CRType.mid, col: CCType.mid, level: 1 });
		curUserTeam.push({ charId: 2, row: CRType.up, col: CCType.back, level: 1 });
		curUserTeam.push({ charId: 3, row: CRType.down, col: CCType.back, level: 1 });
		this.curUserTeam = curUserTeam;
	}
}
