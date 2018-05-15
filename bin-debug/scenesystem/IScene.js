var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 每一个子类表征一个场景，子类需要复写initial，并在其中将statePool填满；
 * 最好采用一个enum来存储所有的scenestate
 */
var IScene = (function () {
    function IScene(sceneManager) {
        // 当前场景拥有的所有状态
        this.statePool = {};
        this.sceneManager = sceneManager;
    }
    /**
     * 只会调用一次，在场景new完并作为当前场景前调用
     * 子类需要复写initial，并在其中将statePool填满
     */
    IScene.prototype.initial = function () {
    };
    /**
     * 场景销毁前调用，需要释放所有的引用；
     * super的方法中解除了statePool中的资源占用，同时清空了Layer中的所有内容（除了loadinglayer外）
     */
    IScene.prototype.release = function () {
        // 解除与所有state的关系
        this.state = null;
        for (var k in this.statePool) {
            this.statePool[k].release();
        }
        this.statePool = null;
        // 删除除了载入界面以外其他的所有层
        var layer = LayerManager.Ins;
        layer.gameLayer.removeChildren();
        layer.uiLayer.removeChildren();
    };
    /**
     * 每一帧调用
     */
    IScene.prototype.update = function () {
        if (this.state != null) {
            this.state.update();
        }
    };
    /**
     * 切换状态
     * reset此前的状态，并initial新的状态
     */
    IScene.prototype.setState = function (stateName) {
        if (this.state != null) {
            this.state.uninitial();
        }
        this.state = this.statePool[stateName];
        this.state.initial();
    };
    return IScene;
}());
__reflect(IScene.prototype, "IScene");
/**
 * 每一个子类表征scene的一个状态
 * release中将this.scene置为null
 */
var ISceneState = (function () {
    function ISceneState(scene) {
        this.scene = scene;
    }
    /**
     * 状态进入前会先initial（每一次进入initial一遍）
     */
    ISceneState.prototype.initial = function () { };
    /**
     * 每一帧调用一次
     */
    ISceneState.prototype.update = function () { };
    /**
     * 更换状态前需要reset之前的状态（每一次更换为其他状态时调用一遍）
     */
    ISceneState.prototype.uninitial = function () { };
    /**
     * 将this.scene置为null
     * 场景销毁时调用一遍
     */
    ISceneState.prototype.release = function () {
        this.scene = null;
    };
    return ISceneState;
}());
__reflect(ISceneState.prototype, "ISceneState");
