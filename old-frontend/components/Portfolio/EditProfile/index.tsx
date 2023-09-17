import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {EditProfileProps, ProfileType, Website} from "../interfaces";
import {Category, Skill, SkillExpertise} from "../../SkillsComponents/interfaces";
import {Avatar, Button, Col, Input, message, Row, Select, Typography, Upload, Checkbox} from "antd";
import {UploadFile} from "antd/es/upload/interface";
import {useRouter} from "next/router";
import 'antd/es/modal/style';
import 'antd/es/slider/style';
import {useMutation, useQuery} from "@apollo/react-hooks";
import {UPDATE_PERSON, SAVE_AVATAR, DELETE_AVATAR} from "../../../graphql/mutations";
import {getProp} from "../../../utilities/filters";
import {apiDomain} from "../../../utilities/constants";
import {PlusOutlined, UserOutlined, UploadOutlined} from "@ant-design/icons";
import {GET_CATEGORIES_LIST, GET_EXPERTISES_LIST} from "../../../graphql/queries";
import {findCategory} from "../helpers";
import SkillsSelect from "../../CreatePersonModal/Skills/SkillsSelect"
import ExpertiseTable from "../../CreatePersonModal/Skills/ExpertiseTable"
import AvatarUploadModal from '../../CreatePersonModal/AvatarUploadModal'
import showUnAuthModal from "../../UnAuthModal";

const {Option} = Select;

const EditProfile = ({profile, setProfile, loginUrl, registerUrl}: EditProfileProps) => {
    const [firstName, setFirstName] = useState<string>(profile.firstName.split(' ')[0]);
    const [lastName, setLastName] = useState<string>(profile.firstName.split(' ')[1]);
    const [bio, setBio] = useState<string>(profile.bio);
    const [skills, setSkills] = useState<Skill[]>(profile.skills);
    const [websites, setWebsites] = useState<Website[]>(profile.websites);
    const [websiteTypes, setWebsiteTypes] = useState<string[]>(profile.websiteTypes);
    const [avatarId, setAvatarId] = useState<number>(-1);
    const [avatarUrl, setAvatarUrl] = useState<string>(profile.avatar)
    const [avatarUploadModal, setAvatarUploadModal] = useState<boolean>(false);
    const [uploadStatus, setUploadStatus] = useState<boolean>(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [allExpertises, setAllExpertises] = useState([]);
    const [skillExpertise, setSkillExpertise] = useState<SkillExpertise[]>([]);
    const [sendMeChallenges, setSendMeChallenges] = useState<boolean>(profile.preferences ? profile.preferences.sendMeChallenges : true);
    const {data: categories} = useQuery(GET_CATEGORIES_LIST);
    const {data: expertises} = useQuery(GET_EXPERTISES_LIST);
    const [deleteAvatar] = useMutation(DELETE_AVATAR, {
        onCompleted(data) {
            const status = getProp(data, 'deleteAvatar.status', false);
            const messageText = getProp(data, 'deleteAvatar.message', '');

            if (status) {
                message.success('Avatar successfully deleted').then();

                setProfile((prevState: ProfileType) => {
                    return {...prevState, avatar: ''}
                });
                setAvatarUrl('');
                setAvatarId(-1);
            } else {
                message.error(messageText).then();
            }
        },
        onError(e) {
            if(e.message === "The person is undefined, please login to perform this action") {
                showUnAuthModal("perform this action", loginUrl, registerUrl, true);
            } else {            
                message.error('Error with person profile updating').then();
            }
        }
    });

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

    const router = useRouter();
    let {personSlug} = router.query;

    const onDeleteAvatarClick = () => {
        deleteAvatar({
            variables: {
                personSlug,
            }
        }).then();
    }

    useEffect(() => {
        if (allCategories) {
            setFirstName(profile.firstName.split(' ')[0]);
            setLastName(profile.firstName.split(' ')[1]);
            setBio(profile.bio);
            setWebsites(profile.websites);
            setWebsiteTypes(profile.websiteTypes);
            setAvatarUrl(profile.avatar);
            setFileList([]);
            setSkills(profile.skills);
            setSendMeChallenges(profile.preferences ? profile.preferences.sendMeChallenges : true);    
            const currentSkillExpertise: SkillExpertise[] = [];
            profile.skills.map(skill => {
                var expertiseSelections = []
                var skillCat = findCategory(allCategories, skill.skill[1])
                if(allExpertises) {
                   for(var i=0; i<allExpertises.length; i++) {
                        if(allExpertises[i]['skill'] === skillCat.id) {
                            var childExpertises = []
                            allExpertises[i]['children'].map((child) => {childExpertises.push(child['name'])})
                            expertiseSelections[ allExpertises[i]['name'] ] = childExpertises
                        }
                    }
                }

                currentSkillExpertise.push({
                    skill: skill.skill,
                    expertise: expertiseSelections,
                });
            });
            setSkillExpertise(currentSkillExpertise);
        }
    }, [profile, allCategories, allExpertises]);
    const [updateProfile] = useMutation(UPDATE_PERSON, {
        onCompleted(data) {
            const status = getProp(data, 'updatePerson.status', false);
            const messageText = getProp(data, 'updatePerson.message', '');

            if (status) {
                message.success("Person profile successfully updated", 10).then();
                router.back();
            } else {
                message.error(messageText).then();
            }
        },
        onError(e) {
            if(e.message === "The person is undefined, please login to perform this action") {
                showUnAuthModal("perform this action", loginUrl, registerUrl, true);
            } else {            
                message.error('Error with person profile updating').then();
            }
        }
    });

    const [saveAvatar] = useMutation(SAVE_AVATAR, {
        onCompleted(data) {
            const status = getProp(data, 'saveAvatar.status', false);
            const messageText = getProp(data, 'saveAvatar.message', '');

            if (status) {
                message.success("Avatar successfully uploaded", 10).then();
                setAvatarUrl(apiDomain + data.saveAvatar.avatarUrl);
                setAvatarId(data.saveAvatar.avatarId);
            } else {
                message.error(messageText).then();
            }
        },
        onError(e) {
            if(e.message === "The person is undefined, please login to perform this action") {
                showUnAuthModal("perform this action", loginUrl, registerUrl, true);
            } else {            
                message.error('Upload file failed').then();
            }
        }
    });

    const checkFileList = (fileList: any) => {
        const thumbUrl = fileList[0].thumbUrl;
        const url = fileList[0].url;
        return thumbUrl ? thumbUrl : url;
    }

    const onUploadChange = ({fileList}: any) => {
        if (fileList.length > 0 && !uploadStatus) {
            setUploadStatus(true);
            setTimeout(() => saveAvatar({variables: {avatar: checkFileList(fileList)}}).then(), 1000);
            setTimeout(() => setUploadStatus(false), 3000);
        }
        setFileList(fileList);
    }

    const save = () => {
        let newSkills: any[] = [];
        for (let skill of skills) {
            newSkills.push({category: skill.skill, expertise: skill.expertise});
        }
        let newWebsites: any[] = [];
        for (let website of websites) {
            newWebsites.push({type: website.type, website: website.website})
        }
        const variables = {
            firstName,
            lastName,
            bio,
            skills: newSkills,
            websites: newWebsites,
            avatar: avatarId,
            preferences: {
                sendMeChallenges: sendMeChallenges
            }
        }
        updateProfile({variables: variables}).then();
    }

    const onImagePreview = async (file: any) => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow && imgWindow.document.write(image.outerHTML);
    };

    const changeWebsitesCount = () => {
        setWebsites((prevState => [...prevState, {website: '', type: 0}]))
    }

    const changeWebsite = (value: string, index: number) => {
        setWebsites(prevState => {
            const newObj = prevState[index];
            newObj.website = value;
            return [...prevState.slice(0, index), newObj, ...prevState.slice(index + 1)];
        });
    }

    const changeWebsiteType = (value: string, index: number) => {
        setWebsites(prevState => {
            const newObj = prevState[index];
            newObj.type = websiteTypes.indexOf(value);
            return [...prevState.slice(0, index), newObj, ...prevState.slice(index + 1)];
        });
    }
    return (
        <>
            <Row gutter={[52, 0]} justify={"center"} style={{margin: "5% auto"}}>
                <Col>
                    <div style={{display: "flex", justifyContent: "space-between", flexDirection: "column"}}>
                        <Avatar style={{marginBottom: 6}} size={87} icon={<UserOutlined/>}  src={avatarUrl ? avatarUrl : undefined }/>
                        <Button
                            style={{fontSize: 12, padding: "0 8px"}} size={"small"}
                            onClick={() => setAvatarUploadModal(true)}
                            icon={<UploadOutlined/>}
                        >Upload
                        </Button>
                    </div>
                </Col>
                <Col>
                    <Row gutter={[48, 0]}>
                        <Col>
                            <Row justify={"start"} style={{marginBottom: 20}}>
                                <Typography.Text strong>First Name</Typography.Text>
                            </Row>
                            <Row style={{marginBottom: 20}}>
                                <Input placeholder={"First Name"} value={firstName}
                                       onChange={(e) => setFirstName(e.target.value)}/>
                            </Row>
                        </Col>
                        <Col>
                            <Row justify={"start"} style={{marginBottom: 20}}>
                                <Typography.Text strong>Last Name</Typography.Text>
                            </Row>
                            <Row style={{marginBottom: 20}}>
                                <Input placeholder={"Last Name"} value={lastName}
                                       onChange={(e) => setLastName(e.target.value)}/>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Row style={{marginBottom: 5}}>
                                <Typography.Text strong>Bio</Typography.Text>
                            </Row>
                            <Row style={{marginBottom: 30}}>
                                <Input.TextArea autoSize={true} style={{width: 460, minHeight: 200}} rows={4}
                                                value={bio} placeholder={"Bio"}
                                                onChange={(e) => setBio(e.target.value)}/>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: 30}}>
                        <Col>
                            <Row>
                                <Typography.Paragraph strong style={{height: 10}}>Skills</Typography.Paragraph>
                            </Row>
                            <Row>
                                <Typography.Text style={{fontSize: 12, marginBottom: 5}}>These skills are featured on your profile and
                                    can also be used to match you with tasks.</Typography.Text>
                            </Row>
                            <SkillsSelect
                                setSkills={setSkills}
                                skillExpertise={skillExpertise}
                                setSkillExpertise={setSkillExpertise}
                                allCategories={allCategories}
                                allExpertises={allExpertises}
                                skills={skills}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Row justify={"start"} style={{marginBottom: 20, height: 5}}>
                                <Typography.Text strong>Expertise</Typography.Text>
                            </Row>
                            <Row>
                                <Typography.Text style={{fontSize: 12, marginBottom: 5}}>For each Skill selected in the previous step,
                                    please select your related expertise.</Typography.Text>
                            </Row>
                        </Col>
                    </Row>
                    <div style={{marginBottom: 25}}>
                        <ExpertiseTable
                            skills={skills}
                            setSkills={setSkills}
                            skillExpertise={skillExpertise}
                        />
                    </div>

                    <Row>
                        <Col>
                            <Row justify={"start"} style={{marginBottom: 15}}>
                                <Col>
                                    <Row>
                                        <Typography.Text strong>Websites</Typography.Text>
                                    </Row>
                                    <Row>
                                        <Typography.Text style={{marginTop: 5, color: "#8C8C8C", fontSize: 8.5}}>Add the
                                            URL
                                            links here:</Typography.Text>
                                    </Row>
                                </Col>
                            </Row>
                            {websites.length > 0 && websites.map((website, index) => (
                                <Row key={index} style={{marginBottom: 15}}>
                                    <Col>
                                        <Row gutter={[15, 0]}>
                                            <Col>
                                                <Input addonBefore={"https://"} placeholder={"Website"}
                                                       value={website.website} style={{width: 350}}
                                                       onChange={(e) => changeWebsite(e.target.value, index)}/>
                                            </Col>
                                            <Col>
                                                <Select onChange={(e) => changeWebsiteType(e, index)}
                                                        value={websiteTypes[website.type]}>
                                                    {websiteTypes.map(websiteType => (
                                                        <Option value={websiteType}>{websiteType}</Option>
                                                    ))}
                                                </Select>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            ))}
                            <Row align={"middle"} style={{marginBottom: 45}}>
                                <Button size={"small"}
                                        style={{fontSize: 11, border: "none", padding: 0, color: "#1890FF"}}
                                        onClick={changeWebsitesCount}><PlusOutlined style={{marginRight: 3}}/> Add
                                    website</Button>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: 35}}>
                        <Checkbox checked={sendMeChallenges} onChange={(e) => setSendMeChallenges(e.target.checked)}>Send me relevant challenges that match my skills and expertises</Checkbox>
                    </Row>
                    <Row justify={"start"}>
                        <Button type={"primary"} style={{width: 108, height: 33, marginRight: 20}}
                                onClick={save}>Save</Button>
                        <Button size={"large"} style={{width: 108, height: 33}}
                                onClick={() => router.back()}>Cancel</Button>
                    </Row>
                </Col>
            </Row>
            <AvatarUploadModal open={avatarUploadModal} setOpen={setAvatarUploadModal} upload={saveAvatar}
                               fileList={fileList} setFileList={setFileList}/>
        </>

    )
}

const mapStateToProps = (state: any) => ({
    loginUrl: state.work.loginUrl,
    registerUrl: state.work.registerUrl,
});

export default connect(
    mapStateToProps,
    null
)(EditProfile);
