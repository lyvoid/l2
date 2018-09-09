class MainScene extends IScene{
    
    private _uiMain: UIMainScene;

    public async loadResource(){
        await RES.loadGroup("mainscenecommon", 0, LayerManager.Ins.loadingUI);
    }

    public initial(){
        let uiMain = new UIMainScene();
        LayerManager.Ins.uiLayer.addChild(uiMain);
        this._uiMain = uiMain;
    }
    
    public async releaseResource(){
    }

    public release(){
		  super.release();
          this._uiMain.release();
          this._uiMain = null;
    }
}