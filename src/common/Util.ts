// TypeScript file
class Util{
    public static deleteObjFromList(ls:any[], obj:any): boolean{
        let index = ls.indexOf(obj);
        if(index >= 0){
            ls.splice(index, 1);
            return true;
        }
        return false;
    }
}