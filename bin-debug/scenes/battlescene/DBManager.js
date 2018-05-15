var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DBManager = (function () {
    function DBManager() {
        this.addedCharNames = [];
        this.egretFactory = new dragonBones.EgretFactory();
    }
    DBManager.prototype.getArmatureDisplay = function (charName, armatureName) {
        var egretFactory = this.egretFactory;
        if (this.addedCharNames.indexOf(charName) == -1) {
            var dragonbonesData = RES.getRes(charName + "_db_ske_json");
            var textureData = RES.getRes(charName + "_db_tex_json");
            var texture = RES.getRes(charName + "_db_tex_png");
            egretFactory.parseDragonBonesData(dragonbonesData);
            egretFactory.parseTextureAtlasData(textureData, texture);
            this.addedCharNames.push(charName);
            console.log("add " + charName);
        }
        return egretFactory.buildArmatureDisplay(armatureName || charName);
    };
    DBManager.prototype.release = function () {
        this.egretFactory = null;
        this.addedCharNames = null;
    };
    return DBManager;
}());
__reflect(DBManager.prototype, "DBManager");
