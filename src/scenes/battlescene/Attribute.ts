class Attribute {
	public static AttrsTemplate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	
	private _char: Character;
	private _attrs: number[];
	private _attrsRaw: number[];
	private _attrsAdd: number[];
	private _attrsMul: number[];

	// get
	public get ap(): number { return this._attrs[AttrName.Ap]; }
	public get arMagic(): number { return this._attrs[AttrName.ArMagic]; }
	public get arPys(): number { return this._attrs[AttrName.ArPys]; }
	public get hp(): number { return this._attrs[AttrName.Hp]; }
	public get maxHp(): number { return this._attrs[AttrName.MaxHp]; }
	public get maxShield(): number { return this._attrs[AttrName.MaxShield]; }
	public get pierceAr(): number { return this._attrs[AttrName.PierceAr]; }
	public get shield(): number { return this._attrs[AttrName.Shield]; }
	public get pysDamageReduceAbs(): number { return this._attrs[AttrName.PysDamageReduceAbs]; }
	// 物理伤害增加相对值 damage = (damage + abs) * (1 + perc)
	public get pysDamageReducePerc(): number { return this._attrs[AttrName.PysDamageReducePerc]; }
	// 魔法伤害增加绝对值
	public get magicDamageReduceAbs(): number { return this._attrs[AttrName.MagicDamageReduceAbs]; }
	public get magicDamageReducePerc(): number { return this._attrs[AttrName.MagicDamageReducePerc]; }

	// set
	public set hp(value: number) {
		if (value <= 0) {
			value = 0;
			if (this._char.alive)
				this._char.alive = false;
		} else {
			// if newHp > 0 && char is dead
			// revive char
			if (!this._char.alive)
				this._char.alive = true;
		}
		if (value > this.maxHp) value = this.maxHp;
		this._attrs[AttrName.Hp] = value;
	}
	public set shield(value: number) {
		if (value <= 0) value = 0;
		if (value > this.maxShield) value = this.maxShield;
		this._attrs[AttrName.Shield] = value;
	}

	public constructor() {
		this._attrs = Object.create(Attribute.AttrsTemplate);
		this._attrsRaw = Object.create(Attribute.AttrsTemplate);
		this._attrsMul = Object.create(Attribute.AttrsTemplate);
		this._attrsAdd = Object.create(Attribute.AttrsTemplate);
		for (let i in this._attrs) {
			this._attrs[i] = 10;
			this._attrsRaw[i] = 10;
		}
		for (let i of [AttrName.MagicDamageReduceAbs,
		AttrName.PysDamageReduceAbs]) {
			this._attrs[i] = 0;
			this._attrsRaw[i] = 0;
		}

		for (let i of [AttrName.MagicDamageReducePerc,
		AttrName.PysDamageReducePerc]) {
			this._attrs[i] = 0;
			this._attrsRaw[i] = 0;
		}
	}

	public setAttrAddition(attrName: AttrName, value: number, type: AttrAdditionType): void {
		if (type == AttrAdditionType.ADD) {
			this._attrsAdd[attrName] += value;
		} else if (type == AttrAdditionType.MUL) {
			this._attrsMul[attrName] += value;
		}
		let newValue = this._attrsRaw[attrName] + this._attrsAdd[attrName];
		newValue = newValue > 0 ? newValue : 0;
		newValue *= 1 + this._attrsMul[attrName];
		newValue = newValue > 0 ? Math.ceil(newValue) : 0;
		this._attrs[attrName] = newValue;

		// if attr is maxshield or maxhp
		if (attrName == AttrName.MaxHp) {
			if (newValue <= 0) {
				newValue = 1;
			}
			if (newValue < this.hp) {
				this._attrs[AttrName.Hp] = newValue;
			}
		}
		if (attrName == AttrName.MaxShield) {
			if (newValue < this.shield) {
				this._attrs[AttrName.Shield] = newValue;
			}
		}

	}

	public toString(): string {
		return `生命:<font color="#7CFC00">${this.hp}</font>/${this.maxHp}
护盾:<font color="#7CFC00">${this.shield}</font>/${this.maxShield}
攻击:<font color="#7CFC00">${this.ap}</font>
物理护甲:<font color="#7CFC00">${this.arPys}</font>
魔法护甲:<font color="#7CFC00">${this.arMagic}</font>
穿甲:<font color="#7CFC00">${this.pierceAr}</font>`;
	}

	public release(): void{
		this._char = null;
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

enum AttrAdditionType {
	ADD,
	MUL
}