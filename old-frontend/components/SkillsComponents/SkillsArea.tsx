import React, {useState} from "react";
// @ts-ignore
import styles from "../FormInput/FormInput.scss";
import {message, TreeSelect} from "antd";
import {TreeNode} from "antd/lib/tree-select";
import {Skill} from "../CreatePersonModal";
import {Category, SkillExpertise, SkillsAreaInterface} from "./interfaces";

const SkillsArea = ({
                        setSkills,
                        allCategories,
                        setExpertiseList,
                        skillExpertise,
                        setSkillExpertise
                    }: SkillsAreaInterface) => {
    const [focus, setFocus] = useState(false);
    const [focused, setFocused] = useState(false);
    const labelClass = focus ? `${styles.label} ${styles.labelfloat}` : (focused ? (`${styles.labelfilled} ${styles.label}`) : (`${styles.label}`));

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
                setSkillExpertise((prevState: SkillExpertise[]) => [...prevState, newSkillExpertise]);
                setExpertiseList((prevState: string[]) => [...prevState, skill.name]);
                message.success("Please select expertise for this category", 10).then();
            }
        }
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
                                <div style={{width: 120, color: "#80c1fe", minWidth: "max-content"}}>
                                    {skillExpertise.skill}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SkillsArea;
