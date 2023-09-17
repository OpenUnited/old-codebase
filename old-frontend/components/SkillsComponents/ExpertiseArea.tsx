import React, {useState} from "react";
// @ts-ignore
import styles from "../FormInput/FormInput.scss";
import {TreeSelect} from "antd";
import {TreeNode} from "antd/lib/tree-select";
import {Skill} from "../CreatePersonModal";
import {ExpertiseAreaInterface} from "./interfaces";

const ExpertiseArea = ({setSkills, skillExpertise, expertiseList, setExpertiseList}: ExpertiseAreaInterface) => {
    const [focus, setFocus] = useState(false);
    const [focused, setFocused] = useState(false);
    const labelClass = focus ? `${styles.label} ${styles.labelfloat}` : (focused ? (`${styles.labelfilled} ${styles.label}`) : (`${styles.label}`));

    const expertiseSelectChange = (skill: string, value: string, index: number) => {
        setSkills((prevState: Skill[]) => {
            const newValue = prevState[index];
            newValue.expertise = value;
            return [...prevState.slice(0, index), newValue, ...prevState.slice(index + 1)];
        });
        setExpertiseList((prevState: string[]) => [...prevState.slice(0, index), value, ...prevState.slice(index + 1)]);
    }

    return (
        <div className={`${styles.floatlabel}`} onBlur={() => setFocus(false)} onFocus={() => {
            setFocus(true);
            setFocused(true)
        }}>
            <label className={labelClass}>Expertise</label>
            <div id="profile-area" style={{borderRadius: 10, width: 371, minHeight: 80, border: "1px solid #d9d9d9"}}>
                {skillExpertise.length > 0 ? skillExpertise.map((skillExpertise, index) => {
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
                }) : <p style={{color: "rgb(195, 195, 195)", margin: "5px 10px"}}>Add Expertise</p>}
            </div>
        </div>
    );
};

export default ExpertiseArea;
