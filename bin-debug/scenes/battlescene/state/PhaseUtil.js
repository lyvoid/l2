var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var PhaseUtil = (function () {
    function PhaseUtil() {
    }
    PhaseUtil.changePhaseWithDelay = function (phase, delay) {
        if (delay === void 0) { delay = 1000; }
        egret.setTimeout(PhaseUtil.changePhase, PhaseUtil, delay, phase);
    };
    PhaseUtil.changePhase = function (phase) {
        PhaseUtil.nextPhase = phase;
        var scene = SceneManager.Ins.curScene;
        if (!scene.isSkillPerforming) {
            // 如果不再演出中，直接跳到下一个状态
            scene.setState(phase);
        }
        else {
            // 如果正在演出
            // 侦听演出全部结束事件，全部结束也说明要切阶段了
            MessageManager.Ins.addEventListener(MessageType.SkillPerformAllEnd, PhaseUtil.onSkillPerformAllEnd, PhaseUtil);
        }
    };
    PhaseUtil.onSkillPerformAllEnd = function () {
        MessageManager.Ins.removeEventListener(MessageType.SkillPerformAllEnd, PhaseUtil.onSkillPerformAllEnd, PhaseUtil);
        SceneManager.Ins.curScene.setState(PhaseUtil.nextPhase);
    };
    return PhaseUtil;
}());
__reflect(PhaseUtil.prototype, "PhaseUtil");
