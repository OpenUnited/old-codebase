import React from 'react';
import { Modal, Button, Select } from 'antd';

type Props = {
    modal?: boolean;
    closeModal: any;
    submit: Function;
    title: string;
    message?: string;
    submitText?: string;
    secondarySubmits?: [{text: string, action: Function}]
    displayCancelButton?: boolean
};

const CustomModal: React.SFC<Props> = ({
  modal,
  closeModal,
  submit,
  title,
  message  = "Are you sure?",
  submitText = "Submit",
  secondarySubmits = [],
  displayCancelButton = true
}) => {  
  const handleCancel = () => {
    closeModal(!modal);
  };

  const handleOk = () => {
    submit();
  }

  const cancelButton = <Button key="back" onClick={handleCancel}>Cancel</Button>

  const secondarySubmitsButtons = secondarySubmits.map((secondarySubmit, index) =>
    <Button key={`secondary-submit${index}`} onClick={secondarySubmit.action}>
      {secondarySubmit.text}
    </Button>)

    const primarySubmitButton = <Button key="submit" type="primary" onClick={handleOk}>{submitText}</Button>

  return (
    <>
      <Modal
        title={title}
        visible={modal}
        onCancel={handleCancel}
        footer={[
          displayCancelButton && cancelButton,
          ...secondarySubmitsButtons,
          primarySubmitButton
        ]}
        maskClosable={false}
      >
        <h3>{message}</h3>
      </Modal>
    </>
  );
}

export default CustomModal;
