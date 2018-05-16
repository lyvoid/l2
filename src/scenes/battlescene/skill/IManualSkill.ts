abstract class IManualSkill {
	/**
	 * 技能释放者
	 */
	public caster: Character;
	/**
	 * 目标类型
	 */
	public targetType: TargetType;
	/**
	 * 目标容器
	 */
	public targets: Character[];
	/**
	 * 需要能量
	 */
	public fireNeed: number;

	/**
	 * 技能描述
	 */
	public desc: string;
	/**
	 * 根据目标类型，填充目标容器（主要目标）
	 */
	public chooseTarget(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		switch (this.targetType) {
			case TargetType.Self:
				this.targets = [this.caster];
				break;
			case TargetType.AllFriend:
				if(this.caster.camp == CharCamp.enemy){
					this.targets = scene.enemies;
				}else{
					this.targets = scene.friends;
				}
				break;
			case TargetType.AllEnemy:
				if(this.caster.camp == CharCamp.enemy){
					this.targets = scene.friends;
				}else{
					this.targets = scene.enemies;
				}
				break;
			case TargetType.SpecialEnemy:
				if(this.caster.camp == CharCamp.enemy){
					this.targets = [this.caster.randomTarget()];
				}else{
					this.targets = [scene.selectedEnemy];
				}
				break;
			case TargetType.SpecialFriend:
				if(this.caster.camp == CharCamp.enemy){
					this.targets = [this.caster.randomFriend()];
				}else{
					this.targets = [scene.selectedFriend];
				}
				break;
			case TargetType.NoTarget:
				this.targets = [];
				break;
		}
	}

	/**
	 * 释放技能，不同技能需要实现对应的useSkill
	 */
	abstract useSkill(): void;

	public release(): void{
		this.caster = null;
		this.targets = null;
	}
}

enum TargetType {
	Self,// 自己
	AllFriend, // 友方全体
	AllEnemy, // 敌方全体
	SpecialFriend, // 选定的我方
	SpecialEnemy, // 选定的敌方
	NoTarget // 无目标
}