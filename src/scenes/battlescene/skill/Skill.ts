/**
 * 临时技能，单纯用来测试
 */
class SkillTmp extends IManualSkill {
	public constructor(caster: Character = null) {
		super();
		this.targetType = TargetType.SpecialEnemy;
		this.fireNeed = 2;
		this.desc = "对指定单位造成攻击的伤害";
		this.caster = caster;
	}

	public useSkill(): void {

		// 判断技能是不是需要释放
		this.manualChooseTarget();
		let target = this.targets[0];
		if (!target.alive) {
			return;
		}

		// 运行实际效果
		let affectResult = this.affect();

		// 确实需要释放时，将演出加到预演出列表
		let scene = SceneManager.Ins.curScene as BattleScene;
		scene.performQue.push([this, affectResult]);
		// 没次加入新的表现序列都调用一次应该是没错的
		MessageManager.Ins.sendMessage(MessageType.PerformanceChainStart);


		// 运行在在SkillToDo中的技能
		if (scene.skillTodoQue.length > 0) {
			scene.skillTodoQue.pop().useSkill();
		}
	}

	protected affect(): any {
		let hurt = new Hurt(HurtType.Pysic, this.caster);
		let affectResult: any[] = [];
		for (let char of this.targets) {
			let change = hurt.affect(char);
			affectResult.push([char, change]);
		}
		return affectResult;
	}


	public performance(affectResult: any): void {

		egret.Tween.get(this.caster).to({
			x: this.targets[0].x + 100 * this.targets[0].camp,
			y: this.targets[0].y + 20
		}, 200).call(

			() => {
				for (let result of affectResult) {
					let target: Character = result[0];
					let change: AttrChange = result[1];
					if (change.hp != null) {
						target.lifeBarAnim(change.hp).call(
							// 血条变化完之后如果此次人物还死亡了的话
							() => {
								if (!change.alive && change.isAliveChange) {
									target.addChild(new eui.Label("死亡"));
								}
							}
						);
					}

				}
				this.caster.armatureDisplay.animation.play("attack1_+1", 1);
				this.caster.armatureDisplay.addEventListener(
					dragonBones.EventObject.COMPLETE,
					this.casterAniEnd,
					this
				);
			}
			)
	}


	private casterAniEnd() {
		this.caster.armatureDisplay.removeEventListener(
			dragonBones.EventObject.COMPLETE,
			this.casterAniEnd,
			this
		);
		let newP: { x: number, y: number } = this.caster.getPositon();
		this.caster.armatureDisplay.animation.play("idle");
		egret.Tween.get(this.caster).to({
			x: newP.x,
			y: newP.y
		}, 200).call(
			() => MessageManager.Ins.sendMessage(MessageType.PerformanceEnd)
			);
	}

}