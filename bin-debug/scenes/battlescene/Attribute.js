var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Attribute = (function () {
    function Attribute() {
        /**
         * 攻击
         */
        this.ap = 1000;
        this.apRaw = 1000;
        this.apAdd = 0;
        this.apMul = 0;
        /**
         * 物理防御
         */
        this.arPys = 60;
        this.arPysRaw = 60;
        this.arPysAdd = 0;
        this.arPysMul = 0;
        /**
         * 魔法防御
         */
        this.arMagic = 60;
        this.arMagicRaw = 60;
        this.arMagicAdd = 0;
        this.arMagicMul = 0;
        /**
         * 最大生命
         */
        this.maxHp = 200;
        this.maxHpRaw = 200;
        this.maxHpAdd = 0;
        this.maxHpMul = 0;
        /**
         * 当前生命
         */
        this.hp = 200;
        /**
         * 穿甲
         */
        this.pierceAr = 2;
        this.pierceArRaw = 2;
        this.pierceArAdd = 0;
        this.pierceArMul = 0;
        /**
         * 护盾
         */
        this.shield = 20;
        /**
         * 最大护盾
         */
        this.maxShield = 100;
        this.maxShieldRaw = 100;
        this.maxShieldAdd = 0;
        this.maxShieldMul = 0;
    }
    Attribute.prototype.setAddAttrValue = function (attrName, value) {
        switch (attrName) {
            case AttrName.Ap:
                this.apAdd = value;
                this.ap = (this.apRaw + value) * (1 + this.apMul);
                break;
            case AttrName.ArMagic:
                this.arMagicAdd = value;
                this.arMagic = (this.arMagicRaw + value) * (1 + this.arMagicMul);
                break;
            case AttrName.ArPys:
                this.arPysAdd = value;
                this.arPys = (this.arPysRaw + value) * (1 + this.arPysMul);
                break;
            case AttrName.MaxHp:
                this.maxHpAdd = value;
                this.maxHp = (this.maxHpRaw + value) * (1 + this.maxHpMul);
                if (this.hp > this.maxHp) {
                    this.hp = this.maxHp;
                }
                break;
            case AttrName.MaxShield:
                this.maxShieldAdd = value;
                this.maxShield = (this.maxShieldRaw + value) * (1 + this.maxShieldMul);
                if (this.shield > this.maxShield) {
                    this.shield = this.maxShield;
                }
                break;
            case AttrName.PierceAr:
                this.pierceArAdd = value;
                this.pierceAr = (this.pierceArRaw + value) * (1 + this.pierceArMul);
                break;
        }
    };
    Attribute.prototype.setMulAttrValue = function (attrName, value) {
        switch (attrName) {
            case AttrName.Ap:
                this.apMul = value;
                this.ap = (this.apRaw + this.apAdd) * (1 + value);
                break;
            case AttrName.ArMagic:
                this.arMagicAdd = value;
                this.arMagic = (this.arMagicRaw + this.arMagicAdd) * (1 + value);
                break;
            case AttrName.ArPys:
                this.arPysMul = value;
                this.arPys = (this.arPysRaw + this.arPysAdd) * (1 + value);
                break;
            case AttrName.MaxHp:
                this.maxHpMul = value;
                this.maxHp = (this.maxHpRaw + this.maxHpAdd) * (1 + value);
                if (this.hp > this.maxHp) {
                    this.hp = this.maxHp;
                }
                break;
            case AttrName.MaxShield:
                this.maxShieldMul = value;
                this.maxShield = (this.maxShieldRaw + this.maxShieldAdd) * (1 + value);
                if (this.shield > this.maxShield) {
                    this.shield = this.maxShield;
                }
                break;
            case AttrName.PierceAr:
                this.pierceArMul = value;
                this.pierceAr = (this.pierceArRaw + this.pierceArAdd) * (1 + value);
                break;
        }
    };
    Attribute.prototype.toString = function () {
        return '' +
            ("\u751F\u547D:<font color=\"#7CFC00\">" + this.hp + "</font>/" + this.maxHp + "\n\u62A4\u76FE:<font color=\"#7CFC00\">" + this.shield + "</font>/" + this.maxShield + "\n\u653B\u51FB:<font color=\"#7CFC00\">" + this.ap + "</font>\n\u7269\u7406\u62A4\u7532:<font color=\"#7CFC00\">" + this.arPys + "</font>\n\u9B54\u6CD5\u62A4\u7532:<font color=\"#7CFC00\">" + this.arMagic + "</font>\n\u7A7F\u7532:<font color=\"#7CFC00\">" + this.pierceAr + "</font>");
    };
    return Attribute;
}());
__reflect(Attribute.prototype, "Attribute");
var AttrName;
(function (AttrName) {
    AttrName[AttrName["Ap"] = 0] = "Ap";
    AttrName[AttrName["MaxShield"] = 1] = "MaxShield";
    AttrName[AttrName["MaxHp"] = 2] = "MaxHp";
    AttrName[AttrName["ArMagic"] = 3] = "ArMagic";
    AttrName[AttrName["ArPys"] = 4] = "ArPys";
    AttrName[AttrName["PierceAr"] = 5] = "PierceAr";
})(AttrName || (AttrName = {}));
