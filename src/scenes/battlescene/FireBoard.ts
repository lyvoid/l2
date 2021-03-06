class FireBoard extends egret.DisplayObjectContainer {

	public mFireNum: number = 0;
	public static maxFireNum: number = 10;
	private static _maxOverflowFireNum: number = 4;
	private _particles: particle.ParticleSystem[] = [];
	private _timeOutHandles: number[] = []; // 主要为了方便timeout的释放

	public constructor() {
		super();
		this.y = LayerManager.Ins.stageHeight - 200;
		this.width = LayerManager.Ins.stageWidth;
		let texture = RES.getRes("fireParticle_png");
		let config = RES.getRes("fireParticle_json");
		for (let i = 0; i < FireBoard.maxFireNum + FireBoard._maxOverflowFireNum; i++) {
			let sys = new particle.GravityParticleSystem(texture, config)
			sys.x = (i + 1) * 40 + 50;
			this._particles.push(sys);
			this.addChild(sys);
		}
	}

	private _overflowFireNum: number = 0; // 当前溢出的数量
	public addFire() {
		if (this.mFireNum < FireBoard.maxFireNum) {
			this._particles[this.mFireNum].start();
			this.mFireNum += 1;
			let scene = SceneManager.Ins.curScene as BattleScene;
			scene.mBattleUI.fireNum = this.mFireNum;
		} else if (this._overflowFireNum < FireBoard._maxOverflowFireNum) {
			let index = FireBoard.maxFireNum + this._overflowFireNum;
			this._particles[index].start();
			this._overflowFireNum += 1;
			let to = egret.setTimeout(
				() => {
					this._particles[index].stop();
					Util.removeObjFromArray(this._timeOutHandles, to);
					egret.clearTimeout(to);
					this._overflowFireNum -= 1;
				},
				this,
				300
			);
			this._timeOutHandles.push(to);
		}
	}

	public addFires(n: number): void {
		for (let i = 0; i < n; i++) {
			this.addFire();
		}
	}

	public removeFire() {
		if (this.mFireNum > 0) {
			this._particles[this.mFireNum - 1].stop();
			this.mFireNum -= 1;
			let scene = SceneManager.Ins.curScene as BattleScene;
			scene.mBattleUI.fireNum = this.mFireNum;
		}
	}

	public removeFires(n: number): void {
		for (let i = 0; i < n; i++) {
			this.removeFire();
		}
	}

	public release(): void {
		for (let p of this._particles) {
			p.stop();
		}
		this._particles = null;
		for (let i of this._timeOutHandles) {
			egret.clearTimeout(i);
		}
		this.removeChildren();
	}

}