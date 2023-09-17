import React, { useState } from 'react';
import {connect} from 'react-redux';
import { Row, Col, Button, message } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { DELETE_ATTACHMENT } from '../../graphql/mutations';
import { getProp } from '../../utilities/filters';
import { downloadFile } from '../../utilities/utils';
import Add from './add';
import _ from 'lodash';

import { DeleteOutlined } from '@ant-design/icons';
import ImageIcon from '../../public/assets/icons/image.svg';
import PDFIcon from '../../public/assets/icons/pdf.svg';
import DocIcon from '../../public/assets/icons/doc.svg';
import DownloadIcon from '../../public/assets/icons/download.svg';

import showUnAuthModal from "../UnAuthModal";

const Icon = (fileType: any) => {
  switch(fileType) {
    case "doc":
      return <img src={DocIcon} alt="No doc" />
    case "pdf":
      return <img src={PDFIcon} alt="No pdf" />
    default:
      return <img src={ImageIcon} alt="No attachment" />
  }
}

type Props = {
  attachments: Array<any>;
  capabilityId?: number;
  editMode: boolean;
  setAttachments?: any;
  loginUrl: string;
  registerUrl: string;
}

const Attachment: React.FunctionComponent<Props> = ({
  attachments,
  capabilityId,
  editMode,
  setAttachments,
  loginUrl,
  registerUrl
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteAttachment] = useMutation(DELETE_ATTACHMENT, {
    onCompleted(res) {
      message.success("Item is successfully deleted!").then();
      if (res.deleteAttachment && res.deleteAttachment.status) {
        const newAttachments = Object.assign([], attachments);
        let idx = _.findIndex(newAttachments, (entry: any) => {
          return entry.id == res.deleteAttachment.attachmentId
        });
        if (idx > -1) {
          newAttachments.splice(idx, 1);
          setAttachments(newAttachments);
        }
      }
    },
    onError(e) {
      if(e.message === "The person is undefined, please login to perform this action") {
        showUnAuthModal("perform this action", loginUrl, registerUrl, true);
      } else {
        message.error("Failed to delete item!");
      }
    }
  });

  const submit = (res: any) => {
    if (setAttachments) {
      const newAttachments = Object.assign([], attachments);
      newAttachments.push(res);
      setAttachments(newAttachments);
    }
  }

  const onDelete = (id: number) => {
    deleteAttachment({
      variables: { id, capabilityId }
    })
  }

  return (
    <>
      <div
        className="attachment-item"
        style={{padding: '12px', marginTop: 15}}
      >
        <Row
          justify="space-between"
          className="right-panel-headline mt-15"
        >
          <Col>
            <div
              className="page-title"
              style={{marginBottom: '15px'}}
            >
              Attachments
            </div>
          </Col>
          {editMode && (
            <Col>
              <Button
                onClick={() => setShowEditModal(true)}
              >
                Add
              </Button>
            </Col>
          )}
        </Row>
        {
          attachments.map((item: any, idx: number) => (
            <Row
              key={`attach${idx}`}
              justify="space-between"
              style={{paddingBottom: '15px'}}
            >
              <Col>
                <Row>
                  <Col>{Icon(item.fileType)}</Col>
                  <Col className="attachment-item__text">
                    {getProp(item, 'name', '')}
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  {editMode ? (
                    <Col>
                      <DeleteOutlined onClick={() => onDelete(item.id)} />
                    </Col>
                  ) : (
                    <Col onClick={() => downloadFile(item.path, item.name)}>
                      <img
                        src={DownloadIcon}
                        alt="No download icon"
                        style={{ cursor: 'pointer' }}
                      />
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          ))
        }
        {
          showEditModal && (
            <Add
              modal={showEditModal}
              submit={submit}
              closeModal={setShowEditModal}
              capabilityId={capabilityId}
            />
          )
        }
      </div>
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
)(Attachment);
