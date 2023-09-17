import {TasksComponentProps} from "../interfaces";
import {Avatar, Button, Col, Row, Divider, Typography} from "antd";
import React from "react";

const TasksMobile = ({tasks, openTaskDetail}: TasksComponentProps) => {
    return (
        <>
            {tasks.map((task, index) => (
                <Row key={index} style={{minWidth: 350, marginBottom: 10}}>
                    <Col style={{minWidth: 350, width:'100%'}}>
                        <Row justify={"start"} align={"middle"} style={{flexWrap: "nowrap"}}>
                            <Avatar size={32} shape="circle" src={task.product.avatar}/>
                            <Typography.Text strong style={{
                                fontSize: 14,
                                fontFamily: "Roboto",
                                marginLeft: 5
                            }}>{task.title.length > 50 ? task.title.slice(0,50).concat('...') : task.title}</Typography.Text>
                        </Row>
                        <Row align={"middle"} justify={"space-between"}>
                            <Col style={{marginLeft:'10px', marginTop:'10px'}}>
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
                        <Row justify={"space-between"} align={"middle"}>
                            <Col style={{marginLeft: 30}}>
                                <Typography.Text className="days-ago">
                                    {task.date} days ago
                                </Typography.Text>
                            </Col>
                            <Col>
                                <Button style={{
                                    padding: 0,
                                    paddingRight:'10px',
                                    border: "none"
                                }} onClick={() => openTaskDetail(index)}>
                                    <Typography.Text className="delivery-details">View Delivery Details</Typography.Text></Button>
                            </Col>
                        </Row>
                    </Col>
                    <Divider/>
                </Row>)
            )}
        </>
    )
}

export default TasksMobile;
