class Attribute {
	
	/**
	 * 攻击
	 */
	public ap: number = 1000;
	/**
	 * 物理防御
	 */
	public arPys: number = 60;
	/**
	 * 魔法防御
	 */
	public arMagic: number = 60;
	/**
	 * 最大生命
	 */
	public maxHp: number = 200;
	/**
	 * 当前生命
	 */
	public hp: number = 200;
	/**
	 * 穿甲
	 */
	public pierceAr: number = 2;
	/**
	 * 护盾
	 */
	public shield: number = 20;
	/**
	 * 最大护盾
	 */
	public maxShield: number = 100;
	/**
	 * 隶属单位
	 */
	public char: Character;

	public toString(): string {
		return ''+
`生命:${this.hp}/${this.maxHp}
护盾:${this.shield}/${this.maxShield}
攻击:${this.ap}
物理护甲:${this.arPys}
魔法护甲:${this.arMagic}
穿甲:${this.pierceAr}`;
	}

}