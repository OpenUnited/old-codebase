export interface SkillsAreaInterface {
    setSkills: Function
    allCategories: Category[]
    setExpertiseList: Function
    skillExpertise: SkillExpertise[]
    setSkillExpertise: Function
}

export interface Category {
    active: boolean,
    selectable: boolean,
    id: number,
    expertise: Expertise,
    name: string,
    children: Category[]
}

export interface Skill {
    category: string[],
    expertise: null | string[]
}

export interface Expertise {
    [key: string]: string[]
}

export interface SkillExpertise {
    skill: string
    expertise: string[]
}

export interface ExpertiseAreaInterface {
    skillExpertise: SkillExpertise[]
    setSkills: Function
    setExpertiseList: Function
    expertiseList: string[]
}