/**
 * 临时技能，单纯用来测试
 */
class SkillTmp extends IManualSkill {
	public constructor(caster: Character = null, camp:CharCamp = CharCamp.Neut) {
		super(caster, camp);
		this.targetType = TargetType.AllEnemy;
		this.fireNeed = 1;
		this.desc = "对敌方全体造成1*攻击的物理伤害，如果目标死亡则将其从游戏中排除";
	}

	protected affect(): any {
		let hurt = new Hurt(HurtType.Pysic, this.caster);
		let affectResult: any[] = [];
		for (let char of this.targets) {
			let change = hurt.affect(char);
			affectResult.push(change);
			if (!char.alive){
				this.scene.skillTodoQue.push(new RemoveCharFromGameSkill([char]));
			}
		}
		return affectResult;
	}


	public performance(affectResult: any): void {
		let damageFloatManage = (SceneManager.Ins.curScene as BattleScene).damageFloatManager;
		egret.Tween.get(this.caster).to({
			x: this.targets[0].x + 100 * this.targets[0].camp,
			y: this.targets[0].y + 20
		}, 200).call(
			() => {
				IManualSkill.statePerformance(affectResult);
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

