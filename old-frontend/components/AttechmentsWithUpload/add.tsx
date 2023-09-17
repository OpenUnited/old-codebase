import React, {useState} from "react";
import {Button, Modal, Upload} from "antd";
import {InboxOutlined} from "@ant-design/icons";

const {Dragger} = Upload;


const props = {
    name: 'upload',
    multiple: true,
    onChange(info: any) {
        const {status} = info.file;
        console.log(status);
    },
    onDrop(e: any) {
        console.log(e.dataTransfer.files);
    }
}

type Props = {
    modal: boolean;
    closeModal: any;
    submit: Function;
    draggerProps?: object
}


const UploadModal: React.FunctionComponent<Props> = ({
                                                         modal,
                                                         closeModal,
                                                         submit,
                                                         draggerProps = props
                                                     }) => {
    const handleCancel = () => {
        closeModal(!modal);
    };
    const handleOk = () => {

    };
    return (
        <>
            <Modal
                visible={modal}
                onCancel={handleCancel}
                footer={[
                    <Button style={{borderRadius: 4, borderWidth: 0, width: 76, height: 32, marginRight: 8}} key="back"
                            onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button style={{borderRadius: 4, width: 79, height: 32}} key="submit" type="primary"
                            onClick={handleOk}>
                        Submit
                    </Button>]}
                maskClosable={false}
            >
                <Dragger style={{marginTop: 20}} {...draggerProps}>
                    <p className={"ant-upload-drag-icon"}>
                        <InboxOutlined/>
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        You can attach files, such as PDF, Word file, image, Figma export, etc.
                    </p>
                </Dragger>
            </Modal>
        </>
    )
}

export default UploadModal;
