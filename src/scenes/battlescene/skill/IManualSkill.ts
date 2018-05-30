/**
 * 表示一个非被动技能（被动技能触发的一些效果也是通过主动技能来实现）
 * manualChooseTarget 手动选择目标规则
 * autoChooseTarget  自动选择目标规则
 * useSkill 调用技能（一般不用重写）
 * affect 实际施加效果（强制实现）
 * performance 表现效果（强制实现）结束时需要注意要发送MessageType.PerformanceEnd消息，不然会阻塞其他演出
 * needCast 是否需要释放
 */
class IManualSkill {
	/**
	 * 技能释放者，可以没有释放者
	 */
	public caster: Character;
	/**
	 * 技能名
	 */
	public skillName: string;

	/**
	 * 后续技能
	 */
	public skillsAfter: IManualSkill[];
	/**
	 * 给目标的buff
	 */
	public buffsIdToTarget: number[];
	/**
	 * 目标类型
	 */
	public targetType: TargetType;
	/**
	 * 目标容器
	 */
	public targets: Character[];

	public isPerformance: boolean = true;
	/**
	 * 需要能量
	 */
	public fireNeed: number;

	/**
	 * 技能归属
	 */
	public camp: CharCamp;

	/**
	 * 技能描述
	 */
	public desc: string;

	protected friends: Character[];
	protected enemies: Character[];

	public constructor(caster: Character = null, camp: CharCamp = CharCamp.Neut) {
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
				this.targets = IManualSkill.getAllAliveChar(this.friends);
				break;
			case TargetType.AllAliveEnemy:
				this.targets = IManualSkill.getAllAliveChar(this.enemies);
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

	public static getAllAliveChar(input: Character[]): Character[] {
		let ls: Character[] = [];
		for (let c of input) {
			if (c.alive && c.isInBattle) {
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
				let fe = IManualSkill.getFirstAlive(this.enemies);
				this.targets = fe ? [fe] : [];
				break;
			case TargetType.SpecialFriend:
				let ff = IManualSkill.getFirstAlive(this.friends);
				this.targets = ff ? [ff] : [];
				break;
		}
	};

	public static getFirstAlive(chars: Character[]): Character {
		for (let c of chars) {
			if (c.alive && c.isInBattle) {
				return c;
			}
		}
	}

	public static getFirstInBattle(chars: Character[]): Character {
		for (let c of chars) {
			if (c.isInBattle) {
				return c;
			}
		}
	}

	/**
	 * 释放技能
	 */
	public cast(): void {

		let scene = SceneManager.Ins.curScene as BattleScene;

		// 如果游戏已经结束就不再释放
		if (scene.winnerCamp) {
			return;
		}

		// 如果释放者存在且无法释放
		if (this.caster && !(this.caster.alive && this.caster.isInBattle)) {
			return;
		}

		// 选择首要目标
		if (this.camp == CharCamp.Player) {
			this.manualChooseTarget();
		}
		else {
			this.autoChooseTarget();
		}

		// 判断技能是不是需要释放
		if (!this.needCast()) {
			return;
		}

		// 运行实际效果
		let affectResult = this.affect();
		// 将演出加到预演出列表
		this.preparePerformance();

		// 运行在在SkillToDo中的技能
		if (scene.castQue.length > 0) {
			scene.castQue.pop().cast();
		}

		scene.performStart();
	}

	/**
	 * 实际作用
	 */
	public affect(): void {

	};

	/**
	 * 准备演出演出表现内容
	 */
	private preparePerformance(): void {
		let self = this.caster;
		if (!self) {
			// 如果没有释放者，直接返回，以后可能还要加其他效果
			return;
		}
		let scene = SceneManager.Ins.curScene as BattleScene;
		let targets = this.targets;
		let selfCamp = self.camp;
		let enemiesNum = 0;
		let stageWidthHalf = LayerManager.Ins.stageWidth / 2;
		let minX = stageWidthHalf;
		let properEnemy: Character;
		for (let char of targets) {
			// chooce proper position
			if (char.camp != selfCamp) {
				enemiesNum++;
				let distance = Math.abs(char.x - stageWidthHalf);
				if (distance < minX) {
					properEnemy = char;
					minX = distance;
				}
			}
		}

		let isMove: boolean = false;
		if (enemiesNum == targets.length && enemiesNum > 0)
			isMove = true;

		let animEnd = () => {
			self.armatureDisplay.removeEventListener(
				dragonBones.EventObject.COMPLETE,
				animEnd,
				this
			);
			scene.onePerformEnd();
		}

		if (isMove) {
			// if need move, self move
			scene.performQue.push({
				performance: () => {
					egret.Tween.get(self).to({
						x: properEnemy.x + 100 * properEnemy.camp,
						y: properEnemy.y + 20
					}, 200).call(scene.onePerformEnd)
				}
			})
		}

		scene.performQue.push({
			// anim
			performance: () => {
				self.playDBAnim("attack1_+1", 1, "idle");
				self.armatureDisplay.addEventListener(
					dragonBones.EventObject.COMPLETE,
					animEnd,
					this
				);
			}
		});

		if (isMove) {
			// move back
			scene.performQue.push({
				performance: () => {
					let newP: { x: number, y: number } = self.getPositon();
					self.playDBAnim("idle", 0);
					egret.Tween.get(self).to({
						x: newP.x,
						y: newP.y
					}, 200).call(scene.onePerformEnd)
				}
			});
		}
	}

	/**
	 * 技能是否该释放
	 * 这里只要判断技能的目标效果就好，不用再判断释放者和胜利
	 * IManualSkill中的该方法仅适用于判定对单个目标造成伤害的类型的技能
	 * 走到这个函数说明技能已经释放出去了，已经消耗了能量，只是可能已经不需要产生作用了
	 */
	protected needCast(): boolean {
		for (let t of this.targets) {
			if (t.alive && t.isInBattle) {
				return true;
			}
		}
		return false;
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