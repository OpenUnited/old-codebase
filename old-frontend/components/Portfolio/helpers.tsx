import {Category, SkillExpertise} from "./interfaces";
import {TreeNode} from "antd/lib/tree-select";
import React from "react";

export const findExpertise = (category: string, allCategories: Category[]) => {
    const searchingCategory = findCategory(allCategories, category);
    return searchingCategory && searchingCategory.expertise ? searchingCategory.expertise : {};
}

export const findCategory = (categories: Category[], value: string): Category | undefined => {
    for (let category of categories) {
        if (category.children && category.children.length > 0) {
            const skill = findCategory(category.children, value);
            if (skill) {
                return skill;
            }
        } else if (category.name === value) return category;
    }
}

export const makeCategoriesTree = (categories: Category[]) => {
    return categories.map((category, index) => (
        <TreeNode id={index} selectable={category.selectable} value={category.name} title={category.name}>
        {category.children ? makeCategoriesTree(category.children) : null}
        </TreeNode>));
}

export const checkCategoryExists = (category: string, skillExpertise: SkillExpertise[]): boolean => {
    return skillExpertise.find(skill => skill.skill === category) !== undefined;
}