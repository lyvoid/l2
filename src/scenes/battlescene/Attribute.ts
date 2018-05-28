class Attribute {

	// 属性模版
	public static AttrsTemplate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	public attrs: number[];
	public attrsRaw: number[];
	public attrsAdd: number[];
	public attrsMul: number[];
	/**
	 * 攻击
	 */
	public get ap(): number {
		return this.attrs[AttrName.Ap];
	}
	/**
	 * 魔法防御
	 */
	public get arMagic(): number {
		return this.attrs[AttrName.ArMagic];
	}
	/**
	 * 物理防御
	 */
	public get arPys(): number {
		return this.attrs[AttrName.ArPys];
	}
	/**
	 * 生命
	 */
	public get hp(): number {
		return this.attrs[AttrName.Hp];
	}
	/**
	 * 最大生命
	 */
	public get maxHp(): number {
		return this.attrs[AttrName.MaxHp];
	}
	/**
	 * 最大护盾
	 */
	public get maxShield(): number {
		return this.attrs[AttrName.MaxShield];
	}
	/**
	 * 穿甲
	 */
	public get pierceAr(): number {
		return this.attrs[AttrName.PierceAr];
	}
	/**
	 * 护盾
	 */
	public get shield(): number {
		return this.attrs[AttrName.Shield];
	}

	/**
	 * 物理伤害增加绝对值
	 */
	public get pysDamageReduceAbs(): number {
		return this.attrs[AttrName.PysDamageReduceAbs];
	}

	/**
	 * 物理伤害增加相对值
	 * 
	 * damage = (damage + abs) * (1 + perc)
	 */
	public get pysDamageReducePerc(): number {
		return this.attrs[AttrName.PysDamageReducePerc];
	}

	/**
	 * 魔法伤害增加绝对值
	 */
	public get magicDamageReduceAbs(): number {
		return this.attrs[AttrName.MagicDamageReduceAbs];
	}

	/**
	 * 魔法伤害增加相对值
	 */
	public get magicDamageReducePerc(): number {
		return this.attrs[AttrName.MagicDamageReducePerc];
	}

	/**
	 * 设置生命
	 */
	public set hp(value: number){
		this.attrs[AttrName.Hp] = value;
	}

	/**
	 * 设置护盾
	 */
	public set shield(value: number){
		this.attrs[AttrName.Shield] = value;
	}

	/**
	 * 隶属单位
	 */
	public char: Character;


	public constructor() {
		this.attrs = Object.create(Attribute.AttrsTemplate);
		this.attrsRaw = Object.create(Attribute.AttrsTemplate);
		this.attrsMul = Object.create(Attribute.AttrsTemplate);
		this.attrsAdd = Object.create(Attribute.AttrsTemplate);
		for (let i in this.attrs){
			this.attrs[i] = 10;
			this.attrsRaw[i] = 10;
		}
		for (let i of [AttrName.MagicDamageReduceAbs,
			AttrName.PysDamageReduceAbs]){
			this.attrs[i] = 5;
			this.attrsRaw[i] = 5;
		}

		for (let i of [AttrName.MagicDamageReducePerc,
			AttrName.PysDamageReducePerc]){
			this.attrs[i] = 0.9;
			this.attrsRaw[i] = 0.9;
		}
	}

	public setAttrAddition(attrName: AttrName, value: number, type:AttrAdditionType): void {
		if (type==AttrAdditionType.ADD){
			this.attrsAdd[attrName] += value;
		}else if (type==AttrAdditionType.MUL){
			this.attrsMul[attrName] += value;
		}
		let newValue = this.attrsRaw[attrName] + this.attrsAdd[attrName];
		newValue = newValue > 0 ? newValue : 0;
		newValue *= 1 + this.attrsMul[attrName];
		newValue = newValue > 0 ? Math.ceil(newValue) : 0;
		this.attrs[attrName] = newValue;

		// if attr is maxshield or maxhp
		if (attrName == AttrName.MaxHp) {
			if (newValue <= 0){
				newValue = 1;
			}
			if (newValue < this.hp) {
				this.attrs[AttrName.Hp] = newValue;
			}
		}
		if (attrName == AttrName.MaxShield) {
			if (newValue < this.shield) {
				this.attrs[AttrName.Shield] = newValue;
			}
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
	PierceAr,
	Hp,
	Shield,
	PysDamageReduceAbs,
	PysDamageReducePerc,
	MagicDamageReduceAbs,
	MagicDamageReducePerc
}

enum AttrAdditionType{
	ADD,
	MUL
}