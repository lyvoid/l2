class IBuff {
	public constructor() {
	}

	public buffName: string;
	public char: Character;
	public buffType: BuffType; // 相同但不是同一个且同等级的直接覆盖
	public maxLayer: number;
	public level: number;

	public attachToChar(target: Character){}
	public removeFromChar(target: Character){}
}

enum BuffType{

}