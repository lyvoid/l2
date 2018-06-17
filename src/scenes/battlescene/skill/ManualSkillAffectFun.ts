function testSkillFuncAffect():void{
    let x = this as ManualSkill;
    console.log(x.skillName);
}

/**
 * 所有效果列表
 */
const SKAFFLS:{[key:string]:()=>void} = {
    testskillfunc: testSkillFuncAffect
}