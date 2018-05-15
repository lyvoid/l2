class DBManager {
	private egretFactory: dragonBones.EgretFactory;
	private addedCharNames: string[] = [];
	public constructor() {
		this.egretFactory = new dragonBones.EgretFactory();
	}

	public getArmatureDisplay(charName:string, armatureName?:string): dragonBones.EgretArmatureDisplay{
		let egretFactory = this.egretFactory;
		if (this.addedCharNames.indexOf(charName) == -1){
			let dragonbonesData = RES.getRes(`${charName}_db_ske_json`);  
			let textureData = RES.getRes(`${charName}_db_tex_json`);  
			let texture = RES.getRes(`${charName}_db_tex_png`);
			egretFactory.parseDragonBonesData(dragonbonesData);  
			egretFactory.parseTextureAtlasData(textureData, texture);
			this.addedCharNames.push(charName);
			console.log(`add ${charName}`);
			
		}
		return egretFactory.buildArmatureDisplay(armatureName || charName);
	}

	public release(){
		this.egretFactory = null;
		this.addedCharNames = null;
	}


}