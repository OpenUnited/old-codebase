import {UploadFile} from "antd/es/upload/interface";
import {Category, Skill, Expertise, SkillExpertise} from "../SkillsComponents/interfaces";

export interface CreatePersonProps {
    modal: boolean
    closeModal: Function
}

export interface Person {
    firstName: string
    lastName: string
    bio: string
}

export interface AvatarUpload {
    open: boolean
    setOpen: Function
    fileList: UploadFile[]
    setFileList: Function
    upload: Function
}

export interface FirstStepProps {
    setStep: Function
    setAvatarId: Function
    avatarUrl: string
    setAvatarUrl: Function
    firstName: string
    setFirstName: Function
    lastName: string
    setLastName: Function
    bio: string
    setBio: Function
}

export interface SecondStepProps {
    submit: Function
    previous: Function
    setSkills: Function
    allCategories: Category[]
    allExpertises: string[]
    skillExpertise: SkillExpertise[]
    setSkillExpertise: Function
    skills: Skill[]
    sendMeChallenges: boolean
    setSendMeChallenges: Function
}

export interface StepSwitcherProps {
    first: boolean
    second: boolean
    step: number
}

export interface StepProps {
    step: number
    description: string
    valid: boolean
    current: boolean
}

export interface SkillsSelectProps {
    setSkills: Function
    allCategories: Category[]
    allExpertises: string[]
    skillExpertise: SkillExpertise[]
    setSkillExpertise: Function
    skills: Skill[]
}

export interface ExpertiseTableProps {
    setSkills: Function
    skillExpertise: SkillExpertise[]
    skills: Skill[]
}
