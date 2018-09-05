class SceneManager{

	public curScene: IScene;
	private static _instance: SceneManager;

	private constructor(){
		MessageManager.Ins.addEventListener(
            egret.Event.ENTER_FRAME, 
            this.update, 
            this
        );
	}

	public static get Ins():SceneManager{
		if(SceneManager._instance){
			return SceneManager._instance;
		}
		SceneManager._instance = new SceneManager();
		return SceneManager._instance;
	}

	/**
	 * 设置初始场景
	 */
	public initial(){
		this.setScene(new BattleScene());
	}

	/**
	 * switch scene
	 */
	public setScene(scene: IScene){
		LayerManager.Ins.showLoadingUILayer();
		let oldScene = this.curScene;
		this.curScene = scene;
		if (oldScene != null){
			oldScene.release(); // release variable in memory
			// release resource(asyn), and then load current scene
			oldScene.releaseResource().then(()=>{this.loadCurScene()});
		} else {
			this.loadCurScene();
		}
	}

	/**
	 * call when scene load;
	 * loading resource (async) of the scene;
	 * and then initializing the scene, 
	 * finally removing loadingUILayer (onSceneLoadingCompelete)
	 */
	private loadCurScene(): void{
		this.curScene.loadResource().then(
			()=>{
				this.curScene.initial();
				this.onSceneLoadingCompelete();
			}
		);
	}

	/**
	 * call after scene loading compelete
	 */
	private onSceneLoadingCompelete(): void{
		LayerManager.Ins.hideLoadingUILayer();
	}

	/**
	 * call by every frame
	 */
	private update(){
		this.curScene.update();
	}

}
