import React, {useEffect, useState} from "react";
import {TaskDetailProps, DeliveryMessage} from "../interfaces";
import {Avatar, Col, Modal, Row, Typography} from "antd";
import {CheckCircleTwoTone, PlaySquareOutlined} from '@ant-design/icons';
import TaskDetailAttachments from "./Attachments";
import {useQuery} from "@apollo/react-hooks";
import {GET_PERSON_TASK_DELIVERY_MESSAGE} from "../../../graphql/queries";
import Link from 'next/link';


const TaskDetail = ({modal, setModal, task, personSlug}: TaskDetailProps) => {
    const [deliveryAttempt, setDeliveryAttempt] = useState<DeliveryMessage>({
        message: "",
        attachments: []
    });

    const {data: deliveryMessage, refetch: refetchMessage} = useQuery(GET_PERSON_TASK_DELIVERY_MESSAGE, {
        variables:
            {
                taskId: task.id,
                personSlug
            }
    });

    useEffect(() => {
        if (task.id > 0 && personSlug) {
            refetchMessage({taskId: task.id, personSlug});
        }
    }, [task, personSlug]);

    useEffect(() => {
        setDeliveryAttempt(deliveryMessage?.personTaskDeliveryMessage);
    }, [deliveryMessage])

    return (
        <Modal
            visible={modal}
            onCancel={() => setModal(false)}
            maskClosable={false}
            footer={null}
            title={<Row justify={"space-between"}>
                <Typography.Text style={{color: "rgba(0, 0, 0, 0.85)"}}>
                    Completed Task <CheckCircleTwoTone twoToneColor="#52c41a"/>
                </Typography.Text>
                <Typography.Text style={{
                    fontSize: 12,
                    fontFamily: "SF Pro Display",
                    marginRight: 25
                }}>{task?.date} days ago</Typography.Text>
            </Row>}
        >
            <Row>
                <Link href={task.link}>
                    <a>
                        <Typography.Text
                            style={{
                                color: "#1890FF",
                                fontSize: 16,
                                fontFamily: "Roboto"
                            }}>{task.title}</Typography.Text>
                    </a>
                </Link>
            </Row>
            <Row align={"middle"} style={{marginTop: 13}}>
                <Col style={{marginRight: 10}}>
                    <Row>
                        <Typography.Text style={{
                            fontSize: 12,
                            fontFamily: "Roboto",
                            color: "rgba(0, 0, 0, 0.45)"
                        }}>Product</Typography.Text>
                    </Row>
                </Col>
                <Col>
                    <Row>
                        {task.product ? (<Link href={task.product.link}>
                            <a>
                                <PlaySquareOutlined style={{color: "#000000", opacity: 0.8}}/>
                                <Typography.Text style={{
                                    fontSize: 12,
                                    color: "#1D1D1B",
                                    marginLeft: 10
                                }}>{task.product.name}</Typography.Text>
                            </a>
                        </Link>) : null}
                    </Row>
                </Col>
            </Row>
            <Row align={"middle"} style={{marginTop: 13}}>
                <Col style={{marginRight: 10}}>
                    <Row>
                        <Typography.Text style={{
                            fontSize: 12,
                            fontFamily: "Roboto",
                            color: "rgba(0, 0, 0, 0.45)"
                        }}>Initiative</Typography.Text>
                    </Row>
                </Col>
                <Col>
                    <Row>
                        {task.initiative ? (<Link href={task.initiative.link}>
                            <a>
                                <PlaySquareOutlined style={{color: "#000000", opacity: 0.8}}/>
                                <Typography.Text style={{
                                    fontSize: 12,
                                    color: "#1D1D1B",
                                    marginLeft: 10
                                }}>{task.initiative.name}</Typography.Text>
                            </a>
                        </Link>) : null}
                    </Row>
                </Col>
            </Row>
            <Row align={"middle"} style={{marginTop: 13}}>
                <Col style={{marginRight: 10}}>
                    <Row>
                        <Typography.Text style={{
                            fontSize: 12,
                            fontFamily: "Roboto",
                            color: "rgba(0, 0, 0, 0.45)"
                        }}>Reviewer</Typography.Text>
                    </Row>
                </Col>
                <Col>
                    <Row align={"middle"}>
                        {task.reviewerPerson ? (
                            <Link href={task.reviewerPerson.link ? task.reviewerPerson.link : ''}>
                                <a>
                                    <Col onClick={() => setModal(false)}>
                                        <Avatar style={{minWidth: 0}} size={28} src={task.product.avatar}/>
                                        <Typography.Text style={{
                                            fontSize: 12,
                                            color: "#1D1D1B",
                                            marginLeft: 10
                                        }}>{task.reviewerPerson.firstName}</Typography.Text>
                                    </Col>
                                </a>
                            </Link>
                        ) : null}
                    </Row>
                </Col>
            </Row>
            <Row style={{marginTop: 13}}>
                <Col span={3}>
                    <Row>
                        <Typography.Text style={{
                            fontSize: 12,
                            fontFamily: "Roboto",
                            color: "rgba(0, 0, 0, 0.45)",
                        }}>Category</Typography.Text>
                    </Row>
                </Col>
                <Col>
                    {task.category && 
                        <Row style={{
                            marginBottom: 3,
                            marginRight: 3,
                            fontSize: 12,
                            padding: "5px 16px",
                            borderRadius: 2,
                            background: "#F5F5F5"
                        }}>
                            {task.category.name}
                        </Row>
                    }
                </Col>
            </Row>
            <Row style={{marginTop: 13}}>
                <Col span={3}>
                    <Row>
                        <Typography.Text style={{
                            fontSize: 12,
                            fontFamily: "Roboto",
                            color: "rgba(0, 0, 0, 0.45)",
                        }}>Expertise</Typography.Text>
                    </Row>
                </Col>
                <Col>
                    {task.expertise && task.expertise.map(expertise => (
                        <Row style={{
                            marginBottom: 3,
                            marginRight: 3,
                            fontSize: 12,
                            padding: "5px 16px",
                            borderRadius: 2,
                            background: "#F5F5F5"
                        }}>
                            {expertise.name}
                        </Row>
                    ))}
                </Col>
            </Row>
            <Row style={{marginTop: 10}}>
                <Typography.Text strong>Delivery Message</Typography.Text>
            </Row>
            <Row>
                <p dangerouslySetInnerHTML={{__html: deliveryAttempt?.message}}/>
            </Row>
            <TaskDetailAttachments attachments={deliveryAttempt?.attachments}/>
        </Modal>
    );
}

export default TaskDetail;
