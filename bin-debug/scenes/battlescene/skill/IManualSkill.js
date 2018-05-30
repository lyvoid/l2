var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 表示一个非被动技能（被动技能触发的一些效果也是通过主动技能来实现）
 * manualChooseTarget 手动选择目标规则
 * autoChooseTarget  自动选择目标规则
 * useSkill 调用技能（一般不用重写）
 * affect 实际施加效果（强制实现）
 * performance 表现效果（强制实现）结束时需要注意要发送MessageType.PerformanceEnd消息，不然会阻塞其他演出
 * needCast 是否需要释放
 */
var IManualSkill = (function () {
    function IManualSkill(caster, camp) {
        if (caster === void 0) { caster = null; }
        if (camp === void 0) { camp = CharCamp.Neut; }
        this.isPerformance = true;
        this.caster = caster;
        this.camp = caster ? caster.camp : camp;
        this.setCampChar();
    }
    /**
     * 获取该阵营对应的敌我双方信息
     */
    IManualSkill.prototype.setCampChar = function () {
        var scene = SceneManager.Ins.curScene;
        if (this.camp == CharCamp.Enemy) {
            // 如果是敌方单位，对应的敌我双方刚好相反
            this.enemies = scene.friends;
            this.friends = scene.enemies;
        }
        else {
            // 如果中立统一看成我方施法
            this.enemies = scene.enemies;
            this.friends = scene.friends;
        }
    };
    /**
     * 根据目标类型，填充目标容器（主要目标）
     * 这里选出的目标会在玩家手动模式释放卡牌的时候使用
     * 最好重写
     */
    IManualSkill.prototype.manualChooseTarget = function () {
        var scene = SceneManager.Ins.curScene;
        switch (this.targetType) {
            case TargetType.PreSet:
                break;
            case TargetType.Self:
                this.targets = [this.caster];
                break;
            case TargetType.AllAliveFriend:
                this.targets = IManualSkill.getAllAliveChar(this.friends);
                break;
            case TargetType.AllAliveEnemy:
                this.targets = IManualSkill.getAllAliveChar(this.enemies);
                break;
            case TargetType.SpecialEnemy:
                this.targets = [scene.selectedEnemy];
                break;
            case TargetType.SpecialFriend:
                this.targets = [scene.selectedFriend];
                break;
            case TargetType.NoTarget:
                this.targets = [];
                break;
            case TargetType.All:
                this.targets = this.enemies.concat(this.friends);
                break;
        }
    };
    IManualSkill.getAllAliveChar = function (input) {
        var ls = [];
        for (var _i = 0, input_1 = input; _i < input_1.length; _i++) {
            var c = input_1[_i];
            if (c.alive && c.isInBattle) {
                ls.push(c);
            }
        }
        return ls;
    };
    /**
     * 这里选出的目标主要用在自动模式下
     * 敌方的所有选择均使用这个
     */
    IManualSkill.prototype.autoChooseTarget = function () {
        this.manualChooseTarget();
        switch (this.targetType) {
            case TargetType.SpecialEnemy:
                var fe = IManualSkill.getFirstAlive(this.enemies);
                this.targets = fe ? [fe] : [];
                break;
            case TargetType.SpecialFriend:
                var ff = IManualSkill.getFirstAlive(this.friends);
                this.targets = ff ? [ff] : [];
                break;
        }
    };
    ;
    IManualSkill.getFirstAlive = function (chars) {
        for (var _i = 0, chars_1 = chars; _i < chars_1.length; _i++) {
            var c = chars_1[_i];
            if (c.alive && c.isInBattle) {
                return c;
            }
        }
    };
    IManualSkill.getFirstInBattle = function (chars) {
        for (var _i = 0, chars_2 = chars; _i < chars_2.length; _i++) {
            var c = chars_2[_i];
            if (c.isInBattle) {
                return c;
            }
        }
    };
    /**
     * 释放技能
     */
    IManualSkill.prototype.cast = function () {
        var scene = SceneManager.Ins.curScene;
        // 如果游戏已经结束就不再释放
        if (scene.winnerCamp) {
            return;
        }
        // 如果释放者存在且无法释放
        if (this.caster && !(this.caster.alive && this.caster.isInBattle)) {
            return;
        }
        // 选择首要目标
        if (this.camp == CharCamp.Player) {
            this.manualChooseTarget();
        }
        else {
            this.autoChooseTarget();
        }
        // 判断技能是不是需要释放
        if (!this.needCast()) {
            return;
        }
        // 运行实际效果
        var affectResult = this.affect();
        // 确实需要释放时，将演出加到预演出列表
        scene.performQue.push([this, affectResult]);
        // 没次加入新的表现序列都调用一次应该是没错的
        scene.performStart();
        // 运行在在SkillToDo中的技能
        if (scene.castQue.length > 0) {
            scene.castQue.pop().cast();
        }
    };
    /**
     * 实际作用
     * 返回的any中存放需要表现的效果的一些参数（比如哪些人被打了多少伤害等等）
     * 这个值会扔给performance使用，只要同一个skill的affect的返回值和performance
     * 能够接上返回什么格式都可以
     */
    IManualSkill.prototype.affect = function () {
    };
    ;
    /**
     * 演出表现
     */
    IManualSkill.prototype.performance = function (affectResult) {
        if (!this.isPerformance) {
            // 如果技能不需要表现，直接发送表现结束
            SceneManager.Ins.curScene.onePerformEnd();
            return;
        }
    };
    ;
    /**
     * 技能是否该释放
     * 这里只要判断技能的目标效果就好，不用再判断释放者和胜利
     * IManualSkill中的该方法仅适用于判定对单个目标造成伤害的类型的技能
     * 走到这个函数说明技能已经释放出去了，已经消耗了能量，只是可能已经不需要产生作用了
     */
    IManualSkill.prototype.needCast = function () {
        for (var _i = 0, _a = this.targets; _i < _a.length; _i++) {
            var t = _a[_i];
            if (t.alive && t.isInBattle) {
                return true;
            }
        }
        return false;
    };
    IManualSkill.prototype.release = function () {
        this.caster = null;
        this.targets = null;
        this.friends = null;
        this.enemies = null;
    };
    return IManualSkill;
}());
__reflect(IManualSkill.prototype, "IManualSkill");
var TargetType;
(function (TargetType) {
    TargetType[TargetType["Self"] = 0] = "Self";
    TargetType[TargetType["AllAliveFriend"] = 1] = "AllAliveFriend";
    TargetType[TargetType["AllAliveEnemy"] = 2] = "AllAliveEnemy";
    TargetType[TargetType["SpecialFriend"] = 3] = "SpecialFriend";
    TargetType[TargetType["SpecialEnemy"] = 4] = "SpecialEnemy";
    TargetType[TargetType["NoTarget"] = 5] = "NoTarget";
    TargetType[TargetType["All"] = 6] = "All";
    TargetType[TargetType["PreSet"] = 7] = "PreSet"; //提前设置好的
})(TargetType || (TargetType = {}));
