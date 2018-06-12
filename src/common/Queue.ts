// TypeScript file
class Queue<T>{
    private data: T[] = [];

    public get length():number{
        return this.data.length;
    }

    public push(newElement:T){
        this.data.push(newElement);
    }

    public pop(): T{
        let data = this.data;
        if (data.length == 0){
            return null;
        }
        let output = data[0];
        data.splice(0, 1);
        return output;
    }

    public release(): void{
        this.data = null;
    }

}