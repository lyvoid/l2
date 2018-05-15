var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var SceneManager = (function () {
    function SceneManager() {
    }
    Object.defineProperty(SceneManager, "Ins", {
        get: function () {
            if (SceneManager.instance) {
                return SceneManager.instance;
            }
            SceneManager.instance = new SceneManager();
            SceneManager.instance.initial();
            return SceneManager.instance;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 设置初始场景
     * 侦听enter_frame事件，绑定update函数
     */
    SceneManager.prototype.initial = function () {
        this.setScene(new BattleScene(this));
        MessageManager.Ins.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
    };
    /**
     * 切换场景
     * 调用前一个场景的release（释放所有引用，准备销毁）
     * 及需要切换的场景的initial（切换场景一定是new出来的新场景）
     */
    SceneManager.prototype.setScene = function (scene) {
        if (this.curScene != null) {
            this.curScene.release();
        }
        this.curScene = scene;
        scene.initial();
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
