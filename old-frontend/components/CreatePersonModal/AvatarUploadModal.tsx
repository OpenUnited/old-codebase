import React, {useState} from "react";
import {Button, Col, Modal, Typography, Upload} from "antd";
import ImgCrop from "antd-img-crop";
import {AvatarUpload} from "./interfaces";
import {getProp} from "../../utilities/filters";

const AvatarUploadModal = ({open, setOpen, fileList, setFileList, upload}: AvatarUpload) => {

    const onUploadChange = ({fileList}: any) => {
        setFileList(fileList);
    }

    const checkFileList = () => {
        const thumbUrl = getProp(fileList[0], 'thumbUrl', null);
        const url = getProp(fileList[0], 'url', null);
        return thumbUrl ? thumbUrl : url;
    }

    const submit = () => {
        if (fileList.length === 1) {
            upload({variables: {avatar: checkFileList()}})
        } else {
            setOpen(false);
        }
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

    return (
        <Modal
            style={{marginTop: 50}}
            visible={open}
            onCancel={() => {
                setOpen(false);
                setFileList([]);
            }}
            footer={[
                <div style={{display: "flex", justifyContent: "space-between", marginLeft: '5%', marginRight: '2%'}}>
                    <Button style={{padding: "0 44px", fontSize: 16, borderRadius: 10}} key="back" size="large"
                            onClick={() => {
                                setOpen(false);
                                setFileList([]);
                            }}>
                        Back
                    </Button>
                    <Button style={{padding: "0 44px", fontSize: 16, borderRadius: 10}} key="submit" size="large"
                            type="primary" onClick={submit}>
                        Submit
                    </Button>
                </div>

            ]}
            maskClosable={false}
        >
            <Col style={{display: "flex", alignItems: "center", flexFlow: "column"}}>
                <Typography.Text style={{fontSize: 24, fontFamily: "SF Pro Display", marginBottom: 20}}>Upload your
                    avatar</Typography.Text>
                <ImgCrop shape={'round'} modalOk={"Crop"} rotate>
                    <Upload className="avatar-upload"
                            onChange={onUploadChange}
                            fileList={fileList}
                            showUploadList={true}
                            listType={"picture-card"}
                            onPreview={onImagePreview}
                    >
                        {fileList.length < 1 && '+ Upload'}
                    </Upload>
                </ImgCrop>
            </Col>
        </Modal>
    );
}

export default AvatarUploadModal;
