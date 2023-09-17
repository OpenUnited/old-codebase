import {Category, Expertise, Skill, SkillExpertise} from '../SkillsComponents/interfaces'

export interface ProfileType {
    id: string
    firstName: string
    bio: string
    avatar: string
    slug: string
    skills: any[]
    websites: Website[]
    websiteTypes: string[]
    preferences: Preference
}

export interface Product {
    name: string
    avatar: string
    link: string
}

export interface Initiative {
    name: string
    link: string
}

export interface DeliveryMessage {
    message: string
    attachments: Attachment[]
}

export interface Task {
    id: number
    title: string
    date: string
    link: string
    product: Product
    category: Category
    expertise: Expertise[]
    reviewerPerson: Reviewer
    initiative: Initiative
}

export interface Reviewer {
    id: string
    firstName: string
    avatar: string
    link: string
}

export interface Paginator {
    page: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
}

export interface EditProfileProps {
    profile: ProfileType
    setProfile: Function
    loginUrl: string
    registerUrl: string
}

export interface TaskDetailProps {
    task: Task
    modal: boolean
    setModal: Function
    personSlug: string | string[] | undefined
}

export interface ProfileProps {
    profile: ProfileType
    user: {
        id: string
    }
    refetchProfile: Function
    loginUrl: string
    registerUrl: string
}

export interface PagesBarProps {
    changePage: Function
    number: number
    active: number
    hasNext: boolean
    hasPrev: boolean
}

export interface PageButtonProps {
    number: number
    active: boolean
    changePage: Function
}

export interface ContributionsProps {
    tasks: Task[]
    changePage: Function
    pagesNumber: number
    activePage: number
    hasNext: boolean
    hasPrev: boolean
}

export interface Website {
    type: number
    website: string
}

export interface Attachment {
    path: string
    name: string
    type: string
}

export interface TaskDetailAttachmentsProps {
    attachments: Attachment[]
}

export interface TasksComponentProps {
    tasks: Task[]
    openTaskDetail: Function
}

export interface ExpertiseAreaInterface {
    setSkills: Function
    allCategories: Category[]
    skillExpertise: SkillExpertise[]
    expertiseList: string[]
    setExpertiseList: Function
    setSkillExpertise: Function
}

export interface SkillAreaInterface {
    skills: Skill[]
    setSkills: Function
}

export interface SkillsAreaInterface {
    setSkills: Function
    allCategories: Category[]
    setExpertiseList: Function
    skillExpertise: SkillExpertise[]
    setSkillExpertise: Function
}

export interface Preference {
    sendMeChallenges: boolean
}