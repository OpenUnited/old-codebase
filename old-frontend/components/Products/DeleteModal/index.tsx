import React from 'react';
import { Modal, Button } from 'antd';

type Props = {
    modal?: boolean;
    description?: string;
    closeModal: any;
    submit: Function;
    title: string;
};

const DeleteModal: React.FunctionComponent<Props> = ({
  modal,
  closeModal,
  submit,
  title,
  description = "Are you sure?",
}) => {  
  const handleCancel = () => {
    closeModal(!modal);
  };

  const handleOk = () => {
    submit();
  }

  return (
    <>
      <Modal
        title={title}
        visible={modal}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="danger" onClick={handleOk}>
            Submit
          </Button>,
        ]}
        maskClosable={false}
      >
        {description}
      </Modal>
    </>
  );
}

export default DeleteModal;