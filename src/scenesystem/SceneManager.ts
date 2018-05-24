class SceneManager{

	public curScene: IScene;

	private static instance: SceneManager;
	public static get Ins():SceneManager{
		if(SceneManager.instance){
			return SceneManager.instance;
		}
		SceneManager.instance = new SceneManager();
		return SceneManager.instance;
	}

	/**
	 * 侦听enter_frame事件，绑定update函数
	 * 侦听SceneReleaseCompelete loadingfinish事件
	 */
	private constructor(){
		MessageManager.Ins.addEventListener(
            egret.Event.ENTER_FRAME, 
            this.update, 
            this
        );
	}

	/**
	 * 场景释放完成时自行调用
	 */
	public onSceneReleaseCompelete(): void{
		this.curScene.initial();
	}


	/**
	 * 场景加载完成时自行调用
	 * （去除loadingLayer的遮挡）
	 */
	public onSceneLoadingCompelete(): void{
		// 如果载入完成，载入层设置为不可见
		LayerManager.Ins.loadingLayer.visible = false;
		LayerManager.Ins.loadingLayer.unInitial();
	}

	/**
	 * 设置初始场景
	 */
	public initial(){
		this.setScene(new BattleScene(this));
	}

	/**
	 * 切换场景
	 * 调用前一个场景的release（释放所有引用，准备销毁）
	 * 及需要切换的场景的initial（切换场景一定是new出来的新场景）
	 */
	public setScene(scene: IScene){
		LayerManager.Ins.loadingLayer.visible = true;
		LayerManager.Ins.loadingLayer.initial();
		let oldScene = this.curScene;
		// 先设置当前场景再释放场景，保证释放完毕时可以直接initial
		this.curScene = scene;
		if (oldScene != null){
			oldScene.release();
		} else {
			scene.initial();
		}
	}

	/**
	 * 游戏中所有的update都从这里入
	 */
	public update(){
		this.curScene.update();
	}

}
