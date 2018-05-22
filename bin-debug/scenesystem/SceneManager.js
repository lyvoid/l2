var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var SceneManager = (function () {
    /**
     * 侦听enter_frame事件，绑定update函数
     * 侦听SceneReleaseCompelete loadingfinish事件
     */
    function SceneManager() {
        MessageManager.Ins.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
    }
    Object.defineProperty(SceneManager, "Ins", {
        get: function () {
            if (SceneManager.instance) {
                return SceneManager.instance;
            }
            SceneManager.instance = new SceneManager();
            return SceneManager.instance;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 场景释放完成时自行调用
     */
    SceneManager.prototype.onSceneReleaseCompelete = function () {
        this.curScene.initial();
    };
    /**
     * 场景加载完成时自行调用
     */
    SceneManager.prototype.onSceneLoadingCompelete = function () {
        // 如果载入完成，载入层设置为不可见
        LayerManager.Ins.loadingLayer.visible = false;
        LayerManager.Ins.loadingLayer.unInitial();
    };
    /**
     * 设置初始场景
     */
    SceneManager.prototype.initial = function () {
        this.setScene(new BattleScene(this));
    };
    /**
     * 切换场景
     * 调用前一个场景的release（释放所有引用，准备销毁）
     * 及需要切换的场景的initial（切换场景一定是new出来的新场景）
     */
    SceneManager.prototype.setScene = function (scene) {
        LayerManager.Ins.loadingLayer.visible = true;
        LayerManager.Ins.loadingLayer.initial();
        var oldScene = this.curScene;
        // 先设置当前场景再释放场景，保证释放完毕时可以直接initial
        this.curScene = scene;
        if (oldScene != null) {
            oldScene.release();
        }
        else {
            scene.initial();
        }
    };
    /**
     * 游戏中所有的update都从这里入
     */
    SceneManager.prototype.update = function () {
        this.curScene.update();
    };
    return SceneManager;
}());
__reflect(SceneManager.prototype, "SceneManager");
