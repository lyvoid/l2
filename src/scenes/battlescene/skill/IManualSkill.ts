/**
 * 表示一个非被动技能（被动技能触发的一些效果也是通过主动技能来实现）
 * manualChooseTarget 手动选择目标规则
 * autoChooseTarget  自动选择目标规则
 * useSkill 调用技能（一般不用重写）
 * affect 实际施加效果（强制实现）
 * performance 表现效果（强制实现）结束时需要注意要发送MessageType.PerformanceEnd消息，不然会阻塞其他演出
 * needCast 是否需要释放
 */
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
	 * 技能归属
	 */
	public camp:CharCamp;

	/**
	 * 技能描述
	 */
	public desc: string;

	protected friends: Character[];
	protected enemies: Character[];

	public constructor(caster: Character = null, camp:CharCamp = CharCamp.Neut) {
		this.caster = caster;
		this.camp = caster ? caster.camp : camp;
		this.setCampChar();
	}

	/**
	 * 获取该阵营对应的敌我双方信息
	 */
	private setCampChar(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		if (this.camp == CharCamp.Enemy) {
			// 如果是敌方单位，对应的敌我双方刚好相反
			this.enemies = scene.friends;
			this.friends = scene.enemies;
		} else {
			// 如果中立统一看成我方施法
			this.enemies = scene.enemies;
			this.friends = scene.friends;
		}
	}

	/**
	 * 根据目标类型，填充目标容器（主要目标）
	 * 这里选出的目标会在玩家手动模式释放卡牌的时候使用
	 * 最好重写
	 */
	public manualChooseTarget(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		switch (this.targetType) {
			case TargetType.PreSet:
				break;
			case TargetType.Self:
				this.targets = [this.caster];
				break;
			case TargetType.AllAliveFriend:
				this.targets =  IManualSkill.getAllAliveChar(this.friends);
				break;
			case TargetType.AllAliveEnemy:
				this.targets =  IManualSkill.getAllAliveChar(this.enemies);
				break;
			case TargetType.SpecialEnemy:
				this.targets = [scene.selectedEnemy];
				break;
			case TargetType.SpecialFriend:
				this.targets = [scene.selectedFriend];
				break;
			case TargetType.NoTarget:
				this.targets = [];
				break;
			case TargetType.All:
				this.targets = this.enemies.concat(this.friends);
				break;
		}
	}

	public static getAllAliveChar(input: Character[]): Character[]{
		let ls:Character[] = [];
		for(let c of input){
			if (c.alive && c.attr.isInBattle){
				ls.push(c);
			}
		}
		return ls;
	}

	/**
	 * 这里选出的目标主要用在自动模式下
	 * 敌方的所有选择均使用这个
	 */
	public autoChooseTarget(): void {
		this.manualChooseTarget();
		switch (this.targetType) {
			case TargetType.SpecialEnemy:
				this.targets = [IManualSkill.getFirstAlive(this.enemies)];
				break;
			case TargetType.SpecialFriend:
				this.targets = [IManualSkill.getFirstAlive(this.friends)];
				break;
		}
	};

	public static getFirstAlive(input: Character[]){
		for(let c of input){
			if (c.alive && c.attr.isInBattle){
				return c;
			}
		}
	}

	/**
	 * 释放技能
	 */
	public useSkill(): void {

		let scene = SceneManager.Ins.curScene as BattleScene;

		// 如果游戏已经结束就不再释放
		if (scene.winnerCamp){
			return;
		}

		// 如果释放者存在且无法释放
		if (this.caster && !(this.caster.alive && this.caster.attr.isInBattle)) {
			return;
		}

		// 选择首要目标
		if (this.camp == CharCamp.Player){
			this.manualChooseTarget();
		}
		else{
			this.autoChooseTarget();
		}

		// 判断技能是不是需要释放
		if (!this.needCast()){
			return;
		}

		// 运行实际效果
		let affectResult = this.affect();

		// 确实需要释放时，将演出加到预演出列表
		scene.performQue.push([this, affectResult]);
		// 没次加入新的表现序列都调用一次应该是没错的
		MessageManager.Ins.sendMessage(MessageType.PerformanceChainStart);


		// 运行在在SkillToDo中的技能
		if (scene.skillTodoQue.length > 0) {
			scene.skillTodoQue.pop().useSkill();
		}

		// 判断游戏是否结束
		scene.judge();
	}

	/**
	 * 实际作用
	 * 返回的any中存放需要表现的效果的一些参数（比如哪些人被打了多少伤害等等）
	 * 这个值会扔给performance使用，只要同一个skill的affect的返回值和performance
	 * 能够接上返回什么格式都可以
	 */
	protected abstract affect(): any;

	/**
	 * 演出表现
	 */
	abstract performance(affectResult: any): void;

	/**
	 * 技能是否该释放
	 * IManualSkill中的该方法仅适用于判定对单个目标造成伤害的类型的技能
	 * 走到这个函数说明技能已经释放出去了，已经消耗了能量，只是可能已经不需要产生作用了
	 */
	protected needCast():boolean{
		let target = this.targets[0];
		return target.alive;
	}

	/**
	 * 状态表现
	 * 对血量护盾复活死亡进行表现
	 */
	public static statePerformance(stateChange: IAttrChange[]) {
		let damageFloatManage = (SceneManager.Ins.curScene as BattleScene).damageFloatManager;
		for (let result of stateChange) {
			let change: IAttrChange = result;
			let target = change.char;
			if (change.shieldNew != change.shieldOld) {
				target.lifeBarShieldAnim(change.shieldNew);
				damageFloatManage.newFloat(target, change.shieldOld, change.shieldNew, "护盾");
			}

			if (change.hpOld != change.hpNew) {
				target.lifeBarAnim(change.hpNew).call(
					// 血条变化完之后如果此次人物还死亡了的话
					() => {
						if (change.aliveNew != change.aliveOld && !change.aliveNew) {
							target.addChild(new eui.Label("死亡"));
						}
					}
				);
				// 飘字
				damageFloatManage.newFloat(target, change.hpOld, change.hpNew, "生命");
			}
		}
	}

	public release(): void {
		this.caster = null;
		this.targets = null;
		this.friends = null;
		this.enemies = null;
	}
}

enum TargetType {
	Self,// 自己
	AllAliveFriend, // 友方存活全体
	AllAliveEnemy, // 敌方存活全体
	SpecialFriend, // 选定的我方
	SpecialEnemy, // 选定的敌方
	NoTarget, // 无目标
	All,// 所有
	PreSet//提前设置好的
}