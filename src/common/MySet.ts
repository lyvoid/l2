class MySet<T> {
    public data: T[] = [];
    public add(a: T): boolean{
        let data = this.data
        if (data.indexOf(a) >= 0)
            return false;
        data.push(a);
        return true;
    }

    public remove(a: T): boolean{
        return Util.removeObjFromArray(this.data, a);
    }

    public addList(a: any[]): void{
        for(let e of a){
            this.add(e);
        }
    }
}