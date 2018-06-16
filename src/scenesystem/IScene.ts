/**
 * 每一个子类表征一个场景，子类需要复写initial，并在其中将statePool填满；
 */
abstract class IScene{
    // 场景切换管理器
    public sceneManager: SceneManager;
    // 当前场景状态
    public state: ISceneState;
    // 当前场景拥有的所有状态
    protected statePool: {[key:number]: ISceneState} = {};

    public constructor(sceneManager: SceneManager){
        this.sceneManager = sceneManager;
    }

    /**
     * 只会调用一次，在场景new完并作为当前场景前调用
     * 子类需要复写initial，并在其中将statePool填满
     */
    public initial(){
    }

    /**
     * 场景销毁前调用，需要释放所有的引用；
     * super的方法中解除了statePool中的资源占用，同时清空了Layer中的所有内容（除了loadinglayer外）
     */
    public release(){
        if (this.state){
            this.state.release();
        }
        // 解除与所有state的关系
        this.state = null;
        this.statePool = null;

        // 删除除了载入界面以外其他的所有层
        let layer = LayerManager.Ins
        layer.gameLayer.removeChildren();
        layer.uiLayer.removeChildren();
        layer.popUpLayer.removeChildren();
		layer.maskLayer.removeChildren();

        // 长按功能清理
        LongTouchUtil.clear();
        egret.Tween.removeAllTweens();
    }

    /**
     * 每一帧调用
     */
    public update(){
        if(this.state != null){
            this.state.update();
        }
    }

    /**
     * 切换状态
     * uninitial此前的状态，并initial新的状态
     */
	public setState(stateName:number){
		if (this.state != null){
			this.state.release();
		}
		this.state = this.statePool[stateName];
		this.state.initial(this);
	}


}


abstract class ISceneState{

    protected scene: IScene;
	
	public initial(scene: IScene): void{
        this.scene = scene;
    }

    public update(){}

	public release(): void{
		this.scene = null;
	}

}