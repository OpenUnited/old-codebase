import React from "react";
import {Avatar, Button, Col, Row, Typography} from "antd";
import {TasksComponentProps} from "../interfaces";

const TasksDesktop = ({tasks, openTaskDetail}: TasksComponentProps) => {

    return (
        <>
            {tasks.map((task, index) => (
                <Row
                  key={index} gutter={[10, 0]}
                  justify="space-between"
                  className="row-tasks-contributions"
                >
                    <Col>
                        <Row gutter={[15, 0]}>
                            <Col>
                                <Row align="middle">
                                    <Avatar size={35} shape="circle" src={task.product.avatar}/>
                                </Row>
                            </Col>
                            <Col style={{maxWidth: '500px'}}>
                                <Row>
                                    <div>
                                        <Row align="top">
                                            <Typography.Text strong style={{
                                                fontSize: 14,
                                                fontFamily: "Roboto",
                                            }}>{task.title}</Typography.Text>
                                        </Row>
                                        <Row align="bottom" justify="space-between">
                                            <Col>
                                                <Typography.Text style={{fontSize: 12, fontFamily: "Roboto"}}>
                                                    {task.expertise.length === 0 
                                                    ?
                                                        null
                                                    : 
                                                        <Col className="expertises">{task.category.name + ' ' + '(' + task.expertise.map((exp, index) => index === 0 ? exp.name : ' ' + exp.name  )+ ')'}</Col>
                                                    }
                                                </Typography.Text>
                                            </Col>
                                        </Row>
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col style={{marginLeft: 30}}>
                        <Row justify="end" align="top">
                            <Typography.Text className="days-ago">
                                {task.date} days ago
                            </Typography.Text>
                        </Row>
                        <Row justify="end" align="bottom">
                            <Button style={{
                                padding: 0,
                                border: "none"
                            }} onClick={() => openTaskDetail(index)}>
                                <Typography.Text className="delivery-details">View Delivery Details</Typography.Text></Button>
                        </Row>
                    </Col>
                </Row>
            ))}
        </>);
}

export default TasksDesktop;
