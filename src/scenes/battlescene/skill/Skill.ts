class SkillTmp extends IManualSkill {
	public constructor(caster: Character) {
		super();
		this.targetType = TargetType.SpecialEnemy;
		this.fireNeed = 2;
		this.desc = "对指定单位造成攻击的伤害";
		this.caster = caster;
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
		}, 200);
		for (let char of this.targets) {
			if (!char.alive) {
				try {
					char.parent.removeChild(char);
				} catch (e) { }
			}
		}
	}

	public useSkill(): void {
		let fireboard = (SceneManager.Ins.curScene as BattleScene).playerFireBoard;
		for (let i = 0; i < this.fireNeed; i++) {
			fireboard.removeFire();
		}
		this.chooseTarget();
		for (let char of this.targets) {
			let ht = new Hurt();
			ht.hurtNumber = this.caster.attr.ap;
			ht.hurtType = HurtType.ABS;
			char.hurt(ht);
		}
		egret.Tween.get(this.caster).to({
			x: this.targets[0].x + 100 * this.targets[0].camp,
			y: this.targets[0].y + 20
		}, 200).call(

			() => {
				let t = this.targets[0];
				egret.Tween.get(t.lifeBar).to({
					width: 100 * (t.attr.chp / t.attr.mhp),
				}, 1000);
				this.caster.armatureDisplay.animation.play("attack1_+1", 1);
				this.caster.armatureDisplay.addEventListener(
					dragonBones.EventObject.COMPLETE,
					this.casterAniEnd,
					this
				);
			}
		)
	}
}