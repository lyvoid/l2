var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var SceneManager = (function () {
    /**
     * 侦听enter_frame事件，绑定update函数
     * 侦听loadingfinish事件
     */
    function SceneManager() {
        var _this = this;
        MessageManager.Ins.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
        MessageManager.Ins.addEventListener(MessageType.SceneReleaseCompelete, function () {
            _this.curScene.initial();
        }, this);
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
        var oldScene = this.curScene;
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
