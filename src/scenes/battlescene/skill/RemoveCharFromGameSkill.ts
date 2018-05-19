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