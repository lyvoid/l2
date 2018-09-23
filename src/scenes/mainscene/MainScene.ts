class MainScene extends IScene {

    private _uiMain: UIMainScene;
    public mRsLoader: ResAsyncLoadManager = new ResAsyncLoadManager();

    public async loadResource() {
        await this.mRsLoader.loadGroup("mainscenecommon", 0, LayerManager.Ins.loadingUI);
    }

    public initial() {
        let uiMain = new UIMainScene();
        this._uiMain = uiMain;
    }

    public async releaseResource() {
    }

    public release() {
        this._uiMain.release();
        this._uiMain = null;
        this.mRsLoader.releaseResource();
    }
}