import React from "react";
import {message, TreeSelect} from "antd";
import {TreeNode} from "antd/lib/tree-select";
import {Category, Skill, SkillExpertise} from "../../SkillsComponents/interfaces";
import {SkillsSelectProps} from "../interfaces";

const SkillsSelect = ({allCategories, allExpertises, setSkills, setSkillExpertise, skillExpertise, skills}: SkillsSelectProps) => {
    
    const makeCategoriesTree = (categories: Category[]) => {
        return categories.map((category, index) => (
            <TreeNode id={index} selectable={category.selectable} value={category.name} title={category.name}>
                {category.children ? makeCategoriesTree(category.children) : null}
            </TreeNode>));
    }

    const categorySelectChange = (value: string[]) => {
        if (value.length < skillExpertise.length) {
            const findSkill = skillExpertise.map(skillExp => skillExp.skill[1]).filter(skill => !value.includes(skill))[0];
            const index = skillExpertise.findIndex(skillExp => skillExp.skill[1] === findSkill);
            if (index > -1) {
                setSkills((prevState: string[]) => [...prevState.slice(0, index), ...prevState.slice(index + 1)]);
                setSkillExpertise((prevState: SkillExpertise[]) => [...prevState.slice(0, index), ...prevState.slice(index + 1)]);
            }
        } else {
            if (!checkCategoryExists(value[value.length - 1])) {
                const skill = findCategory(allCategories, value[value.length - 1]);
                if (skill) {
                    const newSkill = {
                        category: [skill[1].name, skill[0].name],
                        expertise: null
                    };

                    var expertiseSelections = []
                    for(var i=0; i<allExpertises.length; i++) {
                        if(allExpertises[i]['category'] === skill[0].id) {
                            var childExpertises = []
                            allExpertises[i]['children'].map((child) => {childExpertises.push(child['name'])})
                            expertiseSelections[ allExpertises[i]['name'] ] = childExpertises
                        }
                    }

                    const newSkillExpertise = {
                        skill: [skill[1].name, skill[0].name],
                        expertise: expertiseSelections
                    }
                    setSkills((prevState: Skill[]) => [...prevState, newSkill]);
                    setSkillExpertise((prevState: SkillExpertise[]) => [...prevState, newSkillExpertise]);
                    message.success("Please select expertise for this category", 10).then();
                }
            }
        }
    }

    const findCategory = (categories: Category[], value: string): Category[] | undefined => {
        for (let category of categories) {
            if (category.children && category.children.length > 0) {
                const skill = findCategory(category.children, value);
                if (skill) {
                    return [skill[0], category]
                }
            } else if (category.name === value) return [category, category];
        }
    }

    const checkCategoryExists = (category: string): boolean => {
        return skillExpertise.find(skill => skill.skill[1] === category) !== undefined;
    }

    return (
        <TreeSelect
            allowClear={false}
            onChange={categorySelectChange}
            placeholder="Please select skills"
            showArrow
            bordered
            style={{width: 250}}
            multiple={true}
            value={skills.map(obj => {
                return typeof obj.category === 'string' ? obj.category : obj.category[1]
            })}
        >
            {allCategories && makeCategoriesTree(allCategories)}
        </TreeSelect>
    );
}

export default SkillsSelect;