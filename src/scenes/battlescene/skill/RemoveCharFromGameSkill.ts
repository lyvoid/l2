/**
 * 将目标从游戏中排除，该技能采用预设目标
 * 在构造的时候传入目标
 */
class RemoveCharFromGameSkill extends IManualSkill{
	public constructor(targets:Character[]) {
		super();
		this.targetType = TargetType.PreSet;
		this.targets = targets;
	}

	public affect(): any{
		for(let target of this.targets){
			target.attr.isInBattle = false;
		}
	}

	public performance(affectResult: any): void{
		for (let target of this.targets){
			target.parent.removeChild(target);
		}
		MessageManager.Ins.sendMessage(MessageType.PerformanceEnd);
	}

	public needCast():boolean{
		let target = this.targets[0];
		if (!target){
			return false;
		}
		if (!target.attr.isInBattle){
			return false;
		}
		return true;
	}

}