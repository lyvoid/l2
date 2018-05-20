var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var PhaseUtil = (function () {
    function PhaseUtil() {
    }
    PhaseUtil.prototype.changePhaseWithDelay = function (phase, delay) {
        if (delay === void 0) { delay = 1000; }
        egret.setTimeout(this.changePhase, this, delay, phase);
    };
    PhaseUtil.prototype.changePhase = function (phase) {
        this.nextPhase = phase;
        var scene = SceneManager.Ins.curScene;
        if (!scene.isSkillPerforming) {
            // 如果不再演出中，直接跳到下一个状态
            scene.setState(phase);
        }
        else {
            // 如果正在演出
            // 侦听演出全部结束事件，全部结束也说明要切阶段了
            MessageManager.Ins.addEventListener(MessageType.SkillPerformAllEnd, this.onSkillPerformAllEnd, this);
        }
    };
    PhaseUtil.prototype.onSkillPerformAllEnd = function () {
        MessageManager.Ins.removeEventListener(MessageType.SkillPerformAllEnd, this.onSkillPerformAllEnd, this);
        SceneManager.Ins.curScene.setState(this.nextPhase);
    };
    PhaseUtil.prototype.clear = function () {
        MessageManager.Ins.removeEventListener(MessageType.SkillPerformAllEnd, this.onSkillPerformAllEnd, this);
    };
    return PhaseUtil;
}());
__reflect(PhaseUtil.prototype, "PhaseUtil");
