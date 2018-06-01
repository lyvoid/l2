class SkillTargetSelectStrategy {
    public strategies: ((sp: SkillSelectParam) => Character[])[];

    private self(sp: SkillSelectParam): Character[] {
        return [sp.self];
    }

    private preset(sp: SkillSelectParam): Character[] {
        return sp.targets;
    }

    private noTarget(sp: SkillSelectParam): Character[] {
        return [];
    }

    private all(sp: SkillSelectParam): Character[] {
        return sp.friends.concat(sp.enemies);
    }

    private allAlive(sp: SkillSelectParam): Character[] {
        return SkillTargetSelectStrategy.getAllAlive(
            sp.friends.concat(sp.enemies));
    }

    private allAliveEnemy(sp: SkillSelectParam): Character[] {
        return SkillTargetSelectStrategy.getAllAlive(
            sp.enemies
        );
    }

    private allAliveFriend(sp: SkillSelectParam): Character[] {
        return SkillTargetSelectStrategy.getAllAlive(
            sp.friends
        );
    }

    private allEnemy(sp: SkillSelectParam): Character[] {
        return sp.enemies;
    }

    private allFriend(sp: SkillSelectParam): Character[] {
        return sp.friends;
    }

    private (sp: SkillSelectParam): Character[] {
        return sp.friends;
    }

    public static getAllAlive(chars: Character[]): Character[] {
        let aliveChars = [];
        for (let char of chars) {
            if (char.alive) {
                aliveChars.push(char);
            }
        }
        return aliveChars;
    }

    public constructor() {
        let strats: (
            (sp: SkillSelectParam) => Character[]
        )[] = [];
        strats[SkillSelectType.Self] = this.self;
        strats[SkillSelectType.PreSet] = this.preset;
        strats[SkillSelectType.All] = this.all;
        strats[SkillSelectType.NoTarget] = this.noTarget;
        strats[SkillSelectType.AllAliveEnemy] = this.allAliveEnemy;
        strats[SkillSelectType.AllAliveFriend] = this.allAliveFriend;

        this.strategies = strats;
    }


}

interface SkillSelectParam {
    self: Character,
    friends: Character[],
    enemies: Character[],
    targets: Character[],
    selectEnemy: Character,
    selectFriend: Character
}

enum SkillSelectType {
    Self,// 自己
    AllAliveFriend, // 友方存活全体
    AllAliveEnemy, // 敌方存活全体
    SpecialFriend, // 选定的我方
    SpecialEnemy, // 选定的敌方
    NoTarget, // 无目标
    All,// 所有
    PreSet//提前设置好的
}