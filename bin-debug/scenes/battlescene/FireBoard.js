var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var FireBoard = (function (_super) {
    __extends(FireBoard, _super);
    function FireBoard() {
        var _this = _super.call(this) || this;
        _this.fireNum = 0;
        _this.particles = [];
        _this.overflowFireNum = 0;
        _this.y = LayerManager.Ins.stageHeight - 165;
        _this.width = LayerManager.Ins.stageWidth;
        _this.texture = RES.getRes("fireParticle_png");
        _this.config = RES.getRes("fireParticle_json");
        for (var i = 0; i < FireBoard.maxFireNum + FireBoard.maxOverflowFireNum; i++) {
            var sys = new particle.GravityParticleSystem(_this.texture, _this.config);
            sys.x = (i + 1) * 40;
            _this.particles.push(sys);
            _this.addChild(sys);
        }
        _this.timeOutHandles = [];
        return _this;
    }
    FireBoard.prototype.addFire = function () {
        var _this = this;
        if (this.fireNum < FireBoard.maxFireNum) {
            this.particles[this.fireNum].start();
            this.fireNum += 1;
            var scene = SceneManager.Ins.curScene;
            var fireNumLabel = scene.battleUI.fireNumLabel;
            fireNumLabel.text = this.fireNum + "/" + FireBoard.maxFireNum;
            if (this.fireNum == FireBoard.maxFireNum) {
                fireNumLabel.textColor = 0xFF0000;
            }
            else {
                fireNumLabel.textColor = 0xADFF2F;
            }
        }
        else if (this.overflowFireNum < FireBoard.maxOverflowFireNum) {
            var index_1 = FireBoard.maxFireNum + this.overflowFireNum;
            this.particles[index_1].start();
            this.overflowFireNum += 1;
            var to_1 = egret.setTimeout(function () {
                _this.particles[index_1].stop();
                Util.deleteObjFromList(_this.timeOutHandles, to_1);
                egret.clearTimeout(to_1);
                _this.overflowFireNum -= 1;
            }, this, 300);
            this.timeOutHandles.push(to_1);
        }
    };
    FireBoard.prototype.addFires = function (n) {
        for (var i = 0; i < n; i++) {
            this.addFire();
        }
    };
    FireBoard.prototype.removeFire = function () {
        if (this.fireNum > 0) {
            this.particles[this.fireNum - 1].stop();
            this.fireNum -= 1;
            var scene = SceneManager.Ins.curScene;
            var fireNumLabel = scene.battleUI.fireNumLabel;
            fireNumLabel.text = this.fireNum + "/" + FireBoard.maxFireNum;
            fireNumLabel.textColor = 0xADFF2F;
        }
    };
    FireBoard.prototype.removeFires = function (n) {
        for (var i = 0; i < n; i++) {
            this.removeFire();
        }
    };
    FireBoard.prototype.release = function () {
        this.texture = null;
        this.config = null;
        for (var _i = 0, _a = this.particles; _i < _a.length; _i++) {
            var p = _a[_i];
            p.stop();
        }
        this.particles = null;
        for (var _b = 0, _c = this.timeOutHandles; _b < _c.length; _b++) {
            var i = _c[_b];
            egret.clearTimeout(i);
        }
    };
    FireBoard.maxFireNum = 10;
    FireBoard.maxOverflowFireNum = 4;
    return FireBoard;
}(egret.DisplayObjectContainer));
__reflect(FireBoard.prototype, "FireBoard");
