import React, {useEffect, useState} from "react";
// @ts-ignore
import styles from "./FormInput.scss";
import {message, TreeSelect} from "antd";
import {useQuery} from "@apollo/react-hooks";
import {GET_CATEGORIES_LIST} from "../../graphql/queries";
import {TreeNode} from "antd/lib/tree-select";
import {Skill} from "../CreatePersonModal";


interface SkillsAreaInterface {
    skills: Skill[]
    setSkills: Function
}

interface Category {
    active: boolean,
    selectable: boolean,
    id: number,
    expertise: Expertise,
    name: string,
    children: Category[]
}

interface Expertise {
    [key: string]: string[]
}

interface SkillExpertise {
    skill: string,
    expertise: Expertise
}

const SkillsArea = ({skills, setSkills}: SkillsAreaInterface) => {
    const [focus, setFocus] = useState(false);
    const [focused, setFocused] = useState(false);
    const [expertiseList, setExpertiseList] = useState<string[]>([]);
    const labelClass = focus ? `${styles.label} ${styles.labelfloat}` : (focused ? (`${styles.labelfilled} ${styles.label}`) : (`${styles.label}`));
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [skillExpertise, setSkillExpertise] = useState<SkillExpertise[]>([]);
    const {data: categories} = useQuery(GET_CATEGORIES_LIST);

    useEffect(() => {
        if (categories?.taskCategoryListing) {
            setAllCategories(JSON.parse(categories.taskCategoryListing));
        }
    }, [categories]);

    const categorySelectChange = (value: string) => {
        if (!checkCategoryExists(value)) {
            const skill = findCategory(allCategories, value);
            if (skill) {
                const newSkill = {
                    category: skill.name,
                    expertise: null
                };
                const newSkillExpertise = {
                    skill: skill.name,
                    expertise: skill.expertise
                }
                setSkills((prevState: Skill[]) => [...prevState, newSkill]);
                setSkillExpertise(prevState => [...prevState, newSkillExpertise]);
                setExpertiseList(prevState => [...prevState, skill.name]);
                message.success("Please select expertise for this category", 10).then();
            }
        }
    }

    const expertiseSelectChange = (skill: string, value: string, index: number) => {
        setSkills((prevState: Skill[]) => {
            const newValue = prevState[index];
            newValue.expertise = value;
            return [...prevState.slice(0, index), newValue, ...prevState.slice(index + 1)];
        });
        setExpertiseList(prevState => [...prevState.slice(0, index), value, ...prevState.slice(index + 1)]);
    }

    const findCategory = (categories: Category[], value: string): Category | undefined => {
        for (let category of categories) {
            if (category.children && category.children.length > 0) {
                const skill = findCategory(category.children, value);
                if(skill) {
                    return skill;
                }
            }
            else if (category.name === value) return category;
        }
    }

    const checkCategoryExists = (category: string): boolean => {
        return skillExpertise.find(skill => skill.skill === category) !== undefined;
    }

    const makeCategoriesTree = (categories: Category[]) => {
        return categories.map((category, index) => (
            <TreeNode id={index} selectable={category.selectable} value={category.name} title={category.name}>
                {category.children ? makeCategoriesTree(category.children) : null}
            </TreeNode>));
    }

    return (
        <div className={`${styles.floatlabel}`} onBlur={() => setFocus(false)} onFocus={() => {
            setFocus(true);
            setFocused(true)
        }}>
            <label className={labelClass}>Skills</label>
            <div id="profile-area" style={{borderRadius: 10, width: 371, minHeight: 80, border: "1px solid #d9d9d9"}}>
                <TreeSelect
                    allowClear={false}
                    onChange={categorySelectChange}
                    placeholder="Add Skills"
                    value={"Add Skills"}
                    bordered={false}
                    style={{width: 120, color: "#c3c3c3"}}
                    showArrow={false}
                >
                    {allCategories && makeCategoriesTree(allCategories)}
                </TreeSelect>
                {skillExpertise && skillExpertise.map((skillExpertise, index) => {
                    return (
                        <div key={index} className={"skill-div"}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <div>#</div>
                                {<TreeSelect
                                    style={{width: 120, color: "#80c1fe", minWidth: "max-content"}}
                                    allowClear={false}
                                    onChange={(value) => expertiseSelectChange(skillExpertise.skill, value, index)}
                                    value={expertiseList[index]}
                                    bordered={false}
                                    showArrow={false}>
                                    {
                                        Object.keys(skillExpertise.expertise).map((expertise) => (
                                            <TreeNode
                                                value={expertise}
                                                selectable={false}
                                                title={expertise}
                                            >
                                                {(Object(skillExpertise.expertise)[expertise] as string[]).map((value, index) => (
                                                    <TreeNode
                                                        value={value}
                                                        selectable={true}
                                                        title={value}
                                                    >
                                                        {value}
                                                    </TreeNode>
                                                ))}
                                            </TreeNode>
                                        ))
                                    }
                                </TreeSelect>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SkillsArea;
