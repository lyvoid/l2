class DamageFloatManager {
	private numberFloatPool: egret.TextField[];
	public constructor() {
		this.numberFloatPool = [];
	}

	public newFloat(char: Character, oldNum: number, newNum: number, prefix: string="hp"): egret.Tween {
		if (oldNum == newNum){
			return;
		}
		let numberFloatPool = this.numberFloatPool;
		let floatLabel: egret.TextField;
		if (numberFloatPool.length != 0){
			floatLabel = numberFloatPool.pop();
		}else{
			floatLabel = new egret.TextField();
		}
		let changeHp = newNum - oldNum;
		let sign = changeHp > 0 ? "+" : "-"
		floatLabel.textColor = changeHp > 0 ? 0x7CFC00 : 0xCD0000;
		floatLabel.text = `${prefix} ${sign}${Math.abs(changeHp)}`;
		char.addChild(floatLabel);
		floatLabel.y = -200;
		floatLabel.x = -30;
		floatLabel.alpha = 1;
		return egret.Tween.get(floatLabel).to({
			y: floatLabel.y - 100,
			alpha: 0
		}, 3000, egret.Ease.quadIn).call(
			()=>{
				char.removeChild(floatLabel);
				numberFloatPool.push(floatLabel);
			}
		);
	}
}