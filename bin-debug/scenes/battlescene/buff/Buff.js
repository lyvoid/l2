var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Buff = (function () {
    function Buff() {
        /// 属性加成内容
        // 属性加成 - ap arPys arMagic hp pierceAr shield
        // 减免物理伤害 10 10% 
        // 减免魔法伤害 10 10%
        // 受到物理伤害加重
        // 受到魔法伤害加重
        // 眩晕
        // 结算条件
        // 无条件
        // 某个buff达多少层
        // 死亡时
        /// 结算内容
        // 回血
        // 扣血
        // 复活
        // 死亡
        // 从游戏中排除
        // 剩余回合类型 按照结算次数  按照回合次数 同时
        /**
         * 剩余计数器，-1为永久
         * 在char所在的一方的回合开始阶段结算效果并-1 (结算时间点也可能放在其他地方)
         * 在char所在一方的回合结束阶段如果buff的持续时间为0则驱散
         */
        this.remainRound = -1;
        // 剩余效果次数
        this.remainAffect = -1;
        this.buffIcon = new egret.Bitmap(RES.getRes("bufficontest_png"));
        this.buffName = "狂暴";
    }
    Buff.prototype.attachToChar = function (target) {
    };
    Buff.prototype.affect = function () {
    };
    Buff.prototype.removeFromChar = function (target) {
    };
    // TODO: affect if need
    Buff.prototype.onCharStartPhase = function () {
    };
    // TODO: round-- and clear buff if needed
    Buff.prototype.onCharEndPhase = function () { };
    /**
     * 根据当前在charbuff列表中所处的位置，调整buffIcon的位置
     * 主要在删除buff的时候使用
     */
    Buff.prototype.adjustPosition = function () {
    };
    return Buff;
}());
__reflect(Buff.prototype, "Buff");
var BuffType;
(function (BuffType) {
    BuffType[BuffType["Normal"] = 0] = "Normal";
    BuffType[BuffType["Attack"] = 1] = "Attack";
})(BuffType || (BuffType = {}));
