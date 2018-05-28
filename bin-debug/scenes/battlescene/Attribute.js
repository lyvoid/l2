var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Attribute = (function () {
    function Attribute() {
        this.attrs = Object.create(Attribute.AttrsTemplate);
        this.attrsRaw = Object.create(Attribute.AttrsTemplate);
        this.attrsMul = Object.create(Attribute.AttrsTemplate);
        this.attrsAdd = Object.create(Attribute.AttrsTemplate);
        for (var i in this.attrs) {
            this.attrs[i] = 10;
            this.attrsRaw[i] = 10;
        }
        for (var _i = 0, _a = [AttrName.MagicDamageReduceAbs,
            AttrName.PysDamageReduceAbs]; _i < _a.length; _i++) {
            var i = _a[_i];
            this.attrs[i] = 0;
            this.attrsRaw[i] = 0;
        }
        for (var _b = 0, _c = [AttrName.MagicDamageReducePerc,
            AttrName.PysDamageReducePerc]; _b < _c.length; _b++) {
            var i = _c[_b];
            this.attrs[i] = 0;
            this.attrsRaw[i] = 0;
        }
    }
    Object.defineProperty(Attribute.prototype, "ap", {
        /**
         * 攻击
         */
        get: function () {
            return this.attrs[AttrName.Ap];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "arMagic", {
        /**
         * 魔法防御
         */
        get: function () {
            return this.attrs[AttrName.ArMagic];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "arPys", {
        /**
         * 物理防御
         */
        get: function () {
            return this.attrs[AttrName.ArPys];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "hp", {
        /**
         * 生命
         */
        get: function () {
            return this.attrs[AttrName.Hp];
        },
        /**
         * 设置生命
         */
        set: function (value) {
            this.attrs[AttrName.Hp] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "maxHp", {
        /**
         * 最大生命
         */
        get: function () {
            return this.attrs[AttrName.MaxHp];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "maxShield", {
        /**
         * 最大护盾
         */
        get: function () {
            return this.attrs[AttrName.MaxShield];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "pierceAr", {
        /**
         * 穿甲
         */
        get: function () {
            return this.attrs[AttrName.PierceAr];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "shield", {
        /**
         * 护盾
         */
        get: function () {
            return this.attrs[AttrName.Shield];
        },
        /**
         * 设置护盾
         */
        set: function (value) {
            this.attrs[AttrName.Shield] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "pysDamageReduceAbs", {
        /**
         * 物理伤害增加绝对值
         */
        get: function () {
            return this.attrs[AttrName.PysDamageReduceAbs];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "pysDamageReducePerc", {
        /**
         * 物理伤害增加相对值
         *
         * damage = (damage + abs) * (1 + perc)
         */
        get: function () {
            return this.attrs[AttrName.PysDamageReducePerc];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "magicDamageReduceAbs", {
        /**
         * 魔法伤害增加绝对值
         */
        get: function () {
            return this.attrs[AttrName.MagicDamageReduceAbs];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "magicDamageReducePerc", {
        /**
         * 魔法伤害增加相对值
         */
        get: function () {
            return this.attrs[AttrName.MagicDamageReducePerc];
        },
        enumerable: true,
        configurable: true
    });
    Attribute.prototype.setAttrAddition = function (attrName, value, type) {
        if (type == AttrAdditionType.ADD) {
            this.attrsAdd[attrName] += value;
        }
        else if (type == AttrAdditionType.MUL) {
            this.attrsMul[attrName] += value;
        }
        var newValue = this.attrsRaw[attrName] + this.attrsAdd[attrName];
        newValue = newValue > 0 ? newValue : 0;
        newValue *= 1 + this.attrsMul[attrName];
        newValue = newValue > 0 ? Math.ceil(newValue) : 0;
        this.attrs[attrName] = newValue;
        // if attr is maxshield or maxhp
        if (attrName == AttrName.MaxHp) {
            if (newValue <= 0) {
                newValue = 1;
            }
            if (newValue < this.hp) {
                this.attrs[AttrName.Hp] = newValue;
            }
        }
        if (attrName == AttrName.MaxShield) {
            if (newValue < this.shield) {
                this.attrs[AttrName.Shield] = newValue;
            }
        }
    };
    Attribute.prototype.toString = function () {
        return '' +
            ("\u751F\u547D:<font color=\"#7CFC00\">" + this.hp + "</font>/" + this.maxHp + "\n\u62A4\u76FE:<font color=\"#7CFC00\">" + this.shield + "</font>/" + this.maxShield + "\n\u653B\u51FB:<font color=\"#7CFC00\">" + this.ap + "</font>\n\u7269\u7406\u62A4\u7532:<font color=\"#7CFC00\">" + this.arPys + "</font>\n\u9B54\u6CD5\u62A4\u7532:<font color=\"#7CFC00\">" + this.arMagic + "</font>\n\u7A7F\u7532:<font color=\"#7CFC00\">" + this.pierceAr + "</font>");
    };
    // 属性模版
    Attribute.AttrsTemplate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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
    AttrName[AttrName["Hp"] = 6] = "Hp";
    AttrName[AttrName["Shield"] = 7] = "Shield";
    AttrName[AttrName["PysDamageReduceAbs"] = 8] = "PysDamageReduceAbs";
    AttrName[AttrName["PysDamageReducePerc"] = 9] = "PysDamageReducePerc";
    AttrName[AttrName["MagicDamageReduceAbs"] = 10] = "MagicDamageReduceAbs";
    AttrName[AttrName["MagicDamageReducePerc"] = 11] = "MagicDamageReducePerc";
})(AttrName || (AttrName = {}));
var AttrAdditionType;
(function (AttrAdditionType) {
    AttrAdditionType[AttrAdditionType["ADD"] = 0] = "ADD";
    AttrAdditionType[AttrAdditionType["MUL"] = 1] = "MUL";
})(AttrAdditionType || (AttrAdditionType = {}));
