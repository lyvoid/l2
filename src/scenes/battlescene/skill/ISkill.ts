abstract class ISkill {
	/**
	 * 技能释放者
	 */
	public caster: Charactor;
	/**
	 * 目标类型
	 */
	public targetType: TargetType;
	/**
	 * 目标容器
	 */
	public target: Charactor[];
	/**
	 * 需要能量
	 */
	public fireNeed: number;

	/**
	 * 根据目标类型，填充目标容器
	 */
	public chooseTarget(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		switch (this.targetType) {
			case TargetType.Self:
				this.target = [this.caster];
				break;
			case TargetType.AllFriend:
				if(this.caster.camp == CharCamp.enemy){
					this.target = scene.enemies;
				}else{
					this.target = scene.friends;
				}
				break;
			case TargetType.AllEnemy:
				if(this.caster.camp == CharCamp.enemy){
					this.target = scene.friends;
				}else{
					this.target = scene.enemies;
				}
				break;
			case TargetType.SpecialEnemy:
				if(this.caster.camp == CharCamp.enemy){
					this.target = [this.caster.randomTarget()];
				}else{
					this.target = [scene.selectEnemy];
				}
				break;
			case TargetType.SpecialFriend:
				if(this.caster.camp == CharCamp.enemy){
					this.target = [this.caster.randomFriend()];
				}else{
					this.target = [scene.selectFriend];
				}
				break;
		}
	}

	/**
	 * 释放技能，不同技能需要实现对应的useSkill
	 */
	abstract useSkill(): void;
}

enum TargetType {
	Self,// 自己
	AllFriend, // 友方全体
	AllEnemy, // 敌方全体
	SpecialFriend, // 选定的我方
	SpecialEnemy // 选定的敌方
}