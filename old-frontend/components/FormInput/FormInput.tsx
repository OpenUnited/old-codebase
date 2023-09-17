import React, {useState} from "react";
// @ts-ignore
import styles from "./FormInput.scss";
import {Input} from "antd";


export interface FormInputInterface {
    label: string,
    name: string,
    placeholder: string,
    type: string,
    onChange?: (e: any) => void,
    value: string
}

const FormInput = ({label, placeholder, type, onChange, value}: FormInputInterface) => {
    const [focus, setFocus] = useState(false);
    const [focused, setFocused] = useState(false);
    const labelClass = focus ? `${styles.label} ${styles.labelfloat}` : (focused ? (`${styles.labelfilled} ${styles.label}`) : (`${styles.label}`));

    return (
        <div id="profile-area" className={`${styles.floatlabel}`} onBlur={() => setFocus(false)} onFocus={() => {
            setFocus(true);
            setFocused(true)
        }}>
            <label className={labelClass}>{label}</label>
            {
                type === 'textarea' ?
                    <Input.TextArea placeholder={placeholder} onChange={onChange} value={value}
                                    style={{borderRadius: 10, width: 371, minHeight: 80}}/> :
                    <Input size="large" placeholder={placeholder} value={value} type={type} onChange={onChange}
                           style={{borderRadius: 10}}/>
            }
        </div>
    );
};

export default FormInput;
