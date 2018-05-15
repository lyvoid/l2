var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 战斗场景通用资源统一放在这里
 */
var BattleCR = (function () {
    function BattleCR() {
        var selfSelectTex = RES.getRes("selfSelectChar_png");
        var enemySelectTex = RES.getRes("enemySelectChar_png");
        var selfSelectImg = new egret.Bitmap(selfSelectTex);
        selfSelectImg.x = -selfSelectImg.width / 2;
        selfSelectImg.y = -selfSelectImg.height / 2;
        var enemySlectImg = new egret.Bitmap(enemySelectTex);
        enemySlectImg.x = selfSelectImg.x;
        enemySlectImg.y = selfSelectImg.y;
        this.selfSelectImg = selfSelectImg;
        this.enemySlectImg = enemySlectImg;
        this.touchGlow = new TouchGlowManager();
    }
    BattleCR.prototype.release = function () {
        this.selfSelectImg = null;
        this.enemySlectImg = null;
        this.touchGlow.release();
        this.touchGlow = null;
    };
    return BattleCR;
}());
__reflect(BattleCR.prototype, "BattleCR");
