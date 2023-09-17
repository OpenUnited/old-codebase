import React, { useState } from 'react';
import {connect} from 'react-redux';
import { Modal, Row, Input, message, Button, Upload } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_ATTACHMENT } from '../../graphql/mutations';
import { validURL, formatBytes } from '../../utilities/utils';
import showUnAuthModal from "../UnAuthModal";

const { Dragger } = Upload;

const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info: any) {
    const { status } = info.file;
    if (status !== 'uploading') {
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`).then();
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`).then();
    }
  },
};

type Props = {
    modal?: boolean;
    closeModal: any;
    submit: Function;
    capabilityId?: number;
    loginUrl: string;
    registerUrl: string;
};

const Add: React.FunctionComponent<Props> = ({
  modal,
  closeModal,
  submit,
  capabilityId,
  loginUrl,
  registerUrl
}) => {
  const [path, setPath] = useState('');
  const [createAttachment] = useMutation(CREATE_ATTACHMENT);
  
  const handleCancel = () => {
    closeModal(!modal);
  };

  const handleOk = () => {
    if (validURL(path)) {
      onCreate().then();
      closeModal();
    } else {
      message.error("Attachment url is not valid").then();
    }
  }
  
  const onCreate = async () => {
    const name = path.split("/")[path.split("/").length-1];
    const input = {
      name,
      path,
      fileType: name.split(".")[name.split(".").length-1],
      capabilityId
    };
    
    try {
      const res = await createAttachment({
        variables: {
          input
        }
      });

      if (!res.errors) {
        message.success('Initiative is created successfully!');
        submit(res.data.createAttachment.attachment);
      }
    } catch (e) {
      if(e.message === "The person is undefined, please login to perform this action") {
        showUnAuthModal("perform this action", loginUrl, registerUrl, true);
      } else {
        message.success('Initiative creation is failed!');
      }
    }
  }

  return (
    <>
      <Modal
        title={"Add attachment" }
        visible={modal}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Add
          </Button>,
        ]}
        maskClosable={false}
      >
        <Row style={{marginBottom: '15px'}}>
          <label>Url:</label>
          <Input
            placeholder="Url"
            value={path}
            onChange={(e) => setPath(e.target.value)}
          />
        </Row>
        
        {/*
        OR
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
            band files
          </p>
        </Dragger> */}
      </Modal>
    </>
  );
}

const mapStateToProps = (state: any) => ({
  loginUrl: state.work.loginUrl,
  registerUrl: state.work.registerUrl,
});

export default connect(
  mapStateToProps,
  null
)(Add);