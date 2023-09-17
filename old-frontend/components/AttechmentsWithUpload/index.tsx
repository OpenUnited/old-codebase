import * as React from "react";
import {Button, Col, List, message, Row, Typography, Upload} from "antd";
import {FileOutlined, DeleteOutlined, UploadOutlined} from "@ant-design/icons";
import Add from "../Attachment/add";
import {useState} from "react";
import UploadModal from "./add";
import {RcFile, UploadFile, UploadFileStatus} from "antd/es/upload/interface";
import {UploadChangeParam} from "antd/lib/upload";
import {RICH_TEXT_EDITOR_WIDTH} from "../../utilities/constants";


interface IAttachment {
    uid: string;
    size?: number;
    name: string;
    fileName?: string;
    lastModified?: number;
    lastModifiedDate?: Date;
    url?: string;
    status?: UploadFileStatus;
    percent?: number;
    thumbUrl?: string;
    originFileObj?: RcFile;
    error?: any;
    linkProps?: any;
    type?: string;
    preview?: string;
}

interface IProps {
    data: IAttachment[],
    setData: Function,
}

const AttachmentsWithUpload: React.FunctionComponent<IProps> = ({data, setData,}) => {
        const onUploadChange = (e: UploadChangeParam) => {
            let count = 0;
            let size = 0;
            e.fileList.map(file => {
                count += 1;
                if (file.size) size += file.size / 1024 / 1024;
            });
            if (count > 3 && size > 15) message.error('Files should smaller than 15Mb and only 3 files are possible');
            else {
                setData(e.fileList);
            }
        }
        return (
            <div style={{marginTop: 13, paddingBottom: 15, backgroundColor: '#f4f4f4'}}>
                <Upload
                    name="files"
                    multiple={true}
                    listType={"text"}
                    fileList={data}
                    beforeUpload={() => false}
                    onChange={onUploadChange}
                    maxCount={3}
                    accept={".doc, .docx, .pdf, image/*"}>
                    <div style={{width: RICH_TEXT_EDITOR_WIDTH - 60, padding: '20px 10px', display: "flex", justifyContent: "space-between"}}>
                        <Typography.Text style={{fontSize: 20}}>Attachments</Typography.Text>
                        <Button icon={data.length === 0 ? <UploadOutlined/> : null}
                                style={{float: 'right', width: 100, height: 32}}>
                            {data.length === 0 ? 'Upload' : 'Add'}
                        </Button>
                    </div>
                </Upload>
            </div>
        );
    }
;

export default AttachmentsWithUpload;
