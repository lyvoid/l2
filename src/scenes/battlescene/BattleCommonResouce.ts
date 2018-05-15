/**
 * 战斗场景通用资源统一放在这里
 */
class BattleCR {

	public selfSelectImg: egret.Bitmap;
	public enemySlectImg: egret.Bitmap;
	public touchGlow: TouchGlowManager;

	public constructor() {
		let selfSelectTex = RES.getRes("selfSelectChar_png");
		let enemySelectTex = RES.getRes("enemySelectChar_png");
		let selfSelectImg = new egret.Bitmap(selfSelectTex);
		selfSelectImg.x = -selfSelectImg.width / 2;
		selfSelectImg.y = -selfSelectImg.height / 2;
		let enemySlectImg = new egret.Bitmap(enemySelectTex);
		enemySlectImg.x = selfSelectImg.x;
		enemySlectImg.y = selfSelectImg.y;
		this.selfSelectImg = selfSelectImg;
		this.enemySlectImg = enemySlectImg;
		this.touchGlow = new TouchGlowManager();
	}

	public release() {
		this.selfSelectImg = null;
		this.enemySlectImg = null;
		this.touchGlow.release();
		this.touchGlow = null;
	}
}