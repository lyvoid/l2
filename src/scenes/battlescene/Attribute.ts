class Attribute {
	
	public ap: number = 100;
	public df: number = 60;
	public mhp: number = 200;
	public chp: number = 200;
	public shield: number = 100;
	public char: Character;

	public toString(): string {
		return `ap:${this.ap}\n` +
			`df:${this.df}\nhp:${this.chp}/${this.mhp}`;
	}

	/**
	 * 受到伤害
	 */
	public harm(hurt: Hurt): void{
		let df = this.df;
		let harm = hurt.hurtNumber - df;
		if (harm < 0) {
			harm = hurt.hurtNumber / 10;
		}

		this.chp -= harm;

		if (this.chp <= 0) {
			this.char.isAlive = false;
			this.chp = 0;
		}
	}

}