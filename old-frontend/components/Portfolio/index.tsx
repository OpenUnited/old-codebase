import React, {useEffect, useState} from "react";
import Profile from "./Profile";
import {Paginator, ProfileType, Task} from "./interfaces";
import {GET_PERSON_INFO, GET_PERSON_DONE_TASKS} from "../../graphql/queries";
import {useQuery} from "@apollo/react-hooks";
import {useRouter} from "next/router";
import Contributions from "./Contributions";

const Portfolio = () => {
    const router = useRouter();
    const {personSlug} = router.query;
    const [taskList, setTaskList] = useState<Task[]>([]);
    const [profile, setProfile] = useState<ProfileType>({
        id: '',
        firstName: '',
        bio: '',
        avatar: '',
        slug: "",
        skills: [],
        websites: [],
        websiteTypes: []
    });
    const [paginator, setPaginator] = useState<Paginator>({
        page: 1,
        pages: 0,
        hasNext: false,
        hasPrev: false
    });

    const {data: profileData, refetch: personRefetch} = useQuery(GET_PERSON_INFO, {variables: {personSlug}});
    const {data: tasksData, refetch: tasksRefetch} = useQuery(GET_PERSON_DONE_TASKS, {
        variables: {
            page: paginator.page,
            personSlug
        }
    });

    useEffect(() => {
        if (profileData?.personInfo) {
            setProfile(profileData.personInfo);
        }
    }, [profileData]);

    useEffect(() => {
        if (tasksData?.personTasks) {
            let data = tasksData.personTasks;
            // setTaskList(data.tasks);
            setTaskList(data);
            // setPaginator({...data});
        }
    }, [tasksData]);

    const changePage = (page: number) => {
        setPaginator(prevValue => Object({...prevValue, page}));
        tasksRefetch({page, personSlug}).then();
    }

    return (
        <div style={{display: "flex", flexWrap: "wrap"}}>
            <Profile refetchProfile={personRefetch} profile={profile} />
            <Contributions hasPrev={paginator.hasPrev} hasNext={paginator.hasNext} tasks={taskList}
                           changePage={changePage} pagesNumber={paginator.pages} activePage={paginator.page}/>
        </div>
    );
}

export default Portfolio;
