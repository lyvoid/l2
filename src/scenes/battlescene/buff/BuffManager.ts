class BuffManager {
	private _buffPool: Buff[] = [];

	public newBuff(id: number): Buff {
		let buffConfig = ConfigManager.Ins.mBuffConfig;
		let buff: Buff;
		let pool = this._buffPool;
		if (pool.length > 0) {
			buff = pool.pop();
		} else {
			buff = new Buff();
		}
		let buffInfo = buffConfig[id];
		let attrsAdd = BuffManager.parseAttrsLs(buffInfo["attrsAdd"]);
		let attrsMul = BuffManager.parseAttrsLs(buffInfo["attrsMul"]);
		
		buff.initial(
			id,
			buffInfo["buffName"],
			buffInfo["iconName"],
			buffInfo["description"],
			buffInfo["isPos"],
			buffInfo["maxLayer"],
			buffInfo["layId"],
			buffInfo["isDeadRemove"],
			buffInfo["initRemRound"],
			buffInfo["exType"],
			attrsAdd,
			attrsMul,
			buffInfo["isDiz"],
			buffInfo["isSlience"],
			buffInfo["isUnarm"],
			buffInfo["isAffect"],
			buffInfo["maxAffectTime"],
			buffInfo["affectPhase"],
			buffInfo["affectHurtId"],
			buffInfo["affectSkillId"],
			buffInfo["isAffectSkillPreSetTarget"],
			buffInfo["affectBuffIds"]
		);
		return buff;
	}

	private static parseAttrsLs(str): number[]{
		let attrLsStr = str.split(",");
		let attrs = Object.create(Attribute.AttrsTemplate);
		for(let attrStr of attrLsStr){
			let attrAndNum = attrStr.split(":");
			attrs[attrDict[attrAndNum[0]]] = parseFloat(attrAndNum[1]);
		}
		return attrs;
	}

	public recycle(buff: Buff): void {
		this._buffPool.push(buff);
	}

	public release(): void {
		this._buffPool = null;
	}
}

const attrDict: { [index: string]: AttrName } = {
	"Ap": AttrName.Ap,
	"MaxShield": AttrName.MaxShield,
	"MaxHp": AttrName.MaxHp,
	"ArMagic": AttrName.ArMagic,
	"ArPys": AttrName.ArPys,
	"PierceAr": AttrName.PierceAr,
	"Hp": AttrName.Hp,
	"Shield": AttrName.Shield,
	"PysDamageReduceAbs": AttrName.PysDamageReduceAbs,
	"PysDamageReducePerc": AttrName.PysDamageReducePerc,
	"MagicDamageReduceAbs": AttrName.PysDamageReduceAbs,
	"MagicDamageReducePerc": AttrName.MagicDamageReducePerc
}