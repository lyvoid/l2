class ConfigManager{
	private static _instance: ConfigManager;

	public static get Ins(): ConfigManager{
		if (this._instance == null){
			this._instance = new ConfigManager();
		}
		return this._instance;
	}

    private constructor(){}

    public mSkillConfig;
    public mHurtConfig;
    public mBuffConfig;
	public mTargetSelectConfig;
	public mCharConfig;

    public initial(): void{
		this.mSkillConfig = RES.getRes("skill_json");
		this.mBuffConfig = RES.getRes("buff_json");
		this.mHurtConfig = RES.getRes("hurt_json");
		this.mTargetSelectConfig = RES.getRes("target_select_json");
		this.mCharConfig = RES.getRes("char_json");
    }
    
}