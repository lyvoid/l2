class MessageType{
	public static AddCard = "AddCard";
	public static RemoveCard = "RemoveCard";
	public static UseCard="UseCard";



	// battle scene ui
	// 使用卡牌阶段结束，这个在自动模式下会自动发送该消息
	public static UseCardPhaseEnd = "UseCardPhaseEnd";

	// battle scene character
	public static TouchBegin = "TouchBegin";
	public static LongTouchStart = "LongTouchStart";
	public static LongTouchEnd = "LongTouchEnd";


	// 伤害或治疗消息
	public static HealHp = "HealHp";
	public static HealShield = "HealShield";
	public static HarmHp = "HarmHp";
	public static HarmShield = "HarmShield";
	public static CharDie = "CharDie";
	public static Resurgence = "Resurgence";

	public static PerformanceEnd = "NextPerformance";
	public static PerformanceChainStart = "PerformanceChainStart";


	// 演出全部结束
	public static SkillPerformAllEnd = "SkillPerformAllEnd";

	// 卡牌被点击事件
	public static CardTouchTap = "CardTouchTap"
}
