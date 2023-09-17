import React from "react";
import {Col, Row, Typography} from "antd";
import {TaskDetailAttachmentsProps} from "../interfaces";
import {FileOutlined} from "@ant-design/icons";

const TaskDetailAttachments = ({attachments}: TaskDetailAttachmentsProps) => {
    return (
        <>
            <Row style={{marginTop: 10}}>
                <Typography.Text strong>Files</Typography.Text>
            </Row>
            <Col>
                {attachments && attachments.map((attachment, index) => (
                        <Row style={{border: "1px solid #D9D9D9", padding: 4}} justify={"start"} align={"middle"}>
                            <FileOutlined/>
                            <a style={{marginLeft: 10}} href={attachment.path}>
                                <Typography.Text>{attachment.name}</Typography.Text>
                            </a>
                        </Row>
                    ))}
            </Col>
        </>
    );
}

export default TaskDetailAttachments;
