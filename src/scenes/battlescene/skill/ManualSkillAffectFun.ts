function normalSkillAffect():void{
    let char = this.char as Character;
}

/**
 * 所有效果列表
 */
const SKAFLS:{[key:string]:()=>void} = {
    normal: normalSkillAffect
}