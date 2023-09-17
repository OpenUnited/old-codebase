
export interface Skill {
    id: number,
    active: boolean,
    selectable: boolean,
    name: string,
    children: Skill[]
}

export interface Expertise {
    id: number,
    selectable: boolean,
    skill: number,
    name: string,
    children: Expertise[]
}

export interface BountySkill {
    id: number,
    skill: Skill,
    expertise: null | Expertise[],
    points: number,
    status: number,
    is_active: boolean
}

