function normalSkillAffect():void{
    let char = this.char as Character;
}

/**
 * 所有效果列表
 */
const SKAFFLS:{[key:string]:()=>void} = {
    normal: normalSkillAffect
}