class ResAsyncLoadManager {
	private _loadResouceLs: MySet<string> = new MySet<string>();
	public getResAsync(resName:string): Promise<any>;
	public getResAsync(key: string, compFunc: RES.GetResAsyncCallback, thisObject: any): void;

	public getResAsync(resName, compFunc?, thisObject?) {
		this._loadResouceLs.add(resName);
		if (compFunc == null)
			return RES.getResAsync(resName);
		else {
			return RES.getResAsync(resName, compFunc, thisObject);
		}
	}

	public loadGroup(name: string, priority?: number, reporter?: RES.PromiseTaskReporter): void | Promise<void>{
		this._loadResouceLs.add(name);
		return RES.loadGroup(name, priority, reporter);
	}

	public getResAsyncAndSetValue(resName: string, attrName: string, thisObject: any){
		this.getResAsync(
			resName, 
			()=>{
				thisObject[attrName] = RES.getRes(resName);
			},
			thisObject
		);
	}

	public releaseResource(): void{
		for (let name of this._loadResouceLs.data){
			if (!RES.destroyRes(name)){
				console.warn(`RES \`${name}\` destroy failed.`);
			}
		}
	}

}