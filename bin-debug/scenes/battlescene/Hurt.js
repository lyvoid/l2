var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 表示一个伤害或治疗效果
 */
var Hurt = (function () {
    function Hurt(hurtType, fromChar, rate, isAbs, absValue, isPericeShield, isDoubleShield, isResurgence) {
        if (fromChar === void 0) { fromChar = null; }
        if (rate === void 0) { rate = 1; }
        if (isAbs === void 0) { isAbs = false; }
        if (absValue === void 0) { absValue = 10; }
        if (isPericeShield === void 0) { isPericeShield = false; }
        if (isDoubleShield === void 0) { isDoubleShield = false; }
        if (isResurgence === void 0) { isResurgence = false; }
        this.fromChar = fromChar;
        this.hurtType = hurtType;
        this.rate = rate;
        this.isAbs = isAbs;
        this.absValue = absValue;
        this.isPericeShield = isPericeShield;
        this.isDoubleShield = isDoubleShield;
        this.isResurgence = isResurgence;
    }
    Hurt.prototype.affect = function (target) {
        var aliveBefore = target.alive;
        var change = this.affectWithoutPerm(target);
        ;
        if (!change.aliveNew && this.isRemoveFromGameWhenDie) {
            target.isInBattle = false;
            change.isInBattleNew = false;
        }
        if (this.isRemoveFromGame) {
            target.isInBattle = false;
            change.isInBattleNew = false;
        }
        Hurt.statePerformance(change);
    };
    /**
     * 施加伤害，返回收到影响的属性列表
     */
    Hurt.prototype.affectWithoutPerm = function (target) {
        var mm = MessageManager.Ins;
        var targetAttr = target.attr;
        var harm = 0;
        var changeInfo = {
            char: target,
            shieldOld: targetAttr.shield,
            shieldNew: 0,
            hpOld: targetAttr.hp,
            hpNew: 0,
            aliveOld: target.alive,
            aliveNew: false,
            isInBattleOld: target.isInBattle,
            isInBattleNew: target.isInBattle
        };
        // 处理护甲
        if (this.isAbs) {
            harm = this.absValue;
        }
        else {
            var fromAttr = this.fromChar.attr;
            if (this.hurtType == HurtType.Pysic || this.hurtType == HurtType.Magic) {
                var ar = this.hurtType == HurtType.Pysic ? targetAttr.arPys : targetAttr.arMagic;
                ar -= fromAttr.pierceAr;
                ar = ar > 0 ? ar : 0;
                harm = fromAttr.ap - ar;
                harm = harm > 0 ? harm : (fromAttr.ap / 10);
            }
            else if (this.hurtType == HurtType.HealHp || this.hurtType == HurtType.HealShield) {
                harm = fromAttr.ap;
            }
        }
        // 处理倍率
        harm *= this.rate;
        harm = Math.floor(harm);
        var isAliveChange = false;
        // 处理治疗生命
        if (this.hurtType == HurtType.HealHp && (target.alive || this.isResurgence)) {
            isAliveChange = !target.alive;
            var newHp = targetAttr.hp + harm;
            newHp = newHp > targetAttr.maxHp ? targetAttr.maxHp : newHp;
            var healValue = newHp - targetAttr.hp;
            targetAttr.hp = newHp;
            mm.sendMessage(MessageType.HealHp, [this.fromChar, target, healValue]);
            // 发送复活信息
            if (isAliveChange) {
                mm.sendMessage(MessageType.Resurgence, target);
            }
            return Hurt.fullNewAttrToChange(changeInfo, target);
        }
        // 非治疗状态下，对已死亡单位无效
        if (!target.alive) {
            return Hurt.fullNewAttrToChange(changeInfo, target);
        }
        // 处理增加护盾
        if (this.hurtType == HurtType.HealShield) {
            var newShield = targetAttr.shield + harm;
            newShield = newShield > targetAttr.maxShield ? targetAttr.maxShield : newShield;
            var healValue = newShield - targetAttr.shield;
            targetAttr.shield = newShield;
            mm.sendMessage(MessageType.HealShield, [this.fromChar, target, healValue]);
            return Hurt.fullNewAttrToChange(changeInfo, target);
        }
        // 处理破盾
        if (targetAttr.shield > 0 && this.isDoubleShield) {
            harm *= 2;
        }
        // 处理最终增伤
        if (this.hurtType == HurtType.Magic) {
            harm = harm - targetAttr.magicDamageReduceAbs;
            harm = harm > 0 ? harm : 0;
            harm = harm * (1 - targetAttr.magicDamageReducePerc);
            harm = harm > 0 ? Math.ceil(harm) : 0;
        }
        else if (this.hurtType == HurtType.Pysic) {
            harm = harm - targetAttr.pysDamageReduceAbs;
            harm = harm > 0 ? harm : 0;
            harm = harm * (1 - targetAttr.pysDamageReducePerc);
            harm = harm > 0 ? Math.ceil(harm) : 0;
        }
        // 处理非穿盾
        var harmRemain = harm;
        if (!this.isPericeShield) {
            harmRemain = harm - targetAttr.shield;
            if (harmRemain <= 0) {
                targetAttr.shield = -harmRemain;
                mm.sendMessage(MessageType.HarmShield, [this.fromChar, target, harm]);
                return Hurt.fullNewAttrToChange(changeInfo, target);
            }
            mm.sendMessage(MessageType.HarmShield, [this.fromChar, target, targetAttr.shield]);
            targetAttr.shield = 0;
        }
        // 伤害到hp
        var newTargetHp = targetAttr.hp - harmRemain;
        // 生命归零，角色死亡
        if (newTargetHp <= 0) {
            newTargetHp = 0;
            isAliveChange = true;
            // 如果死亡那么shield也要归0
            targetAttr.shield = 0;
            // 发送角色死亡消息
            mm.sendMessage(MessageType.CharDie, target);
        }
        mm.sendMessage(MessageType.HarmHp, [this.fromChar, target, targetAttr.hp - newTargetHp]);
        targetAttr.hp = newTargetHp;
        return Hurt.fullNewAttrToChange(changeInfo, target);
    };
    /**
     * 辅助函数，把char中的属性填充到attrChange中
     */
    Hurt.fullNewAttrToChange = function (attrChange, char) {
        var newAttr = char.attr;
        attrChange.hpNew = newAttr.hp;
        attrChange.aliveNew = char.alive;
        attrChange.shieldNew = newAttr.shield;
        return attrChange;
    };
    /**
     * 状态表现
     * 对血量护盾复活死亡排除出游戏进行表现
     */
    Hurt.statePerformance = function (change) {
        var damageFloatManage = SceneManager.Ins.curScene.damageFloatManager;
        var target = change.char;
        if (change.shieldNew != change.shieldOld) {
            target.lifeBarShieldAnim(change.shieldNew);
            damageFloatManage.newFloat(target, change.shieldOld, change.shieldNew, "护盾");
        }
        if (change.hpOld != change.hpNew) {
            target.lifeBarAnim(change.hpNew).call(
            // 血条变化完之后如果此次人物还死亡了的话
            function () {
                if (change.aliveNew != change.aliveOld && !change.aliveNew) {
                    target.stopDBAnim();
                    SceneManager.Ins.curScene.filterManager.addGreyFilter(target.armatureDisplay);
                }
                if (change.isInBattleNew == false) {
                    // 如果扣血后移除
                    Hurt.removeFromGamePerform(target);
                }
            });
            // 飘字
            damageFloatManage.newFloat(target, change.hpOld, change.hpNew, "生命");
        }
        else if (change.isInBattleNew == false) {
            // 如果直接被排除出游戏
            Hurt.removeFromGamePerform(target);
        }
    };
    Hurt.removeFromGamePerform = function (target) {
        egret.Tween.get(target.armatureDisplay).to({
            alpha: 0
        }, 1000).call(function () {
            target.parent.removeChild(target);
        });
    };
    return Hurt;
}());
__reflect(Hurt.prototype, "Hurt");
/**
 * 伤害类型
 * 治疗生命于增加护盾必须于abs类型的伤害一起使用
 */
var HurtType;
(function (HurtType) {
    HurtType[HurtType["Pysic"] = 0] = "Pysic";
    HurtType[HurtType["Magic"] = 1] = "Magic";
    HurtType[HurtType["HealHp"] = 2] = "HealHp";
    HurtType[HurtType["HealShield"] = 3] = "HealShield"; // 增加护盾
})(HurtType || (HurtType = {}));
