class Buff {
	public constructor() {
		this.buffIcon = new egret.Bitmap(RES.getRes("bufficontest_png"));
		this.buffName = "狂暴";
	}

	public buffId: number;
	public buffName: string;
	public buffIcon: egret.Bitmap;
	public char: Character;
	public desc: string;
	public resultPhase: number;
	// 状态类 普通buff类 还是辅助buff类
	public showType;


	/// 属性加成内容
	// 属性加成 - ap arPys arMagic hp pierceAr shield

	// 减免物理伤害 10 10% 

	// 减免魔法伤害 10 10%

	// 受到物理伤害加重

	// 受到魔法伤害加重



	// 眩晕


	// 结算条件
	// 无条件
	// 某个buff达多少层
	// 死亡时

	/// 结算内容

	// 回血

	// 扣血

	// 复活

	// 死亡

	// 从游戏中排除

	// 剩余回合类型 按照结算次数  按照回合次数 同时





	/**
	 * 剩余计数器，-1为永久
	 * 在char所在的一方的回合开始阶段结算效果并-1 (结算时间点也可能放在其他地方)
	 * 在char所在一方的回合结束阶段如果buff的持续时间为0则驱散
	 */
	public remainRound: number = -1;

	// 剩余效果次数
	public remainAffect: number = -1;

	
	/**
	 * buff类型
	 * Any: 不做任何覆盖处理
	 * 处Any外其他: 覆盖相同类型的
	 *  
	 */
	public buffType: BuffType;
	/**
	 * 最大叠加层数
	 */
	public maxLayer: number; 

	public attachToChar(target: Character): void{

	}

	public affect(){

	}

	public removeFromChar(target: Character){

	}

	// TODO: affect if need
	public onCharStartPhase(){

	}

	// TODO: round-- and clear buff if needed
	public onCharEndPhase(){}

	/**
	 * 根据当前在charbuff列表中所处的位置，调整buffIcon的位置
	 * 主要在删除buff的时候使用
	 */
	public adjustPosition(){

	}
}

enum BuffType{
	Normal, //这个类型不覆盖任何其他buff，一般情况下buff都是这个类型
	Attack
}