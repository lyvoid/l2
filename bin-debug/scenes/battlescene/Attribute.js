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
    }
    Attribute.prototype.toString = function () {
        return '' +
            ("\u751F\u547D:<font color=\"#7CFC00\">" + this.hp + "</font>/" + this.maxHp + "\n\u62A4\u76FE:<font color=\"#7CFC00\">" + this.shield + "</font>/" + this.maxShield + "\n\u653B\u51FB:<font color=\"#7CFC00\">" + this.ap + "</font>\n\u7269\u7406\u62A4\u7532:<font color=\"#7CFC00\">" + this.arPys + "</font>\n\u9B54\u6CD5\u62A4\u7532:<font color=\"#7CFC00\">" + this.arMagic + "</font>\n\u7A7F\u7532:<font color=\"#7CFC00\">" + this.pierceAr + "</font>");
    };
    return Attribute;
}());
__reflect(Attribute.prototype, "Attribute");
