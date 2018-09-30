class Util {

    // 防止被new
    private constructor() { }

    /**
     * 从一个Array中删除元素，如果确实属于ls返回true，否则返回false
     */
    public static removeObjFromArray(ls: any[], obj: any): boolean {
        let index = ls.indexOf(obj);
        if (index >= 0) {
            ls.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * 安全移除egret的子物体，防止父物体空错误
     */
    public static safeRemoveFromParent(element: any): void {
        if (!element) return;
        let p = element.parent;
        if (p) {
            p.removeChild(element);
        }
    }

    /**
     * 打乱输入的数组
     */
    public static getRandomArray(input: any[]): any[] {
        let output = [];
        let len = input.length;
        while (len > 0) {
            let index = Math.floor(Math.random() * len);
            if (index == len) {
                index -= 1;
            }
            output.push(input.splice(index, 1)[0]);
            len -= 1;
        }
        return output;
    }

    /**
     *  以bject中心作为中心不断做缩放
     */
    public static largeSmallTweenAnim(obj: any, widthRate: number, heightRate: number, cycleTime: number): void {
        let startX = obj.x;
        let startY = obj.y;
        let startWidth = obj.width;
        let startHeight = obj.height;
        let endWidth = startWidth * widthRate;
        let endHeight = startHeight * heightRate;
        let endX = startX - (endWidth - startWidth) / 2;
        let endY = startY - (endHeight - startHeight) / 2;
        egret.Tween.get(obj, {loop: true}).to({
            width: endWidth,
            height: endHeight,
            x: endX,
            y: endY
        }, cycleTime).to({
            width: startWidth,
            height: startHeight,
            x: startX,
            y: startY
        }, cycleTime);
    }
}