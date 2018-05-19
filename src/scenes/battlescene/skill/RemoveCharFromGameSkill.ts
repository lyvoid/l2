class RemoveCharFromGameSkill extends IManualSkill{
	public constructor(targets:Character[]) {
		super();
		this.targetType = TargetType.PreSet;
		this.targets = targets;
	}

	public affect(): any{
		let target = this.targets[0];
		target.attr.isInBattle = false;
	}

	public performance(affectResult: any): void{
		let target = this.targets[0];
		target.parent.removeChild(target);
		MessageManager.Ins.sendMessage(MessageType.PerformanceEnd)
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