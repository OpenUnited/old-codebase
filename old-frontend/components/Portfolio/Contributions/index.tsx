import React, {useEffect, useState} from "react";
import {ContributionsProps, Task} from "../interfaces";
import {Avatar, Button, Col, Row, Typography} from "antd";
import PagesBar from "../PagesBar";
import TaskDetail from "../TaskDetail";
import {useRouter} from "next/router";
import TasksDesktop from "./TasksDesktop";
import TasksMobile from "./TasksMobile";

const Contributions = ({tasks, changePage, pagesNumber, activePage, hasNext, hasPrev}: ContributionsProps) => {
    const router = useRouter();
    const {personSlug} = router.query;
    const [taskDetailModal, setTaskDetailModal] = useState<boolean>(false);
    const [detailTask, setDetailTask] = useState<Task>({
        id: 0,
        title: "",
        date: "",
        category: null,
        expertise: [],
        reviewerPerson: {
            id: "",
            firstName: "",
            avatar: "",
            link: ""
        },
        product: {
            name: "",
            avatar: "",
            link: ""
        },
        initiative: {
            link: "",
            name: ""
        },
        link: ""
    });

    const openTaskDetail = (index: number) => {
        setDetailTask(tasks[index]);
        setTaskDetailModal(true);
    }

    return (
        <div className="contributions_tasks">
            <Row>
                <Typography.Text style={{
                    fontSize: 16,
                    fontFamily: "Roboto",
                    border: " 1px solid #E7E7E7",
                    width: "100%",
                    padding: "16px 24px",
                    marginBottom: 20
                }}>
                    Most recent contributions
                </Typography.Text>
            </Row>
            <div className="tasks-desktop">
                <TasksDesktop tasks={tasks} openTaskDetail={openTaskDetail}/>
            </div>
            <div className="tasks-mobile">
                <TasksMobile tasks={tasks} openTaskDetail={openTaskDetail}/>
            </div>
            <TaskDetail personSlug={personSlug} task={detailTask} modal={taskDetailModal}
                        setModal={setTaskDetailModal}/>
            {/*<Row justify={"space-around"}>*/}
            {/*    <PagesBar hasNext={hasNext} hasPrev={hasPrev} number={pagesNumber} active={activePage}*/}
            {/*              changePage={changePage}/>*/}
            {/*</Row>*/}
        </div>
    );
}

export default Contributions;
