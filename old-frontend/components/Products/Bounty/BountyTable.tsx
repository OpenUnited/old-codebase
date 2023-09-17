import React, { useState } from "react";
import {Col, Row, TreeSelect, Typography, InputNumber} from "antd";
import {TreeNode} from "antd/lib/tree-select";

import { Skill, Expertise, BountySkill } from "./interfaces";


interface BountyTableProps {
    bountySkills: BountySkill[],
    setBountySkills: Function,
    allSkills: Skill[],
    allExpertises: Expertise[]
}

const BountyTable = ({bountySkills, setBountySkills, allSkills, allExpertises}: BountyTableProps) => {

    const updateBountyPoint = (value, bounty, index) => {
        setBountySkills((prevState) => {
            let bountyTemp = prevState[index];
            bountyTemp.points = value;
            return [...prevState.slice(0, index), bountyTemp, ...prevState.slice(index+1)]
        })
    }

    const getSkillParent = (skillId): string => {
        let parentName = "N/A";

        for(let skill of allSkills) {
            for(let childSkill of skill.children) {
                if(childSkill.id == skillId) return skill.name
            }
        }

        return "N/A";
    }

    const expertiseSelectChange = (bounty: BountySkill, value: string[], index: number) => {
        let selectedExp = [];
        value.map((val) => {
            allExpertises.map((expertise) => {
                expertise.children.map((expChild) => {
                    if(expChild.name == val && 
                        expertise.skill == bounty.skill.id) selectedExp.push(expChild);
                })    
            })    
        })

        setBountySkills((prevState) => {
            let bountyTemp = prevState[index];
            bountyTemp.expertise = selectedExp;
            return [...prevState.slice(0, index), bountyTemp, ...prevState.slice(index+1)]
        })
    }


    const expertiseTree = (index: number, bounty) => {      
        var selectedExpertises: string[] = [];
        bounty.expertise.map((exp) => selectedExpertises.push(exp.name));

        var expertiseOptions = {};
        allExpertises.map((exp) => {
            if(exp.skill == bounty.skill.id)
                expertiseOptions[exp.name] = exp.children;
        });

        return (
            Object.keys(expertiseOptions).length ? 
            (<TreeSelect
                key={index}
                style={{minWidth: 500, padding: 5, width: "max-content"}}
                allowClear={false}
                onChange={(value) => expertiseSelectChange(bounty, value as string[], index)}
                placeholder={"Please Select Expertise"}
                value={selectedExpertises}
                multiple
                bordered
                showArrow>
                {
                    Object.keys(expertiseOptions).map((val) => (
                        <TreeNode
                            value={val}
                            selectable={false}
                            title={val}
                        >
                            {expertiseOptions[val].map((childVal) => (
                                <TreeNode
                                    value={childVal.name}
                                    selectable={true}
                                    title={childVal.name}
                                >
                                    {childVal.name}

                                </TreeNode>
                            ))}
                        </TreeNode>
                    ))
                }
            </TreeSelect>
            ) : 
            (<Typography.Text>No selections available</Typography.Text>)
        )
    }

    return (
        <>
            <Row>
                <Col>
                    <Row style={{backgroundColor: '#FAFAFA', padding: '10px', minWidth: 320}}>
                        Skill
                    </Row>
                </Col>
                <Col>
                    <Row style={{backgroundColor: '#FAFAFA', padding: '10px', minWidth: 520}}>
                        Expertise
                    </Row>
                </Col>
                <Col>
                    <Row style={{backgroundColor: '#FAFAFA', padding: '10px', minWidth: 80}}>
                        Points
                    </Row>
                </Col>
            </Row>
            {bountySkills && bountySkills.length > 0 && bountySkills.map((bounty, index) => (
                <Row>
                    <Col>
                        <Row style={{borderBottom: '1px solid #FAFAFA', height: "100%", alignItems: "center", minWidth: 320}}
                             key={index}>
                            <Typography.Text style={{
                                fontSize: 13,
                                minWidth: 320,
                                padding: 5,
                                width: "max-content"
                            }}>
                            {getSkillParent(bounty.skill.id).slice(0, 12)}{'...->'}{bounty.skill.name}
                            </Typography.Text>
                        </Row>
                    </Col>
                    <Col>
                        <Row style={{borderBottom: '1px solid #FAFAFA', height: "100%", alignItems: "center", minWidth: 520}} 
                            key={index}>
                            { expertiseTree(index, bounty) }
                        </Row>
                    </Col>
                    <Col>
                        <Row style={{borderBottom: '1px solid #FAFAFA', height: "100%", 
                            alignItems: "center", maxWidth: 80, padding: '10px'}} key={index}>
                            <InputNumber
                                value={bounty.points}
                                required                    
                                size="middle"
                                onChange={(value) => {updateBountyPoint(value, bounty, index)}}
                                min={1}
                                max={99}
                            />
                        </Row>
                    </Col>
                </Row>
            ))}
        </>
    );
}

export default BountyTable;