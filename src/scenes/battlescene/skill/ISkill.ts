abstract class ISkill {
	public caster: Charactor;
	public targetType: TargetType;
	public target: Charactor[];
	public fireNeed: number;
	public chooseTarget(): void {
		let scene = SceneManager.Ins.curScene as BattleScene;
		switch (this.targetType) {
			case TargetType.Self:
				this.target.push(this.caster);
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
					this.target.push(this.caster.randomTarget());
				}else{
					this.target.push(scene.selectEnemy);
				}
				break;
			case TargetType.SpecialFriend:
				if(this.caster.camp == CharCamp.enemy){
					this.target.push(this.caster.randomFriend());
				}else{
					this.target.push(scene.selectFriend);
				}
				break;
		}
	}
	abstract useSkill(): void;
}

enum TargetType {
	Self,
	AllFriend,
	AllEnemy,
	SpecialFriend,
	SpecialEnemy
}