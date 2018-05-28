/**
 * 临时技能，单纯用来测试
 */
class SkillOneDamageWithOut extends IManualSkill {
	public constructor(caster: Character = null, camp:CharCamp = CharCamp.Neut) {
		super(caster, camp);
		this.targetType = TargetType.SpecialEnemy;
		this.fireNeed = 2;
		this.skillName = "鹰击";
		this.desc = "对敌方单体造成1*攻击的物理伤害，如果目标死亡则将其从游戏中排除";
	}

	protected affect(): any {
		let scene = SceneManager.Ins.curScene as BattleScene;
		let hurt = new Hurt(HurtType.Pysic, this.caster);
		hurt.isRemoveFromGameWhenDie = true;
		let affectResult: any[] = [];
		for (let char of this.targets) {
			hurt.affect(char);
		}
	}


	public performance(): void {
		let damageFloatManage = (SceneManager.Ins.curScene as BattleScene).damageFloatManager;
		egret.Tween.get(this.caster).to({
			x: this.targets[0].x + 100 * this.targets[0].camp,
			y: this.targets[0].y + 20
		}, 200).call(
			() => {
				this.caster.playDBAnim("attack1_+1", 1, "idle");
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
		this.caster.playDBAnim("idle", 0);
		egret.Tween.get(this.caster).to({
			x: newP.x,
			y: newP.y
		}, 200).call(
			() => {	
				(SceneManager.Ins.curScene as BattleScene).onePerformEnd();
			}
		);
	}

}

