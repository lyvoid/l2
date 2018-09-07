class ConfigManager{
	private static _instance: ConfigManager;

	public static get Ins(): ConfigManager{
		if (this._instance == null){
			this._instance = new ConfigManager();
		}
		return this._instance;
	}

    public mSkillConfig;
    public mHurtConfig;
    public mBuffConfig;
	public mTargetSelectConfig;
	public mCharConfig;
	public mBattleConfig;
	public mBattleEnemyConfig;

    public initial(): void{
		this.mSkillConfig = RES.getRes("skill_json");
		this.mBuffConfig = RES.getRes("buff_json");
		this.mHurtConfig = RES.getRes("hurt_json");
		this.mTargetSelectConfig = RES.getRes("target_select_json");
		this.mCharConfig = RES.getRes("char_json");
		this.mBattleConfig = RES.getRes("battle_json");
		this.mBattleEnemyConfig = RES.getRes("battle_enemy_json");
    }
    
}