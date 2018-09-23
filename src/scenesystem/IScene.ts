/**
 * scene life cycle:
 * constructor -> loadResource -> initial -> defaultRelease -> release -> releaseResource
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
     * call before release
     * dont override this until you know what you are doing
     */
    public defaultRelease(){
        if (this.state){
            this.state.release();
            this.state = null;
        }
        egret.Tween.removeAllTweens();
		LayerManager.Ins.clear();
    }

    /**
     * call before changing into other scene,
     * release reference in this function
     */
    public release(){
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