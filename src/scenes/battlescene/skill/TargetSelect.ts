class TargetSelect {
    // info
    private _targetNum: number; // -1 means all
    private _allNum: number; // -1 means all
    private _priorType: TSPriorType; // sort prior
    private _isContFriend: boolean;
    private _isContEnemy: boolean;
    private _isContDead: boolean;
    private _isContAlive: boolean;
    private _isReverse: boolean;

    public initial(
        targetNum: number,
        allNum: number,
        priorType: TSPriorType,
        isContFriend: boolean,
        isContEnemy: boolean,
        isContDead: boolean,
        isContAlive: boolean,
        isReverse: boolean,
    ) {
        this._targetNum = targetNum;
        this._priorType = priorType;
        this._allNum = allNum;
        this._isContDead = isContDead;
        this._isContAlive = isContAlive;
        this._isContEnemy = isContEnemy;
        this._isContFriend = isContFriend;
        this._isReverse = isReverse;
    }

    /**
     * 选择所有备选目标
     * 
     */
    private selectAll(camp: CharCamp, caster: Character = null): Character[] {
        let allTargetsTmp1: Character[] = [];
        let scene = SceneManager.Ins.curScene as BattleScene;
        let enemies: Character[];
        let friends: Character[];
        if (camp == CharCamp.Enemy) {
            enemies = scene.mFriends;
            friends = scene.mEnemies;
        } else {
            enemies = scene.mEnemies;
            friends = scene.mFriends;
        }

        if (this._isContEnemy) {
            allTargetsTmp1 = allTargetsTmp1.concat(enemies);
        }
        if (this._isContFriend) {
            allTargetsTmp1 = allTargetsTmp1.concat(friends);
        }

        let allTargetsTmp2: Character[] = [];
        let isContDead = this._isContDead;
        let isContAlive = this._isContAlive;
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
                return this.getOrderValue(c1, camp, caster) - this.getOrderValue(c2, camp, caster);
            }
        );

        // 如果是逆序的话
        if (this._isReverse) {
            allTargetsTmp2.reverse();
        }
        if (this._allNum > 0) allTargetsTmp2 = allTargetsTmp2.slice(0, this._allNum);
        return allTargetsTmp2;
    }

    /**
     * 调用selectAll()
     * 选择allTargets的随机targetNum个放到targets里
     * 如果targetNum < 0 ，则放入所有的
     * （也就是说，如果 0 < targetNum < allNum; 就会存在一个随机
     */
    private select(camp: CharCamp, caster: Character = null): Character[] {
        let allTargets = this.selectAll(camp, caster);
        if (allTargets.length <= this._targetNum || this._targetNum < 0) {
            return allTargets;
        }

        let i = 0;
        let targets = [];
        let targetNum = this._targetNum;
        let tmp = Util.getRandomArray(allTargets);
        while (i < targetNum) {
            targets.push(allTargets[i]);
            i++;
        }
        return targets;
    }

    /**
     * get value of char in current priorType,
     */
    private getOrderValue(
        char: Character,
        camp: CharCamp,
        caster: Character = null
    ): number {
        let priorType = this._priorType;

        if (priorType == TSPriorType.Nothing) {
            return 0;
        }
        if (priorType == TSPriorType.Ap) {
            return char.mAttr.ap;
        }
        if (priorType == TSPriorType.Hp) {
            return char.mAttr.hp;
        }
        if (priorType == TSPriorType.Dis) {
            return char.x * camp;
        }
        if (priorType == TSPriorType.MaxHp) {
            return char.mAttr.maxHp;
        }
        if (priorType == TSPriorType.Select) {
            if (camp != CharCamp.Player) {
                return 0;
            }
            let scene = SceneManager.Ins.curScene as BattleScene;
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
    }

    private static _ins: TargetSelect = new TargetSelect();

	public static selectTarget(targetSelectId: number, camp: CharCamp, caster: Character = null): Character[] {
		let info = ConfigManager.Ins.mTargetSelectConfig[targetSelectId];
        let targetSelectIns = TargetSelect._ins;
		targetSelectIns.initial(
			info["targetNum"],
			info["allNum"],
			info["priorType"],
			info["isContFriend"],
			info["isContEnemy"],
			info["isContDead"],
			info["isContAlive"],
			info["isReverse"]
		);
		return targetSelectIns.select(camp, caster);
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
    Select,// 选定
    Self//自己
}
