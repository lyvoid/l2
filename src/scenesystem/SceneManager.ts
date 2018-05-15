class SceneManager{

	public curScene: IScene;

	private static instance: SceneManager;
	public static get Ins():SceneManager{
		if(SceneManager.instance){
			return SceneManager.instance;
		}
		SceneManager.instance = new SceneManager();
		SceneManager.instance.initial();
		return SceneManager.instance;
	}

	private constructor(){}

	/**
	 * 设置初始场景
	 * 侦听enter_frame事件，绑定update函数
	 */
	public initial(){
		this.setScene(new BattleScene(this));
		MessageManager.Ins.addEventListener(
            egret.Event.ENTER_FRAME, 
            this.update, 
            this
        );
	}

	/**
	 * 切换场景
	 * 调用前一个场景的release（释放所有引用，准备销毁）
	 * 及需要切换的场景的initial（切换场景一定是new出来的新场景）
	 */
	public setScene(scene: IScene){
		if (this.curScene != null){
			this.curScene.release();
		}
		this.curScene = scene;
		scene.initial();
	}

	/**
	 * 游戏中所有的update都从这里入
	 */
	public update(){
		this.curScene.update();
	}

}
