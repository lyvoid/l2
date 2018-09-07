class MainScene extends IScene{
    
    private _uiMain: UIMainScene;

    public async loadResource(){
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