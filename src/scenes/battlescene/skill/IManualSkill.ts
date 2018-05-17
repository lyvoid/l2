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

	protected friends: Character[];
	protected enemies: Character[];

	/**
	 * 获取该阵营对应的敌我双方信息
	 */
	protected setCampChar(): void{
		let scene = SceneManager.Ins.curScene as BattleScene;
		if (this.caster != null && this.caster.camp == CharCamp.Enemy){
			// 如果是敌方单位，对应的敌我双方刚好相反
			this.enemies = scene.friends;
			this.friends = scene.enemies;
		}else{
			// 如果没有施法者统一看成我方施法
			this.enemies = scene.enemies;
			this.friends = scene.friends;
		}
	}

	/**
	 * 根据目标类型，填充目标容器（主要目标）
	 */
	public manualChooseTarget(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		switch (this.targetType) {
			case TargetType.Self:
				this.targets = [this.caster];
				break;
			case TargetType.AllFriend:
				this.targets = scene.friends;
				break;
			case TargetType.AllEnemy:
				this.targets = scene.enemies;
				break;
			case TargetType.SpecialEnemy:
				this.targets = [scene.selectedEnemy];
				break;
			case TargetType.SpecialFriend:
				this.targets = [scene.selectedFriend];
				break;
			case TargetType.NoTarget:
				break;
			case TargetType.All:
				this.targets = scene.enemies.concat(scene.friends);
				break;
		}
	}

	public autoChooseTarget(): void{
		this.setCampChar();
		switch (this.targetType) {
			case TargetType.Self:
				this.targets = [this.caster];
				break;
			case TargetType.AllFriend:
				this.targets = this.friends;
				break;
			case TargetType.AllEnemy:
				this.targets = this.enemies;
				break;
			case TargetType.SpecialEnemy:
				this.targets = [this.enemies[0]];
				break;
			case TargetType.SpecialFriend:
				this.targets = [this.friends[0]];
				break;
			case TargetType.NoTarget:
				break;
			case TargetType.All:
				this.targets = this.enemies.concat(this.friends);
				break;
		}
	};

	/**
	 * 释放技能，不同技能需要实现对应的useSkill
	 */
	public abstract useSkill(): void;

	/**
	 * 实际作用
	 */
	protected abstract affect(): void;
	/**
	 * 演出表现
	 */
	abstract performance(): void;

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
	NoTarget, // 无目标，或预设目标
	All// 所有
}