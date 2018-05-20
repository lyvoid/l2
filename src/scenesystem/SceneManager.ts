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
	 * 侦听loadingfinish事件
	 */
	private constructor(){
		MessageManager.Ins.addEventListener(
            egret.Event.ENTER_FRAME, 
            this.update, 
            this
        );
		MessageManager.Ins.addEventListener(
			MessageType.SceneReleaseCompelete,
			()=>{
				this.curScene.initial();
			},
			this
		);
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
		let oldScene = this.curScene;
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
