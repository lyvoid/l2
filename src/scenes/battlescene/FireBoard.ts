class FireBoard extends egret.DisplayObjectContainer{
	
	public fireNum: number = 0;
	public static maxFireNum: number = 10;
	private texture;
	private config;
	private particles:particle.ParticleSystem[] = [];

	public constructor() {
		super();
		this.y = LayerManager.Ins.stageHeight - 165;
		this.width = LayerManager.Ins.stageWidth;
		this.texture = RES.getRes("fireParticle_png");
        this.config = RES.getRes("fireParticle_json");
		for(let i=0; i < FireBoard.maxFireNum; i++){
			let sys = new particle.GravityParticleSystem(this.texture, this.config)
			sys.x = (i + 1) * 40;
			this.particles.push(sys);
			this.addChild(sys);
		}
		
	}

	public addFire(){
		if (this.fireNum < FireBoard.maxFireNum){
			this.particles[this.fireNum].start();
			this.fireNum += 1;
		}
	}

	public addFires(n:number): void{
		for (let i=0;i<n; i++){
			this.addFire();
		}
	}

	public removeFire(){
		if (this.fireNum > 0){
			this.particles[this.fireNum - 1].stop();
			this.fireNum -= 1;
		}
	}

	public removeFires(n: number):void{
		for (let i=0;i<n; i++){
			this.removeFire();
		}
	}

	public release(): void{
		this.texture = null;
		this.config = null;
		for (let p of this.particles){
			p.stop();
		}
		this.particles = null;
	}
	
}