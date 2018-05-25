class Attribute {

	/**
	 * 攻击
	 */
	public ap: number = 1000;
	public apRaw: number = 1000;
	public apAdd: number = 0;
	public apMul: number = 0;
	/**
	 * 物理防御
	 */
	public arPys: number = 60;
	public arPysRaw: number = 60;
	public arPysAdd: number = 0;
	public arPysMul: number = 0;
	/**
	 * 魔法防御
	 */
	public arMagic: number = 60;
	public arMagicRaw: number = 60;
	public arMagicAdd: number = 0;
	public arMagicMul: number = 0;
	/**
	 * 最大生命
	 */
	public maxHp: number = 200;
	public maxHpRaw: number = 200;
	public maxHpAdd: number = 0;
	public maxHpMul: number = 0;
	/**
	 * 当前生命
	 */
	public hp: number = 200;
	/**
	 * 穿甲
	 */
	public pierceAr: number = 2;
	public pierceArRaw: number = 2;
	public pierceArAdd: number = 0;
	public pierceArMul: number = 0;
	/**
	 * 护盾
	 */
	public shield: number = 20;
	/**
	 * 最大护盾
	 */
	public maxShield: number = 100;
	public maxShieldRaw: number = 100;
	public maxShieldAdd: number = 0;
	public maxShieldMul: number = 0;
	/**
	 * 隶属单位
	 */
	public char: Character;


	public setAddAttrValue(attrName: AttrName, value: number): void {
		switch (attrName) {
			case AttrName.Ap:
				this.apAdd = value;
				this.ap = (this.apRaw + value) * (1 + this.apMul);
				break;
			case AttrName.ArMagic:
				this.arMagicAdd = value;
				this.arMagic = (this.arMagicRaw + value) * (1 + this.arMagicMul);
				break;
			case AttrName.ArPys:
				this.arPysAdd = value;
				this.arPys = (this.arPysRaw + value) * (1 + this.arPysMul);
				break;
			case AttrName.MaxHp:
				this.maxHpAdd = value;
				this.maxHp = (this.maxHpRaw + value) * (1 + this.maxHpMul);
				if (this.hp > this.maxHp){
					this.hp = this.maxHp;
				}
				break;
			case AttrName.MaxShield:
				this.maxShieldAdd = value;
				this.maxShield = (this.maxShieldRaw + value) * (1 + this.maxShieldMul);
				if (this.shield > this.maxShield){
					this.shield = this.maxShield;
				}
				break;
			case AttrName.PierceAr:
				this.pierceArAdd = value;
				this.pierceAr = (this.pierceArRaw + value) * (1 + this.pierceArMul);
				break;
		}
	}

	public setMulAttrValue(attrName: AttrName, value: number): void {
		switch (attrName) {
			case AttrName.Ap:
				this.apMul = value;
				this.ap = (this.apRaw + this.apAdd) * (1 + value);
				break;
			case AttrName.ArMagic:
				this.arMagicAdd = value;
				this.arMagic = (this.arMagicRaw + this.arMagicAdd) * (1 + value);
				break;
			case AttrName.ArPys:
				this.arPysMul = value;
				this.arPys = (this.arPysRaw + this.arPysAdd) * (1 + value);
				break;
			case AttrName.MaxHp:
				this.maxHpMul = value;
				this.maxHp = (this.maxHpRaw + this.maxHpAdd) * (1 + value);
				if (this.hp > this.maxHp){
					this.hp = this.maxHp;
				}
				break;
			case AttrName.MaxShield:
				this.maxShieldMul = value;
				this.maxShield = (this.maxShieldRaw + this.maxShieldAdd) * (1 + value);
				if (this.shield > this.maxShield){
					this.shield = this.maxShield;
				}
				break;
			case AttrName.PierceAr:
				this.pierceArMul = value;
				this.pierceAr = (this.pierceArRaw + this.pierceArAdd) * (1 + value);
				break;
		}
	}


	public toString(): string {
		return '' +
			`生命:<font color="#7CFC00">${this.hp}</font>/${this.maxHp}
护盾:<font color="#7CFC00">${this.shield}</font>/${this.maxShield}
攻击:<font color="#7CFC00">${this.ap}</font>
物理护甲:<font color="#7CFC00">${this.arPys}</font>
魔法护甲:<font color="#7CFC00">${this.arMagic}</font>
穿甲:<font color="#7CFC00">${this.pierceAr}</font>`;
	}

}

enum AttrName {
	Ap,
	MaxShield,
	MaxHp,
	ArMagic,
	ArPys,
	PierceAr
}