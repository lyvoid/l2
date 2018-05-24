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
`生命:<font color="#7CFC00">${this.hp}</font>/${this.maxHp}
护盾:<font color="#7CFC00">${this.shield}</font>/${this.maxShield}
攻击:<font color="#7CFC00">${this.ap}</font>
物理护甲:<font color="#7CFC00">${this.arPys}</font>
魔法护甲:<font color="#7CFC00">${this.arMagic}</font>
穿甲:<font color="#7CFC00">${this.pierceAr}</font>`;
	}

}