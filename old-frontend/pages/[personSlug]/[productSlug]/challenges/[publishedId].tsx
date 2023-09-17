import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {
    Row,
    Col,
    message,
    Button,
    Tag,
    Collapse,
    List,
    Modal,
    Spin,
    Typography,
    Breadcrumb,
    Space,
} from "antd";
import Link from "next/link";
import {useRouter} from "next/router";
import {useQuery, useMutation, useLazyQuery} from "@apollo/react-hooks";
import {
    GET_LICENSE,
    GET_PERSON,
    GET_PRODUCT_INFO_BY_ID,
    GET_TASK_BY_ID,
    GET_TASKS_BY_PRODUCT_SHORT,
    GET_LOGGED_IN_USER,
    GET_CATEGORIES_LIST,
    GET_EXPERTISES_LIST
} from "../../../../graphql/queries";
import {TASK_TYPES, USER_ROLES} from "../../../../graphql/types";
import {
    ACCEPT_AGREEMENT,
    CLAIM_BOUNTY,
    DELETE_CHALLENGE,
    SUBMIT_BOUNTY,
    LEAVE_BOUNTY,
    REJECT_BOUNTY_SUBMISSION,
    REQUEST_BOUNTY_REVISION,
    APPROVE_BOUNTY_SUBMISSION,
} from "../../../../graphql/mutations";
import {getProp} from "../../../../utilities/filters";
import {EditIcon} from "../../../../components";
import DeleteModal from "../../../../components/Products/DeleteModal";
import LeftPanelContainer from "../../../../components/HOC/withLeftPanel";
import Attachments from "../../../../components/Attachments";
import CustomModal from "../../../../components/Products/CustomModal";
import Priorities from "../../../../components/Priorities";
import Loading from "../../../../components/Loading";
import parse from "html-react-parser";
import {getUserRole, hasManagerRoots} from "../../../../utilities/utils";
import AddTaskContainer from "../../../../components/Products/AddTask";
import Comments from "../../../../components/Comments";
import CustomAvatar2 from "../../../../components/CustomAvatar2";
import {UserState} from "../../../../lib/reducers/user.reducer";
import {userLogInAction} from "../../../../lib/actions";
import showUnAuthModal from "../../../../components/UnAuthModal";
import VideoPlayer from "../../../../components/VideoPlayer";
import Head from "next/head";
import ToReviewModal from "../../../../components/Products/ToReviewModal";
import {UploadFile} from "antd/es/upload/interface";
import DeliveryMessageModal from "../../../../components/Products/DeliveryMessageModal";
import { BountySkill } from "../../../../components/Products/Bounty/interfaces";

const {Panel} = Collapse;

const actionName = "Claim the challenge";

type Params = {
    user?: any;
    currentProduct: any;
    loginUrl: string;
    registerUrl: string;
    userLogInAction: Function
};

const Task: React.FunctionComponent<Params> = ({
                                                    user,
                                                    userLogInAction,
                                                    loginUrl,
                                                    registerUrl
                                               }) => {
    const router = useRouter();    
  
    const {publishedId, personSlug, productSlug} = router.query;

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [files, setFiles] = useState([]);
    const [deliveryMessage, setDeliveryMessage] = useState('');
    const [deliveryModal, setDeliveryModal] = useState(false);

    const [agreementModalVisible, setAgreementModalVisible] = useState(false);
    const [deleteModal, showDeleteModal] = useState(false);
    const [leaveTaskModal, showLeaveTaskModal] = useState(false);
    const [reviewTaskModal, showReviewTaskModal] = useState(false);
    const [rejectTaskModal, showRejectTaskModal] = useState(false);
    const [approveTaskModal, showApproveTaskModal] = useState(false);
    const [task, setTask] = useState<any>({});
    const [taskId, setTaskId] = useState(0);
    const [showEditModal, setShowEditModal] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [license, setLicense] = useState("");
    const [actionName, setActionName] = useState("");

    const [allSkills, setAllSkills] = React.useState([]);
    const [allExpertises, setAllExpertises] = React.useState([]);

    const {data: categories} = useQuery(GET_CATEGORIES_LIST);
    const {data: expertises} = useQuery(GET_EXPERTISES_LIST);

    const [claimedBountyId, setClaimedBountyId] = useState(0);
    const [currentBountyId, setCurrentBountyId] = useState(0);

    useEffect(() => {
        if (categories?.taskCategoryListing) {
            setAllSkills(JSON.parse(categories.taskCategoryListing));
        }
    }, [categories]);

    useEffect(() => {
        if (expertises?.expertisesListing) {
            setAllExpertises(JSON.parse(expertises.expertisesListing));
        }
    }, [expertises]);

    const getSkillParent = (skillId): string => {
        let parentName = "N/A";

        for(let skill of allSkills) {
            for(let childSkill of skill.children) {
                if(childSkill.id == skillId) return skill.name
            }
        }

        return "N/A";
    }

    const getBountyAssignee = (bounty) => {
        let allBountyClaims = task.bountyClaim;
        let claimingPerson = "";
        let claimText = "";
        let selfClaimed = false;

        for(let bountyClaim of allBountyClaims) {
            if(bountyClaim.bounty.id == bounty.id && bountyClaim.kind != 2) { // kind can be active , in_review or done
                if(bountyClaim.person.id === user.id) {
                    selfClaimed = true;
                    claimingPerson = "you";
                }
                else 
                    claimingPerson = bountyClaim.person.slug;

                if(bountyClaim.kind === 1 || bountyClaim.kind === 3)
                    claimText = "Claimed by"
                else if(bountyClaim.kind === 0) 
                    claimText = "Completed by";

                break
            }
        }

        return (
            <div style={{ fontSize: 13, width: 100}}>
                {claimText} {selfClaimed?claimingPerson:(<a href={`/${claimingPerson}`}>@{claimingPerson}</a>)}                
            </div>
        )
    }

    const [isContributionGuideVisible, setIsContributionGuideVisible] = useState(false);
    const showCotributionGuide = () => {
        setIsContributionGuideVisible(true);
    };
    
    const handleContributionGuideOk = () => {
        setIsContributionGuideVisible(false);
      };
    
    const handleContributionGuideCancel = () => {
        setIsContributionGuideVisible(false);
    };

    const [getPersonData, {data: personData}] = useLazyQuery(GET_PERSON, {
        fetchPolicy: "no-cache",
        variables: {id: user.id},
    });

    const {data: original, error, loading, refetch} = useQuery(GET_TASK_BY_ID, {
        fetchPolicy: "no-cache",
        variables: {publishedId, productSlug},
    });

    const {data: tasksData} = useQuery(GET_TASKS_BY_PRODUCT_SHORT, {
        variables: {
            productSlug,
            input: {},
        },
    });

    const userHasManagerRoots = hasManagerRoots(
        getUserRole(user.roles, productSlug)
    );

    let {data: product} = useQuery(GET_PRODUCT_INFO_BY_ID, {
        variables: {slug: productSlug},
    });
    product = product?.product || {};

    useEffect(() => {
        if (tasksData && tasksData.tasklistingByProduct) {
            setTasks(tasksData.tasklistingByProduct);
        }
    }, [tasksData]);

    const getBasePath = () => {
        return `/${personSlug}/${productSlug}`;
    };

    const [deleteChallenge] = useMutation(DELETE_CHALLENGE, {
        variables: {
            id: taskId,
        },
        onCompleted() {
            message.success("Item is successfully deleted!").then();
            router.push(getBasePath() === "" ? "/" : `${getBasePath()}/challenges`).then();
        },
        onError(e) {
            if(e.message === "The person is undefined, please login to perform this action") {
                showUnAuthModal("perform this action", loginUrl, registerUrl, true);
            } else {            
                message.error("Failed to delete item!").then();
            }
        },
    });

    const handleIAgree = () => {
        acceptAgreement().then();
        setAgreementModalVisible(false);
    };

    const [leaveBounty, {loading: leaveTaskLoading}] = useMutation(LEAVE_BOUNTY, {
        variables: {bountyId: claimedBountyId},
        onCompleted(data) {
            const {leaveBounty} = data;
            const responseMessage = leaveBounty.message;
            if (leaveBounty.success) {
                message.success(responseMessage).then();
                fetchData().then();
                showLeaveTaskModal(false);
                getPersonData();
            } else {
                message.error(responseMessage).then();
            }
        },
        onError(e) {
            if(e.message === "The person is undefined, please login to perform this action") {
                showUnAuthModal("perform this action", loginUrl, registerUrl, true);
            } else {            
                message.error("Failed to leave the bounty!").then();
            }
        },
    });

    const [submitBounty, {loading: submitTaskLoading}] = useMutation(
        SUBMIT_BOUNTY,
        {
            variables: {bountyId: claimedBountyId, fileList: files, deliveryMessage},
            onCompleted(data) {
                const {submitBounty} = data;
                const responseMessage = submitBounty.message;
                
                if (submitBounty.success) {
                    message.success(responseMessage).then();
                    fetchData().then();
                    getPersonData();
                    showReviewTaskModal(false);
                } else {
                    message.error(responseMessage).then();
                }
            },
            onError(e) {
                if(e.message === "The person is undefined, please login to perform this action") {
                    showUnAuthModal("perform this action", loginUrl, registerUrl, true);
                } else {                
                    message.error("Failed to submit the bounty for review!").then();
                }
            },
        }
    );

    const [rejectBountySubmission, {loading: rejectTaskLoading}] = useMutation(
        REJECT_BOUNTY_SUBMISSION,
        {
            variables: {bountyId: currentBountyId},
            onCompleted(data) {
                const {rejectBountySubmission} = data;
                const responseMessage = rejectBountySubmission.message;
                if (rejectBountySubmission.success) {
                    message.success(responseMessage).then();
                    fetchData().then();
                    showRejectTaskModal(false);
                    setDeliveryModal(false);
                    getPersonData();
                } else {
                    message.error(responseMessage).then();
                }
            },
            onError(e) {
                if(e.message === "The person is undefined, please login to perform this action") {
                    showUnAuthModal("perform this action", loginUrl, registerUrl, true);
                } else {                
                    message.error("Failed to reject the bounty submission!").then();
                }
            },
        }
    );

    const [requestBountyRevision, {loading: requestRevisionTaskLoading}] = useMutation(
        REQUEST_BOUNTY_REVISION,
        {
            variables: {bountyId: currentBountyId},
            onCompleted(data) {
                const {requestBountyRevision} = data;
                const responseMessage = requestBountyRevision.message;
                if (requestBountyRevision.success) {
                    message.success(responseMessage).then();
                    fetchData().then();
                    showRejectTaskModal(false);
                    setDeliveryModal(false);
                    getPersonData();
                } else {
                    message.error(responseMessage).then();
                }
            },
            onError() {
                message.error("Failed to request revision for the bounty submission!").then();
            },
        }
    );

    const [approveBountySubmission, {loading: approveTaskLoading}] = useMutation(
        APPROVE_BOUNTY_SUBMISSION,
        {
            variables: {bountyId: currentBountyId},
            onCompleted(data) {
                const {approveBountySubmission} = data;
                const responseMessage = approveBountySubmission.message;
                if (approveBountySubmission.success) {
                    message.success(responseMessage).then();
                    fetchData().then();
                    showApproveTaskModal(false);
                    setDeliveryModal(false);
                    getPersonData();
                } else {
                    message.error(responseMessage).then();
                }
            },
            onError(e) {
                if(e.message === "The person is undefined, please login to perform this action") {
                    showUnAuthModal("perform this action", loginUrl, registerUrl, true);
                } else {                
                    message.error("Failed to approve the bounty submission!").then();
                }
            },
        }
    );

    const [acceptAgreement] = useMutation(ACCEPT_AGREEMENT, {
        variables: {productSlug},
        onCompleted(data) {
            const messageText = getProp(data, "agreeLicense.message", "");
            const status = getProp(data, "agreeLicense.status", false);

            if (messageText !== "") {
                if (status) {
                    message.success(messageText).then();
                    claimBountyEvent(claimedBountyId);
                } else {
                    message.error(messageText).then();
                }
            }
        },
        onError(e) {
            if(e.message === "The person is undefined, please login to perform this action") {
                showUnAuthModal("perform this action", loginUrl, registerUrl, true);
            } else {            
                message.error("Failed to accept agreement").then();
            }
        },
    });

    const {data: licenseOriginal, error: licenseError} = useQuery(GET_LICENSE, {
        variables: {productSlug},
    });

    useEffect(() => {
        if (!licenseError) {
            setLicense(getProp(licenseOriginal, "license.agreementContent", ""));
        }
    }, [licenseOriginal]);

    const [claimBounty, {loading: claimTaskLoading}] = useMutation(CLAIM_BOUNTY, {        
        onCompleted(data) {
            const {claimBounty} = data;
            const responseMessage = claimBounty.message;

            if (claimBounty.isNeedAgreement) {
                setAgreementModalVisible(true);
                message.info(responseMessage).then();
            } else {
                if (claimBounty.success) {
                    message.success(responseMessage).then();
                    fetchData().then();
                    getPersonData();
                } else {
                    message
                        .error(
                            claimBounty.claimedTaskName ? (
                                <div>
                                    You already claimed another bounty on 
                                    <span
                                        className="pointer"
                                        style={{color: "#1890ff"}}
                                        onClick={() => {
                                            router.push(claimBounty.claimedBountyProductLink);
                                            message.destroy();
                                        }}
                                    > {claimBounty.claimedBountyProductName}</span>:                                     
                                    <div
                                        className="pointer"
                                        style={{color: "#1890ff"}}
                                        onClick={() => {
                                            router.push(claimBounty.claimedTaskLink);
                                            message.destroy();
                                        }}
                                    >
                                        {claimBounty.claimedTaskName}
                                    </div>
                                    Please complete this bounty before claiming a new one.
                                </div>
                            ) : (
                                responseMessage
                            ),
                            5
                        )
                        .then();

                    // since the bounty claim failed, 
                    // we need to set the claimed bounty ID from task data
                    fetchData().then();
                }
            }
        },
        onError({graphQLErrors, networkError}) {
            if (graphQLErrors && graphQLErrors.length > 0) {
                let msg = graphQLErrors[0].message;
                if (msg === "The person is undefined, please login to perform this action") {
                    showUnAuthModal(actionName, loginUrl, registerUrl, true);
                } else {
                    message.error(msg).then();
                }
            }
            //@ts-ignore
            if (networkError && networkError.length > 0) {
                //@ts-ignore
                message.error(networkError[0].message).then();
            }
        },
    });

    const claimBountyEvent = (bountyId) => {
        let userId = user.id;
        if (userId === undefined || userId === null) {
            showUnAuthModal(actionName, loginUrl, registerUrl, true);
            return;
        }

        setClaimedBountyId(bountyId);

        claimBounty({variables: {bountyId: bountyId}});
    };

    const getCausedBy = (assignedTo: any) => {
        let status = TASK_TYPES[getProp(task, "status")];

        switch (status) {
            case "Claimed":
                return assignedTo ? status : "Proposed By";
            default:
                return status;
        }
    };

    const fetchData = async () => {
        const data: any = await refetch();

        if (data && !data.errors) {
            setTask(data.data.task);
        }
    };

    const updateClaimedBountyId = () => {
        let bountyClaims = getProp(task, "bountyClaim", []);
        let hasClaimedBounty = false;
        for(let bountyClaim of bountyClaims) {
            if(bountyClaim.person.id == user.id && bountyClaim.kind == 1) {
                setClaimedBountyId(bountyClaim.bounty.id);
                hasClaimedBounty = true;
                break;
            }
        }

        if(!hasClaimedBounty)
            setClaimedBountyId(0);

    }


    useEffect(() => {
        // set the claimed bounty
        updateClaimedBountyId();            
    }, [user, task])

    useEffect(() => {

        if (personData && personData.person) {
            const {
                firstName,
                slug,
                id,
                username,
                productpersonSet,
                claimedTask,
            } = personData.person;
            userLogInAction({
                isLoggedIn: true,
                loading: false,
                firstName,
                slug,
                id,
                claimedTask,
                username: username,
                roles: productpersonSet.map((role: any) => {
                    return {
                        product: role.product.slug,
                        role: USER_ROLES[role.right],
                    };
                }),
            });

        } else if (personData && personData.person === null) {
            userLogInAction({
                isLoggedIn: false,
                loading: false,
                firstName: "",
                slug: "",
                username: "",
                id: null,
                claimedTask: null,
                roles: [],
            });
        }
    }, [personData]);

    useEffect(() => {
        if (original) {
            setTask(getProp(original, "task", {}));
            setTaskId(getProp(original, "task.id", 0));
        }
    }, [original]);

    const  [checkLoggedInUser, { data: loggedInUser, loading: checkLoggedInUserLoading }] = useLazyQuery(GET_LOGGED_IN_USER, {
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange: true,
        onCompleted() {
            if(actionName === "edit_task")
                setShowEditModal(true);
            else if (actionName === "delete_task")
                showDeleteModal(true);
        },
        onError(e) {
            if(e.message === "The person is undefined, please login to perform this action") {
                showUnAuthModal("perform this action", loginUrl, registerUrl, true);
            }
        },

    });

    const showEditTask = () => {
        setActionName("edit_task");
        checkLoggedInUser();     
    }

    const showDeleteTask = () => {
        setActionName("delete_task");
        checkLoggedInUser();     
    }

    if (loading) return <Loading/>;

    const showAssignedUser = () => {
        const assignee = getProp(task, "assignedTo", null);
        return (
            <Row className="text-sm mb-10">
                {assignee ? (
                    <>
                        {assignee.id === user.id ? (
                            <div className="flex-column">
                                <strong className="my-auto">Claimed by you</strong>
                            </div>
                        ) : (
                            <Row style={{marginTop: 10}} className="text-sm mt-8">
                                <strong className="my-auto">Claimed by: </strong>
                                <Row align="middle" style={{marginLeft: 15}}>
                                    <Col>
                                        <CustomAvatar2 person={{firstName: getProp(assignee, "firstName", ""),slug: getProp(assignee, "slug", "")}}/>
                                    </Col>
                                    <Col>
                                        <Typography.Link
                                            className="text-grey-9"
                                            href={`/${getProp(assignee, "slug", "")}`}
                                        >
                                            {getProp(assignee, "firstName", "")}
                                        </Typography.Link>
                                    </Col>
                                </Row>
                            </Row>
                        )}
                    </>
                ) : null}
            </Row>
        );
    };

    const assignedTo = getProp(task, "assignedTo");
    const tags = getProp(task, "tag", []);

    const showTaskEvents = () => {
            const assignee = getProp(task, "assignedTo", null);
            const taskStatus = TASK_TYPES[getProp(task, "status")];
            const inReview = getProp(task, "inReview", false);
            const contributionGuide = getProp(task, "contributionGuide", "");

            return (
                <Row className="text-sm">
                    {assignee && !inReview ? (
                        <>
                            {assignee.id === user.id && claimedBountyId !== 0 ? (
                                <div className="flex-column ml-auto mt-10">
                                    <Button
                                        type="primary"
                                        className="mb-10"
                                        onClick={() => showReviewTaskModal(true)}
                                    >
                                        Submit for review
                                    </Button>
                                    <Button
                                        type="primary"
                                        onClick={() => showLeaveTaskModal(true)}
                                        style={{zIndex: 1000}}
                                    >
                                        Leave the bounty
                                    </Button>
                                </div>
                            ) : null}
                        </>
                    ) : null}
                    {taskStatus === "Available" && (
                        <>
                            <div className="flex-column ml-auto mt-10">
                                {/* <Button type="primary" onClick={() => claimTaskEvent()}>
                                    Claim the challenge
                                </Button> */}
                                {contributionGuide && (
                                <>
                                    <a style={{textAlign: 'center', marginTop: '5px', fontSize: '13px'}} 
                                    href='#' onClick={() => showCotributionGuide()}>Contribution guide</a>

                                    <Modal 
                                        title="Contribution Guide" 
                                        visible={isContributionGuideVisible} 
                                        onOk={handleContributionGuideOk} 
                                        onCancel={handleContributionGuideCancel}
                                        footer={[
                                            <Button key="submit" type="primary" onClick={handleContributionGuideOk}>
                                            Ok
                                            </Button>,
                                        ]}
                                    >
                                        {parse(contributionGuide.description)}                                
                                    </Modal>
                                </>
                                )}

                            </div>
                        </>
                    )}
                </Row>
            );
        }
    ;

    let status = TASK_TYPES[getProp(task, "status")];
    const initiativeName = getProp(task, "initiative.name", undefined);
    const inReview = getProp(task, "inReview", false);

    if (inReview && status !== "Done") status = "In Review";

    const showSubmissionEvents = (bountyId) => {
            return (
                <div style={{marginLeft: 10}}>
                    <Button
                        type="primary"
                        style={{padding: "4px 7px", fontSize: 13}}
                        onClick={() => {
                            setCurrentBountyId(bountyId);
                            showApproveTaskModal(true);
                        }}>Approve</Button>
                    
                    <Button
                        type="primary"
                        style={{marginLeft: 5, padding: "4px 7px", fontSize: 13}}
                        onClick={() => {
                            setCurrentBountyId(bountyId);
                            showRejectTaskModal(true);
                        }}>Reject</Button>

                    <div style={{ textAlign: "center", marginTop: 3, 
                        color: "#188ffe", textDecorationLine: "underline",
                        cursor: "pointer", fontSize: 13 }} 
                        onClick={() => { 
                            setCurrentBountyId(bountyId);
                            setDeliveryModal(true); 
                        }}>View Message</div>
                </div>
            );
        }
    ;
    const videoLink = getProp(task, "previewVideoUrl", null);

    return (
        <>
            <Head>
                <title> {getProp(task, "title", "")} </title>
                {/* `${getProp(task, "title", "")} - ${ getProp(product, "name", "")}` => "Task title - Product name" */}
                <meta name="description" content={`${getProp(task, "title", "")} - ${getProp(product, "name", "")}`}/>
            </Head>
            <LeftPanelContainer>
                <Spin
                    tip="Loading..."
                    spinning={
                        loading || leaveTaskLoading || claimTaskLoading || submitTaskLoading || 
                        requestRevisionTaskLoading || approveTaskLoading ||
                        rejectTaskLoading || checkLoggedInUserLoading
                    }
                    delay={200}
                >
                    {!error && (
                        <>
                            {getBasePath() !== "" && (
                                <Breadcrumb>
                                    <Breadcrumb.Item>
                                        <a href={getBasePath()}>{getProp(product, "name", "")}</a>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <a href={`${getBasePath()}/challenges`}>Challenges</a>
                                    </Breadcrumb.Item>
                                    {initiativeName && (
                                        <Breadcrumb.Item>
                                            <a
                                                href={`/${getProp(product, "owner", "")}/${getProp(
                                                    product,
                                                    "slug",
                                                    ""
                                                )}/initiatives/${getProp(task, "initiative.id", "")}`}
                                            >
                                                {initiativeName}
                                            </a>
                                        </Breadcrumb.Item>
                                    )}
                                    <Breadcrumb.Item>
                                        {getProp(original, "task.title", "")}
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                            )}
                            <Row
                                justify="space-between"
                                className="right-panel-headline strong-height"
                            >
                                <Col md={16}>
                                    <div className="section-title">
                                        {getProp(task, "title", "")}
                                    </div>
                                </Col>
                                <Col md={8} className="text-right">
                                    {userHasManagerRoots && (
                                        <>
                                            <Col>
                                                <Button onClick={() => showDeleteTask()}>
                                                    Delete
                                                </Button>
                                                <EditIcon
                                                    className="ml-15"
                                                    onClick={() => showEditTask()}
                                                />
                                            </Col>
                                        </>
                                    )}
                                    {showTaskEvents()}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Row className="html-description">
                                        <Col
                                            style={{
                                                overflowX: "auto",
                                                width: "calc(100vw - 95px)",
                                                marginTop: status === "In Review" ? 100 : 50,
                                            }}
                                        >
                                            {videoLink && (
                                                <div className="pb-15">
                                                    <VideoPlayer videoLink={videoLink}/>
                                                </div>
                                            )}
                                            {parse(getProp(task, "description", ""))}
                                        </Col>
                                    </Row>

                                    <Row className="mt-22">
                                        <label style={{ fontSize: '15', paddingBottom: '10px', fontWeight: '500'}}>Bounty: </label>

                                        <Row>
                                            <Col>
                                                <Row style={{backgroundColor: '#FAFAFA', padding: '10px', width: 280}}>
                                                    Skill
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row style={{backgroundColor: '#FAFAFA', padding: '10px', width: 200}}>
                                                    Expertise
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row style={{backgroundColor: '#FAFAFA', padding: '10px', width: 60}}>
                                                    Points
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row style={{backgroundColor: '#FAFAFA', padding: '10px', width: 260}}>
                                                    Action
                                                </Row>
                                            </Col>
                                        </Row>
                                        {task.bounty && task.bounty.length > 0 && task.bounty.map((bounty, index) => (
                                        <Row>
                                            <Col>
                                                <Row style={{   borderBottom: '1px solid #FAFAFA', height: "100%", 
                                                                alignItems: "center", width: 280, fontWeight: '500' }} key={index}>
                                                    <Typography.Text style={{
                                                        fontSize: 13,
                                                        minWidth: 280,
                                                        padding: 10,
                                                        width: "max-content"
                                                    }}>
                                                    {getSkillParent(bounty.skill.id).slice(0, 12)}{'...->'}{bounty.skill.name}
                                                    </Typography.Text>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row style={{   borderBottom: '1px solid #FAFAFA', height: "100%", 
                                                                alignItems: "center", width: 200, padding: 10, 
                                                                textTransform: 'capitalize', fontWeight: '500' }} key={index}>
                                                    {
                                                        bounty.expertise.map((exp, idx) => { 
                                                            return  (
                                                                <span style={{ }}>
                                                                        {idx>0?', ':''}{exp.name}
                                                                </span> 
                                                            )
                                                        })
                                                    }
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row style={{   borderBottom: '1px solid #FAFAFA', height: "100%", 
                                                                alignItems: "center", width: 60, 
                                                                padding: '10px', fontWeight: '500' }} key={index}>
                                                    {bounty.points}
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row style={{   borderBottom: '1px solid #FAFAFA', height: "100%", 
                                                                alignItems: "center", width: 260, 
                                                                padding: '10px', fontWeight: '500' }} key={index}>
                                                    {
                                                        bounty.status != 2 ? getBountyAssignee(bounty) :
                                                            <Button type="primary" onClick={() => {claimBountyEvent(bounty.id)}}>
                                                                Claim
                                                            </Button>
                                                    }
                                                    { userHasManagerRoots && bounty.status == 5 && showSubmissionEvents(bounty.id) }
                                                </Row>
                                            </Col>
                                        </Row>
                                        ))}                                    
                                    </Row>

                                    <div className="mt-22">
                                        {getProp(task, "taskCategory", null) && (
                                            <Row style={{marginTop: 10}} className="text-sm mt-8">
                                                <strong className="my-auto">Required skills:</strong>&nbsp;
                                                <Col className="expertises expertises-task">
                                                    {getProp(task, "taskCategory", null)}
                                                    {getProp(task, "taskExpertise", null) && (
                                                        getProp(task, "taskExpertise", null).map((exp, index) => 
                                                            <>{index > 0?', ':' ('}{exp.name}</>
                                                        )
                                                    )}
                                                    {getProp(task, "taskExpertise", null) && (<>)</>)}
                                                </Col>
                                                
                                            </Row>
                                        )}

                                        {/* {showAssignedUser()} */}
                                        
                                        <Row style={{marginTop: 10}} className="text-sm mt-8">
                                            <strong className="my-auto">Created By: </strong>

                                            <Row align="middle" style={{marginLeft: 15}}>
                                                <Col>
                                                    <CustomAvatar2
                                                        person={{
                                                            firstName: getProp(task, "createdBy.firstName", ""),
                                                            slug: getProp(task, "createdBy.slug", ""),
                                                        }}
                                                    />
                                                </Col>
                                                <Col>
                                                    <Typography.Link
                                                        className="text-grey-9"
                                                        href={`/${getProp(task, "createdBy.slug", "")}`}
                                                    >
                                                        {getProp(task, "createdBy.firstName", "")}
                                                    </Typography.Link>
                                                </Col>
                                            </Row>
                                        </Row>

                                        <Row className="text-sm mt-8">
                                            {[
                                                "Available",
                                                "Draft",
                                                "Pending",
                                                "Blocked",
                                                "In Review",
                                            ].includes(status) ? (
                                                <strong className="my-auto">Status: {status}</strong>
                                            ) : (
                                                <>
                                                    <strong className="my-auto">
                                                        Status: {getCausedBy(assignedTo)}
                                                    </strong>
                                                    <div className="ml-5">
                                                        {getProp(task, "createdBy", null) !== null &&
                                                        !assignedTo ? (
                                                            <Row>
                                                                <Col>
                                                                    <CustomAvatar2
                                                                        person={{
                                                                            firstName: getProp(
                                                                                task,
                                                                                "createdBy.firstName",
                                                                                ""
                                                                            ),
                                                                            slug: getProp(task, "createdBy.slug", ""),
                                                                        }}
                                                                    />
                                                                </Col>
                                                                <div className="my-auto">
                                                                    {getProp(
                                                                        getProp(task, "createdBy"),
                                                                        "firstName",
                                                                        ""
                                                                    )}
                                                                </div>
                                                            </Row>
                                                        ) : null}
                                                    </div>
                                                </>
                                            )}
                                        </Row>
                                        {getProp(task, "priority", null) && (
                                            <Row style={{marginTop: 10}} className="text-sm mt-8">
                                                <strong className="my-auto">Priority:&nbsp;</strong>
                                                &nbsp;
                                                <Priorities
                                                    task={task}
                                                    submit={() => refetch()}
                                                    canEdit={userHasManagerRoots}
                                                />
                                            </Row>
                                        )}
                                        {getProp(task, "reviewer.slug", null) && (
                                            <Row style={{marginTop: 10}} className="text-sm mt-8">
                                                <strong className="my-auto">Reviewer:</strong>

                                                <Row align="middle" style={{marginLeft: 15}}>
                                                    <Col>
                                                        <CustomAvatar2
                                                            person={{
                                                                firstName: getProp(
                                                                    task,
                                                                    "reviewer.firstName",
                                                                    ""
                                                                ),
                                                                slug: getProp(task, "reviewer.slug", ""),
                                                            }}
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <Typography.Link
                                                            className="text-grey-9"
                                                            href={`/${getProp(task, "reviewer.slug", "")}`}
                                                        >
                                                            {getProp(task, "reviewer.firstName", "")}
                                                        </Typography.Link>
                                                    </Col>
                                                </Row>
                                            </Row>
                                        )}

                                        {tags.length > 0 && (
                                            <Row
                                                style={{marginTop: 10}}
                                                className="text-sm mt-8 tag-bottom-0"
                                            >
                                                <strong className="my-auto">Tags:&nbsp;</strong>
                                                {tags.map((tag: any, taskIndex: number) => (
                                                    <Tag key={`stack-${taskIndex}`}>{tag.name}</Tag>
                                                ))}
                                            </Row>
                                        )}

                                        {getProp(task, "capability.id", null) && (
                                            <Row className="text-sm mt-8">
                                                <strong className="my-auto">Related Capability:</strong>
                                                <Typography.Link
                                                    className="ml-5"
                                                    href={`${getBasePath()}/capabilities/${getProp(
                                                        task,
                                                        "capability.id"
                                                    )}`}
                                                >
                                                    {getProp(task, "capability.name", "")}
                                                </Typography.Link>
                                            </Row>
                                        )}
                                        {getProp(task, "initiative.id", null) && (
                                            <Row className="text-sm mt-8">
                                                <strong className="my-auto">Initiative:</strong>
                                                <Typography.Link
                                                    className="ml-5"
                                                    href={`${getBasePath()}/initiatives/${getProp(
                                                        task,
                                                        "initiative.id"
                                                    )}`}
                                                >
                                                    {getProp(task, "initiative.name", "")}
                                                </Typography.Link>
                                            </Row>
                                        )}
                                    </div>
                                </Col>
                            </Row>

                            {getProp(task, "dependOn", []).length > 0 && (
                                <Collapse style={{marginTop: 30}}>
                                    <Panel header="Blocked by" key="1">
                                        <List
                                            bordered
                                            dataSource={getProp(task, "dependOn", [])}
                                            renderItem={(item: any) => (
                                                <List.Item>
                                                    <Link
                                                        href={`/${personSlug}/${item.product.slug}/challenges/${item.publishedId}`}
                                                    >
                                                        {item.title}
                                                    </Link>
                                                </List.Item>
                                            )}
                                        />
                                    </Panel>
                                </Collapse>
                            )}
                            {getProp(task, "relatives", []).length > 0 && (
                                <Collapse style={{marginTop: 30}}>
                                    <Panel header="Dependant tasks" key="1">
                                        <List
                                            bordered
                                            dataSource={getProp(task, "relatives", [])}
                                            renderItem={(item: any) => (
                                                <List.Item>
                                                    <Link
                                                        href={`/${personSlug}/${item.product.slug}/challenges/${item.publishedId}`}
                                                    >
                                                        {item.title}
                                                    </Link>
                                                </List.Item>
                                            )}
                                        />
                                    </Panel>
                                </Collapse>
                            )}

                            <div style={{marginTop: 30}}/>
                            <Comments objectId={getProp(task, "id", 0)} objectType="task"/>

                            <Attachments data={getProp(original, "task.attachment", [])}/>

                            {deleteModal && (
                                <DeleteModal
                                    modal={deleteModal}
                                    closeModal={() => showDeleteModal(false)}
                                    submit={deleteChallenge}
                                    title="Delete bounty"
                                />
                            )}
                            {leaveTaskModal && (
                                <CustomModal
                                    modal={leaveTaskModal}
                                    closeModal={() => showLeaveTaskModal(false)}
                                    submit={() => {
                                        showLeaveTaskModal(false);
                                        leaveBounty().then();
                                    }}
                                    title="Leave the bounty"
                                    message="Do you really want to leave the bounty?"
                                    submitText="Yes, leave"
                                />
                            )}
                            {reviewTaskModal && (
                                <ToReviewModal
                                    modal={reviewTaskModal}
                                    closeModal={() => showReviewTaskModal(false)}
                                    submit={() => {showReviewTaskModal(false); submitBounty(); }}
                                    files={files}
                                    setFiles={setFiles}
                                    fileList={fileList}
                                    setFileList={setFileList}
                                    deliveryMessage={deliveryMessage}
                                    setDeliveryMessage={setDeliveryMessage}
                                    message={task.title}
                                />
                            )}
                            {showEditModal && (
                                <AddTaskContainer
                                    modal={showEditModal}
                                    productSlug={String(productSlug)}
                                    modalType={true}
                                    closeModal={setShowEditModal}
                                    task={task}
                                    submit={fetchData}
                                    tasks={tasks}
                                />
                            )}
                            {rejectTaskModal && (
                                <CustomModal
                                    modal={rejectTaskModal}
                                    closeModal={() => showRejectTaskModal(false)}
                                    submit={() => { showRejectTaskModal(false); requestBountyRevision(); }}
                                    title="Reject bounty submission"
                                    message="Please choose one of the options below to reject the bounty submission."
                                    submitText="Ask for revision"
                                    secondarySubmits={[{text: "Unassign", 
                                        action: () => { showRejectTaskModal(false); rejectBountySubmission(); } 
                                    }]}
                                    displayCancelButton={false}
                                />
                            )}
                            {approveTaskModal && (
                                <CustomModal
                                    modal={approveTaskModal}
                                    closeModal={() => showApproveTaskModal(false)}
                                    submit={() => { showApproveTaskModal(false); approveBountySubmission(); }}
                                    title="Approve the work"
                                    message="Do you really want to approve the work?"
                                    submitText="Yes, approve"
                                />
                            )}
                            {deliveryModal && (
                                <DeliveryMessageModal
                                    modal={deliveryModal}
                                    closeModal={() => setDeliveryModal(false)}
                                    reject={() => { setDeliveryModal(false); rejectBountySubmission(); }}
                                    requestRevision={() => { setDeliveryModal(false); requestBountyRevision(); }}
                                    submit={() => { setDeliveryModal(false); approveBountySubmission(); }}
                                    bountyId={currentBountyId}/>
                            )}
                        </>
                    )}
                    <Modal
                        title="Contribution License Agreement"
                        okText="I Agree"
                        visible={agreementModalVisible}
                        onOk={handleIAgree}
                        onCancel={() => setAgreementModalVisible(false)}
                        width={1000}
                        maskClosable={false}
                    >
                        <p className="html-description">{parse(license)}</p>
                    </Modal>
                </Spin>
            </LeftPanelContainer>
        </>
    );
};

const mapStateToProps = (state: any) => ({
    user: state.user,
    currentProduct: state.work.currentProduct || {},
    loginUrl: state.work.loginUrl,
    registerUrl: state.work.registerUrl,
});

const mapDispatchToProps = (dispatch: any) => ({
    userLogInAction: (data: UserState) => dispatch(userLogInAction(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Task);
