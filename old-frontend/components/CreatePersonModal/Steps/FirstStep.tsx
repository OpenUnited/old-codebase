import {Avatar, Button, Col, Form, message, Row, Typography} from "antd";
import {UploadOutlined, UserOutlined} from "@ant-design/icons";
import FormInput from "../../FormInput/FormInput";
import AvatarUploadModal from "../AvatarUploadModal";
import React, {useEffect, useState} from "react";
import {FirstStepProps, Person} from "../interfaces";
import {UploadFile} from "antd/es/upload/interface";
import {useMutation} from "@apollo/react-hooks";
import {SAVE_AVATAR} from "../../../graphql/mutations";
import {getProp} from "../../../utilities/filters";
import {apiDomain} from "../../../utilities/constants";

const FirstStep = ({
                       setStep,
                       avatarUrl,
                       setAvatarId,
                       setAvatarUrl,
                       firstName,
                       setFirstName,
                       lastName,
                       setLastName,
                       bio,
                       setBio
                   }: FirstStepProps) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({firstName, lastName, bio})
    }, []);

    const [avatarUploadModal, setAvatarUploadModal] = useState<boolean>(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const [saveAvatar] = useMutation(SAVE_AVATAR, {
        onCompleted(data) {
            const status = getProp(data, 'saveAvatar.status', false);
            const messageText = getProp(data, 'saveAvatar.message', '');

            if (status) {
                message.success("Avatar successfully uploaded", 10).then();
                setAvatarUrl(apiDomain + data.saveAvatar.avatarUrl);
                setAvatarId(data.saveAvatar.avatarId);
                setAvatarUploadModal(false);
            } else {
                message.error(messageText).then();
            }
        },
        onError() {
            message.error('Upload file failed').then();
        }
    });

    return (
        <>
            <Form form={form} onFinish={() => setStep(1)}>
                <Typography style={{fontSize: 14, fontFamily: "Roboto"}}>Basic Profile Details (required)</Typography>
                <Row>
                    <Col>
                        <Row>
                            <Col style={{marginTop: 32, marginRight: 38, display: "flex", flexDirection: "column"}}>
                                <Avatar style={{marginBottom: 6}} size={87} icon={<UserOutlined/>} src={avatarUrl}/>
                                <Button style={{fontSize: 12, padding: "0 8px"}} size={"small"}
                                        onClick={() => setAvatarUploadModal(true)}
                                        icon={<UploadOutlined/>}>Upload</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row id={"profile-row"} justify={"end"}
                             style={{display: "flex", flexWrap: "nowrap", marginBottom: 30}}>
                            <Col style={{maxWidth: 177, maxHeight: 51, marginTop: 32, marginRight: 17}}>
                                <Form.Item name="firstName"
                                           rules={[
                                               {required: true, message: ''},
                                           ]}>
                                    <FormInput label="First Name" type="text" name="firstName" placeholder="Jane"
                                               value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                                </Form.Item>
                            </Col>
                            <Col style={{maxWidth: 177, maxHeight: 51, marginTop: 32}}>
                                <Form.Item name="lastName"
                                           rules={[
                                               {required: true, message: ''},
                                           ]}>
                                    <FormInput label="Last Name" name="lastName" placeholder="Doe" type="text"
                                               value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row id="profile-area-row" justify={"end"}>
                            <Form.Item name="bio"
                                       style={{float: "right"}}>
                                <FormInput label="Add Your Bio" name="bio"
                                           placeholder="Self-taught UI/UX Designer based in Rio de Janeiro. Passionate about psychology, user research and mobile design."
                                           type="textarea" value={bio} onChange={(e) => setBio(e.target.value)}/>
                            </Form.Item>
                        </Row>
                    </Col>
                </Row>
                <Row id="profile-btn" style={{flexFlow: "row-reverse"}}>
                    <Button style={{borderRadius: 4}} type="primary" size="middle"
                            htmlType="submit">
                        Next
                    </Button>
                </Row>
            </Form>
            <AvatarUploadModal open={avatarUploadModal} setOpen={setAvatarUploadModal} upload={saveAvatar}
                               fileList={fileList} setFileList={setFileList}/>
        </>
    )
}

export default FirstStep;