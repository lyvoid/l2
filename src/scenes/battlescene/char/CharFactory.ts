class CharFactory {
	public static newChar(
		id: number,
		camp: CharCamp,
		row: CRType,
		col: CCType,
		attr?: Attribute
	): Character {
		let char = new Character();
		let info = ConfigManager.Ins.mCharConfig[id];
		if (!attr) {
			attr = new Attribute();
			attr.initial(
				info["ap"],
				info["hp"],
				info["maxHp"],
				info["shield"],
				info["maxShield"],
				info["arMagic"],
				info["arPys"],
				info["pierceAr"],
				info["pysDamageReduceAbs"],
				info["pysDamageReducePerc"],
				info["magicDamageReduceAbs"],
				info["magicDamageReducePerc"]
			);
		}
		char.initial(
			info["charName"],
			info["charCode"],
			info["feature"],
			info["manualSkillsId"],
			info["passiveSkillsId"],
			camp,
			col,
			row,
			attr,
		);
		return char;
	}

}