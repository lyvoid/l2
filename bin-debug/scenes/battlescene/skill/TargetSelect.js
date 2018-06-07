var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var TargetSelect = (function () {
    function TargetSelect() {
    }
    TargetSelect.prototype.initial = function (targetNum, allNum, priorType, isContFriend, isContEnemy, isContDead, isContAlive, isReverse) {
        this._targetNum = targetNum;
        this._priorType = priorType;
        this._allNum = allNum;
        this._isContDead = isContDead;
        this._isContAlive = isContAlive;
        this._isContEnemy = isContEnemy;
        this._isContFriend = isContFriend;
        this._isReverse = isReverse;
    };
    /**
     * 选择所有备选目标，在玩家长按卡牌时，用该方法选中需要闪烁的目标
     *
     */
    TargetSelect.prototype.selectAll = function (camp, caster) {
        var _this = this;
        if (caster === void 0) { caster = null; }
        var allTargetsTmp1 = [];
        var scene = SceneManager.Ins.curScene;
        var enemies;
        var friends;
        if (camp == CharCamp.Enemy) {
            enemies = scene.mFriends;
            friends = scene.mEnemies;
        }
        else {
            enemies = scene.mEnemies;
            friends = scene.mFriends;
        }
        if (this._isContEnemy) {
            allTargetsTmp1 = allTargetsTmp1.concat(enemies);
        }
        if (this._isContFriend) {
            allTargetsTmp1 = allTargetsTmp1.concat(friends);
        }
        var allTargetsTmp2 = [];
        var isContDead = this._isContDead;
        var isContAlive = this._isContAlive;
        for (var _i = 0, allTargetsTmp1_1 = allTargetsTmp1; _i < allTargetsTmp1_1.length; _i++) {
            var char = allTargetsTmp1_1[_i];
            if (!char.isInBattle) {
                // 如果已经被排除出游戏外，直接跳过
                continue;
            }
            if (char.alive && isContAlive) {
                allTargetsTmp2.push(char);
            }
            if ((!char.alive) && isContDead) {
                allTargetsTmp2.push(char);
            }
        }
        // 按照优先排序
        allTargetsTmp2.sort(function (c1, c2) {
            return _this.getOrderValue(c1, camp, caster) - _this.getOrderValue(c2, camp, caster);
        });
        // 如果是逆序的话
        if (this._isReverse) {
            allTargetsTmp2.reverse();
        }
        return allTargetsTmp2;
    };
    /**
     * 调用selectAll()
     * 选择allTargets的随机targetNum个放到targets里
     * 如果targetNum < 0 ，则放入所有的
     * （也就是说，如果 0 < targetNum < allNum; 就会存在一个随机
     */
    TargetSelect.prototype.select = function (camp, caster) {
        if (caster === void 0) { caster = null; }
        var allTargets = this.selectAll(camp, caster);
        if (allTargets.length <= this._targetNum || this._targetNum < 0) {
            return allTargets;
        }
        var i = 0;
        var targets = [];
        var targetNum = this._targetNum;
        var tmp = Util.getRandomArray(allTargets);
        while (i < targetNum) {
            targets.push(allTargets[i]);
            i++;
        }
        return targets;
    };
    /**
     * get value of char in current priorType,
     */
    TargetSelect.prototype.getOrderValue = function (char, camp, caster) {
        if (caster === void 0) { caster = null; }
        var priorType = this._priorType;
        if (priorType == TSPriorType.Nothing) {
            return 0;
        }
        if (priorType == TSPriorType.Ap) {
            return char.attr.ap;
        }
        if (priorType == TSPriorType.Hp) {
            return char.attr.hp;
        }
        if (priorType == TSPriorType.Dis) {
            return char.x * camp;
        }
        if (priorType == TSPriorType.MaxHp) {
            return char.attr.maxHp;
        }
        if (priorType == TSPriorType.Select) {
            if (camp != CharCamp.Player) {
                return 0;
            }
            var scene = SceneManager.Ins.curScene;
            if (scene.mSelectedChar == char) {
                return 100;
            }
            return 0;
        }
        if (priorType == TSPriorType.Self) {
            if (char === caster) {
                return 100;
            }
            return 0;
        }
    };
    return TargetSelect;
}());
__reflect(TargetSelect.prototype, "TargetSelect");
/**
 * 目标选取优先类型
 */
var TSPriorType;
(function (TSPriorType) {
    TSPriorType[TSPriorType["Hp"] = 0] = "Hp";
    TSPriorType[TSPriorType["MaxHp"] = 1] = "MaxHp";
    TSPriorType[TSPriorType["Dis"] = 2] = "Dis";
    TSPriorType[TSPriorType["Ap"] = 3] = "Ap";
    TSPriorType[TSPriorType["Nothing"] = 4] = "Nothing";
    TSPriorType[TSPriorType["Select"] = 5] = "Select";
    TSPriorType[TSPriorType["Self"] = 6] = "Self"; //自己
})(TSPriorType || (TSPriorType = {}));
