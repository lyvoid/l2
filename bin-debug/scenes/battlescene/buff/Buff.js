var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Buff = (function () {
    function Buff() {
        this.layer = 1; //层数
        this.isHide = false; // 是否是隐藏buff
        this.isPassive = false; // 是否是被动
        this.isNormal = true; // 是否是普通buff
        this.isNegtive = false; // 是否是负面效果
        this.maxLayer = 1; // 最大得加层数
        this.isDeadRemove = true; // 是否对象死亡时移除
        this.layId = 0; // 叠加id，相同的叠加id在一起计算maxLayer
        this.remainRound = -1; // 剩余回合数，默认在归属单位的结束回合阶段--，-1表示无限
        // 状态
        this.isDiz = false; // 是否眩晕
        // 结算时机
        this.isAffect = false; // 是否具有结算效果
        this.remainAffectTime = -1; // 剩余结算次数，-1为无限
        this.attrsAdd = Object.create(Attribute.AttrsTemplate);
        this.attrsMul = Object.create(Attribute.AttrsTemplate);
        // TODO: 待删除的测试数据
        this.buffName = "狂暴";
        this.desc = "增加10点ap，每回合对自己造成5点伤害";
        this.attrsAdd[AttrName.Ap] = 10;
        this.isAffect = true;
        this.remainAffectTime = 2;
        this.affectPhase = BuffAffectPhase.TargetRoundStart;
        this.affectHurt = new Hurt(HurtType.Pysic, this.char, 1, true, 2);
        this.remainRound = -1;
    }
    Buff.prototype.attachToChar = function (target) {
        // 如果叠加层数到上限，且没有相同id的buff就return
        // 如果存在相同id，该buff刷新一下时间
        var allBuff = target.passiveSkills.concat(target.buffs).concat(target.hideBuffs);
        var sameBuff;
        var buffLayNum = 0;
        for (var _i = 0, allBuff_1 = allBuff; _i < allBuff_1.length; _i++) {
            var buff = allBuff_1[_i];
            if (buff.layId == this.layId) {
                buffLayNum += buff.layer;
            }
            if (buff.id == this.id) {
                sameBuff = buff;
            }
        }
        if (sameBuff) {
            sameBuff.remainRound = this.remainRound;
            sameBuff.remainAffectTime = this.remainAffectTime;
        }
        // 如果到了上限
        if (buffLayNum >= this.maxLayer) {
            return;
        }
        // add attr
        var attrAdd = this.attrsAdd;
        var attrMul = this.attrsMul;
        var targetAttr = target.attr;
        for (var attrId in attrAdd) {
            var index = parseInt(attrId);
            if (attrAdd[index] > 0) {
                targetAttr.setAttrAddition(index, attrAdd[attrId], AttrAdditionType.ADD);
            }
        }
        for (var attrId in attrMul) {
            var index = parseInt(attrId);
            if (attrMul[index] > 0) {
                targetAttr.setAttrAddition(index, attrMul[attrId], AttrAdditionType.MUL);
            }
        }
        // if have same buff id
        if (sameBuff) {
            sameBuff.layer += 1;
            return;
        }
        // if not have same id
        this.char = target;
        if (this.isHide) {
            target.hideBuffs.push(this);
        }
        if (this.isPassive) {
            target.passiveSkills.push(this);
        }
        if (this.isNormal) {
            target.buffs.push(this);
            this.buffIcon = new egret.Bitmap(RES.getRes("bufficontest_png"));
            var index = target.buffs.indexOf(this);
            target.buffLine.addChild(this.buffIcon);
            this.adjustIconPosition();
        }
        // TODO: if have effect, listen affect affectPhase
        if (this.isAffect) {
            if (this.affectPhase == BuffAffectPhase.TargetRoundStart) {
                var eType = MessageType.PlayerRoundStart;
                if (target.camp == CharCamp.Enemy) {
                    eType = MessageType.EnemyRoundStart;
                }
                MessageManager.Ins.addEventListener(eType, this.affect, this);
            }
        }
    };
    Buff.prototype.affect = function () {
        if (this.remainAffectTime > 0) {
            this.remainAffectTime = this.remainAffectTime - 1;
        }
        this.affectHurt.rate *= this.layer;
        this.affectHurt.affect(this.char);
        this.affectHurt.rate /= this.layer;
        // if affect times is 0
        if (this.remainAffectTime == 0) {
            this.removeFromChar();
        }
    };
    /**
     * 场景清空的时候也要调用该方法来保证资源释放
     */
    Buff.prototype.removeFromChar = function () {
        // 去除属性
        var attrAdd = this.attrsAdd;
        var attrMul = this.attrsMul;
        var target = this.char;
        var targetAttr = target.attr;
        for (var attrId in attrAdd) {
            var index = parseInt(attrId);
            if (attrAdd[index] > 0) {
                targetAttr.setAttrAddition(index, -attrAdd[attrId] * this.layer, AttrAdditionType.ADD);
            }
        }
        for (var attrId in attrMul) {
            var index = parseInt(attrId);
            if (attrMul[index] > 0) {
                targetAttr.setAttrAddition(index, -attrMul[attrId] * this.layer, AttrAdditionType.MUL);
            }
        }
        if (this.isNormal == true) {
            var buffs = this.char.buffs;
            target.buffLine.removeChild(this.buffIcon);
            Util.deleteObjFromList(buffs, this);
            for (var _i = 0, buffs_1 = buffs; _i < buffs_1.length; _i++) {
                var buff = buffs_1[_i];
                buff.adjustIconPosition();
            }
        }
        else if (this.isPassive == true) {
            Util.deleteObjFromList(target.passiveSkills, this);
        }
        else if (this.isHide == true) {
            Util.deleteObjFromList(target.hideBuffs, this);
        }
        // TODO: remove listen
        if (this.isAffect) {
            if (this.affectPhase == BuffAffectPhase.TargetRoundStart) {
                var eType = MessageType.PlayerRoundStart;
                if (target.camp == CharCamp.Enemy) {
                    eType = MessageType.EnemyRoundStart;
                }
                MessageManager.Ins.removeEventListener(eType, this.affect, this);
            }
        }
        console.log(this.id);
        console.log(this.char.hashCode);
        this.char = null;
        this.buffIcon = null;
    };
    Buff.prototype.onCharStartPhase = function () {
        if (this.isAffect && this.affectPhase == BuffAffectPhase.TargetRoundStart) {
            this.affect();
        }
    };
    Buff.prototype.onCharEndPhase = function () {
        if (this.remainRound > 0) {
            this.remainRound--;
        }
        if (this.remainRound == 0) {
            this.removeFromChar();
        }
    };
    Buff.prototype.adjustIconPosition = function () {
        var buffs = this.char.buffs;
        var index = buffs.indexOf(this);
        this.buffIcon.x = index * 12;
    };
    return Buff;
}());
__reflect(Buff.prototype, "Buff");
var BuffAffectPhase;
(function (BuffAffectPhase) {
    BuffAffectPhase[BuffAffectPhase["TargetRoundStart"] = 0] = "TargetRoundStart";
    BuffAffectPhase[BuffAffectPhase["BuffLayer"] = 1] = "BuffLayer";
    BuffAffectPhase[BuffAffectPhase["EnemyHarm"] = 2] = "EnemyHarm";
    BuffAffectPhase[BuffAffectPhase["SelfHarm"] = 3] = "SelfHarm";
    BuffAffectPhase[BuffAffectPhase["FriendHarm"] = 4] = "FriendHarm"; // 队友受伤
})(BuffAffectPhase || (BuffAffectPhase = {}));
var AffectCaseBuffTargetType;
(function (AffectCaseBuffTargetType) {
    AffectCaseBuffTargetType[AffectCaseBuffTargetType["AllFriends"] = 0] = "AllFriends";
    AffectCaseBuffTargetType[AffectCaseBuffTargetType["AllEnemies"] = 1] = "AllEnemies";
    AffectCaseBuffTargetType[AffectCaseBuffTargetType["AnyOneFriend"] = 2] = "AnyOneFriend";
    AffectCaseBuffTargetType[AffectCaseBuffTargetType["AnyOneEnemy"] = 3] = "AnyOneEnemy";
    AffectCaseBuffTargetType[AffectCaseBuffTargetType["Self"] = 4] = "Self"; // 自己
})(AffectCaseBuffTargetType || (AffectCaseBuffTargetType = {}));
