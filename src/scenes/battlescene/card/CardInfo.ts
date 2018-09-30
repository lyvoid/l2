interface CardInfo {
	skillId: number,
	caster?:Character,
	/**
	 * -1表示无穷，需要重新初始化
	 * 卡牌使用完的时候--如果发现时0就直接销毁
	 */
	recycleTimes: number,
	maxCd: number,
	curCd: number
}