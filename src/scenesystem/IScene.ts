/**
 * 每一个子类表征一个场景，子类需要复写initial，并在其中将statePool填满；
 * 最好采用一个enum来存储所有的scenestate
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
            this.state.unInitial();
        }
        // 解除与所有state的关系
        this.state = null;
		for (let k in this.statePool){
			this.statePool[k].release();
		}
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
			this.state.unInitial();
		}
		this.state = this.statePool[stateName];
		this.state.initial();
	}


}

/**
 * 每一个子类表征scene的一个状态
 * 
 */
abstract class ISceneState{

    // 当前所在场景
    protected scene: IScene;

	public constructor(scene: IScene){
		this.scene = scene;
	}
	
    /**
     * 状态进入前会先initial（每一次进入initial一遍）
     */
	public initial(): void{}

    /**
     * 每一帧调用一次
     */
    public update(){}

    /**
     * 更换状态前需要reset之前的状态（每一次更换为其他状态时调用一遍）
     */
	public unInitial(): void{}

    /**
     * 将this.scene置为null
     * 场景销毁时调用一遍
     */
	public release(): void{
		this.scene = null;
	}

}