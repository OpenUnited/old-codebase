import React, {useEffect, useState} from "react";
// @ts-ignore
import styles from "./FormInput.scss";
import {message, TreeSelect} from "antd";
import {useQuery} from "@apollo/react-hooks";
import {GET_CATEGORIES_LIST} from "../../../graphql/queries";
import {TreeNode} from "antd/lib/tree-select";
import {Category, Skill, SkillExpertise, SkillAreaInterface} from "../interfaces";

const SkillsArea = ({skills, setSkills}: SkillAreaInterface) => {
    const [expertiseList, setExpertiseList] = useState<string[]>([]);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [skillExpertise, setSkillExpertise] = useState<SkillExpertise[]>([]);
    const {data: categories} = useQuery(GET_CATEGORIES_LIST);
    const [currentSkills, setCurrentSkills] = useState<Skill[]>([]);

    useEffect(() => {
        setCurrentSkills(skills);
    }, []);

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
            let {category} = prevState[index];
            return [...prevState.slice(0, index), {category, expertise: value}, ...prevState.slice(index + 1)];
        });
        setExpertiseList(prevState => [...prevState.slice(0, index), value, ...prevState.slice(index + 1)]);
    }

    const findCategory = (categories: Category[], value: string): Category | undefined => {
        for (let category of categories) {
            if (category.children && category.children.length > 0) {
                const skill = findCategory(category.children, value);
                if (skill) {
                    return skill;
                }
            } else if (category.name === value) return category;
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
        <div id="profile-area" style={{width: 460, minHeight: 80, border: "1px solid #d9d9d9"}}>
            <TreeSelect
                allowClear={false}
                onChange={categorySelectChange}
                placeholder="Add Your Skills"
                value={"Add Your Skills"}
                bordered={false}
                style={{width: 120, color: "#c3c3c3"}}
                showArrow={false}
            >
                {allCategories && makeCategoriesTree(allCategories)}
            </TreeSelect>
            {skillExpertise && skillExpertise.map((skillExpertise, index) => {
                return (
                    <div key={index} className={"skill-div"}
                         style={{
                             backgroundColor: "#F5F5F5",
                             borderRadius: 2,
                             border: "none",
                             color: "#595959",
                             fontSize: 12,
                             width: "max-content"
                         }}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <div>#</div>
                            {<TreeSelect
                                style={{width: 120, minWidth: "max-content"}}
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
            {currentSkills.map((skill, index) => (
                <div key={index} className={"skill-div"}
                     style={{
                         backgroundColor: "#F5F5F5",
                         borderRadius: 2,
                         border: "none",
                         color: "#595959",
                         fontSize: 12,
                         width: "max-content"
                     }}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div>#</div>
                        {skill.expertise ? skill.expertise : skill.category}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SkillsArea;
