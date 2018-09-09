/**
 * scene life cycle:
 * constructor -> loadResource -> initial -> release -> releaseResource
 */
abstract class IScene{
    public state: ISceneState;

    /**
     * call by scenemanager when scene loaded
     */
    public async loadResource(){
    }

    /**
     * call by scenemanager when scene loaded (after loadResource)
     */
    public initial(){
    }
    
    /**
     * call before changing into other scene,
     * release resource in this function
     */
    public releaseResource(){
    }

    /**
     * call before changing into other scene,
     * release reference in this function
     */
    public release(){
        if (this.state){
            this.state.release();
            this.state = null;
        }
        LayerManager.Ins.clear();
        LongTouchUtil.clear();
        egret.Tween.removeAllTweens();
    }

    /**
     * call by every frame
     */
    public update(){
        if(this.state != null){
            this.state.update();
        }
    }

    /**
     * switch state
     */
	public setState(state: ISceneState){
		if (this.state != null){
			this.state.release();
		}
        this.state = state;
		this.state.initial();
	}

}