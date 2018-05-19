var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Attribute = (function () {
    function Attribute() {
        /**
         * 攻击
         */
        this.ap = 1000;
        /**
         * 物理防御
         */
        this.arPys = 60;
        /**
         * 魔法防御
         */
        this.arMagic = 60;
        /**
         * 最大生命
         */
        this.maxHp = 200;
        /**
         * 当前生命
         */
        this.hp = 200;
        /**
         * 穿甲
         */
        this.pierceAr = 2;
        /**
         * 护盾
         */
        this.shield = 20;
        /**
         * 最大护盾
         */
        this.maxShield = 100;
        /**
         * 是否存在游戏中
         */
        this.isInBattle = true;
    }
    Attribute.prototype.toString = function () {
        return '' +
            ("\u751F\u547D:" + this.hp + "/" + this.maxHp + "\n\u62A4\u76FE:" + this.shield + "/" + this.maxShield + "\n\u653B\u51FB:" + this.ap + "\n\u7269\u7406\u62A4\u7532:" + this.arPys + "\n\u9B54\u6CD5\u62A4\u7532:" + this.arMagic + "\n\u7A7F\u7532:" + this.pierceAr);
    };
    return Attribute;
}());
__reflect(Attribute.prototype, "Attribute");
