class TargetSelect {
    private targetNum: number; // 目标数量 -1 表示所有
    private allNum: number; // 所有备选者 -1 表示包含所有
    private priorType: TSPriorType;
    private isContFriend: boolean;
    private isContEnemy: boolean;
    private isContDead: boolean;
    private isContAlive: boolean;
    private isReverse: boolean;

    private self: Character;
    private friends: Character[];
    private enemies: Character[];
    private selectFriend: Character;
    private selectEnemy: Character;

    public allTargets: Character[];// 所有的待选择者
    public targets: Character[];// 最终选择出来的目标

    public constructor(
        targetNum: number, allNum: number,
        priorType: TSPriorType,
        targetOrder: TSOrder,
        isContFriend: boolean,
        isContEnemy: boolean,
        isContDead: boolean,
        isContAlive: boolean,
        isReverse: boolean
    ) {
        this.targetNum = targetNum;
        this.priorType = priorType;
        this.allNum = allNum;
        this.isContDead = isContDead;
        this.isContAlive = isContAlive;
        this.isContEnemy = isContEnemy;
        this.isContFriend = isContFriend;
        this.isReverse = isReverse;
    }


    public setCampChar(self: Character, friends: Character[], enemies: Character[]): void {
        this.self = self;
        this.friends = friends;
        this.enemies = enemies;
    }

    /**
     * 选择所有备选目标，在玩家长按卡牌时，用该方法选中需要闪烁的目标
     * 
     */
    public selectAll(): void {
        let allTargetsTmp1: Character[] = [];
        if (this.isContEnemy) {
            allTargetsTmp1 = allTargetsTmp1.concat(this.enemies);
        }
        if (this.isContFriend) {
            allTargetsTmp1 = allTargetsTmp1.concat(this.friends);
        }

        let allTargetsTmp2: Character[] = [];
        let isContDead = this.isContDead;
        let isContAlive = this.isContAlive;
        for (let char of allTargetsTmp1) {
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
        allTargetsTmp2.sort(
            (c1: Character, c2: Character): number => {
                return this.getOrderValue(c1) - this.getOrderValue(c2);
            }
        );

        // 如果是逆序的话
        if (this.isReverse){
            allTargetsTmp2.reverse();
        }

        this.allTargets = allTargetsTmp2;
    }

    /**
     * 调用selectAll()
     * 选择allTargets的随机targetNum个放到targets里
     * 如果targetNum < 0 ，则放入所有的
     * （也就是说，如果 0 < targetNum < allNum; 就会存在一个随机
     */
    public select(): void {
        this.selectAll();
        let allTargets = this.allTargets;

        if (allTargets.length <= this.targetNum || this.targetNum < 0) {
            this.targets = allTargets;
            return;
        }

        let i = 0;
        let targets = [];
        let targetNum = this.targetNum;
        let tmp = Util.getRandomArray(this.allTargets);
        while (i < targetNum) {
            targets.push(allTargets[i]);
            i++;
        }
        this.targets = targets;
    }

    public release() {
        this.allTargets = null;
        this.targets = null;
        this.friends = null;
        this.enemies = null;
    }

    // 获取排序时用的对比值
    private getOrderValue(char: Character): number {
        let priorType = this.priorType;

        // 如果没有优先顺序，就按照距离来算
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
            return Math.abs(char.x - this.self.x);
        }
        if (priorType == TSPriorType.MaxHp) {
            return char.attr.maxHp;
        }
        if (priorType == TSPriorType.SelectEnemy || priorType == TSPriorType.SelectFriend) {
            if (this.self.camp != CharCamp.Player) {
                // 如果不是玩家阵营，就不用区分选不选中的问题
                return 0;
            }

            // 以下为是玩家阵营时的情况
            let scene = SceneManager.Ins.curScene as BattleScene;
            let selectEnemy = scene.selectedEnemy;
            let selectFriend = scene.selectedFriend;
            if (char === selectEnemy && priorType == TSPriorType.SelectEnemy) {
                return 100;
            }
            if (char === selectFriend && priorType == TSPriorType.SelectFriend) {
                return 100;
            }
            return 0;
        }
        if (priorType == TSPriorType.Self) {
            if (char === this.self) {
                return 100;
            }
            return 0;
        }
    }

}

/**
 * 目标选取优先类型
 */
enum TSPriorType {
    Hp,// 当前生命
    MaxHp,// 最大生命
    Dis,// 距离
    Ap,// 伤害
    Nothing,// 没有优先
    SelectFriend,// 选定
    SelectEnemy,// 选定敌方
    Self//自己
}

/**
 * 目标选择顺序
 */
enum TSOrder {
    Pos,// 正序
    Reverse,// 倒序
    Random//随机
}
