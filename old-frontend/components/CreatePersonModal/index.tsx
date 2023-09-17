import React, {useEffect, useState} from "react";
import {Modal, message, Form, Typography} from "antd";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {CREATE_PERSON} from "../../graphql/mutations";
import {getProp} from "../../utilities/filters";
import {CreatePersonProps, Person} from "./interfaces";
import {useRouter} from "next/router";
import {GET_CATEGORIES_LIST, GET_EXPERTISES_LIST} from "../../graphql/queries";
import {Category, Skill, SkillExpertise} from "../SkillsComponents/interfaces";
import FirstStep from "./Steps/FirstStep";
import SecondStep from "./Steps/SecondStep";
import StepWidget from "./Steps/StepSwitcher/StepSwitcher";



const CreatePersonModal = ({modal, closeModal}: CreatePersonProps) => {
    const [form] = Form.useForm();
    const router = useRouter();

    const [step, setStep] = useState<number>(0);

    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [avatarId, setAvatarId] = useState<number>(-1);

    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [bio, setBio] = useState<string>('');

    const [skills, setSkills] = useState<Skill[]>([]);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [allExpertises, setAllExpertises] = useState([]);
    const [skillExpertise, setSkillExpertise] = useState<SkillExpertise[]>([]);
    const [sendMeChallenges, setSendMeChallenges] = useState<boolean>(true);

    const {data: categories} = useQuery(GET_CATEGORIES_LIST);
    const {data: expertises} = useQuery(GET_EXPERTISES_LIST);

    useEffect(() => {
        if (categories?.taskCategoryListing) {
            setAllCategories(JSON.parse(categories.taskCategoryListing));
        }
    }, [categories]);

    useEffect(() => {
        if (expertises?.expertisesListing) {
            setAllExpertises(JSON.parse(expertises.expertisesListing));
        }
    }, [expertises])

    const [createProfile] = useMutation(CREATE_PERSON, {
        onCompleted(data) {
            const status = getProp(data, 'createPerson.status', false);
            const messageText = getProp(data, 'createPerson.message', '');

            if (status) {
                message.success("Person profile successfully created", 10).then();
                closeModal(false);
                form.resetFields();
                setAvatarUrl('');
                setAvatarId(-1);
                router.push('/').then(() => {
                    closeModal(false);
                });
            } else {
                message.error(messageText).then();
            }
        },
        onError() {
            message.error('Error with person profile creation').then();
        }
    });

    const submit = () => {
        createProfile({variables: {firstName, lastName, bio, skills, avatar: avatarId, preferences: {sendMeChallenges: sendMeChallenges}}});
    }


    const cancel = () => {
        closeModal(false);
    }

    const steps = [
        <FirstStep avatarUrl={avatarUrl}
                   setAvatarUrl={setAvatarUrl}
                   setAvatarId={setAvatarId}
                   setStep={setStep}
                   firstName={firstName}
                   setFirstName={setFirstName}
                   lastName={lastName}
                   setLastName={setLastName}
                   bio={bio}
                   setBio={setBio}/>,
        <SecondStep previous={setStep}
                    submit={submit}
                    setSkills={setSkills}
                    skillExpertise={skillExpertise}
                    setSkillExpertise={setSkillExpertise}
                    allCategories={allCategories}
                    allExpertises={allExpertises}
                    skills={skills}
                    sendMeChallenges={sendMeChallenges}
                    setSendMeChallenges={setSendMeChallenges}
        />
    ]

    const getStep = (step: number) => {
        return steps[step];
    }

    return (
        <Modal
            visible={modal}
            onCancel={cancel}
            maskClosable={false}
            footer={null}
            closable={false}
            width={600}
        >
            <div style={{margin: "5%"}}>
                <Typography.Title style={{textAlign: "center", fontFamily: "Roboto", fontSize: 20}}>Complete Your
                    Profile</Typography.Title>
                <StepWidget first={step === 1 || step === 2} second={step === 2} step={step}/>
                {getStep(step)}
            </div>
        </Modal>
    )
}

export default CreatePersonModal;
