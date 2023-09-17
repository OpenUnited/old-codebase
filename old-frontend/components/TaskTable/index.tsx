import React from "react";
import Link from "next/link";
import {connect} from "react-redux";
import {Row, Tag, Divider, Col, Typography, Empty} from "antd";
import {getProp} from "../../utilities/filters";
import {TASK_CLAIM_TYPES} from "../../graphql/types";
import {CheckCircleFilled, ThunderboltFilled} from "@ant-design/icons";
import Priorities from "../Priorities";
import CheckableTag from "antd/lib/tag/CheckableTag";
import CustomAvatar2 from "../CustomAvatar2";
import {getUserRole, hasManagerRoots} from "../../utilities/utils";


type Props = {
  tasks: any;
  productSlug?: string;
  statusList?: Array<string>;
  title?: string;
  hideTitle?: boolean;
  hideEmptyList?: boolean;
  showPendingTasks?: boolean;
  showInitiativeName?: boolean;
  showProductName?: boolean;
  submit: Function;
  content?: any;
  user: any,
  userRole: any
};

const TaskTable: React.FunctionComponent<Props> = (
  {
    tasks,
    statusList = TASK_CLAIM_TYPES,
    title = "Related Tasks",
    hideTitle = false,
    showInitiativeName = false,
    showProductName = false,
    hideEmptyList = false,
    submit,
    content = undefined,
    roles,
  }
) => {
  return <>
    {!hideTitle && <div className="mt-30 d-flex-justify-center">{title} {content}</div>}
    <Row className="task-tab mb-20">
      {tasks && tasks.length > 0 ? (
        <>
          {
            tasks.map((task: any, index: number) => {
              const status = getProp(task, "status");
              let taskStatus = statusList[status];
              const hasActiveDepends = getProp(task, "hasActiveDepends", false);
              const inReview = getProp(task, "inReview", false);

              if (hasActiveDepends) {
                taskStatus = "Blocked";
              } else if (!hasActiveDepends && taskStatus === "Blocked") {
                taskStatus = "Available";
              }

              const productName = getProp(task, "product.name", "");
              const productSlug = getProp(task, "product.slug", "");
              const initiativeName = getProp(task, "initiative.name", "");
              const initiativeId = getProp(task, "initiative.id", "");
              const assignee = getProp(task, "assignedToPerson", null);
              const owner = getProp(task, "product.owner", "");
              const canEdit = hasManagerRoots((getUserRole(roles, productSlug)));

              return (
                <Col key={index} span={24}>
                  <Divider/>
                  <Row justify="space-between">
                    <Col span={14}>
                      <Row>
                        {
                          showProductName && (
                            <>
                              <Link href={owner ? `/${owner}/${productSlug}` : ""}>
                                <a className="text-grey-9">{productName}</a>
                              </Link>&nbsp;/&nbsp;
                            </>
                          )
                        }
                        <Link
                          href={`/${owner}/${productSlug}/challenges/${task.publishedId}`}
                        >
                          <a className="text-grey-9">
                            <strong>
                              <Row align="middle">
                                {task.title}
                              </Row>
                            </strong>
                          </a>

                        </Link>
                      </Row>
                      <Row style={{marginBottom: 10}}>
                        <Col>
                          <Typography.Text
                            type="secondary"
                            style={{marginBottom: 5}}
                          >{task.shortDescription}</Typography.Text>
                        </Col>
                      </Row>
                      <Row align="middle">
                        {getProp(task, "stacks", []).map((stack: any, stackIndex: number) =>
                          <CheckableTag key={`stack-${stackIndex}`} checked={true}>{stack}</CheckableTag>
                        )}
                        {getProp(task, "tags", []).map((tag: any, tagIndex: number) =>
                          <Tag key={`tag${tagIndex}`}>{tag}</Tag>
                        )}

                        {
                          (initiativeName && showInitiativeName) &&

                          <Link href={`/${getProp(task, "product.owner", "")}/${productSlug}/initiatives/${initiativeId}`}>
                            <span className="text-grey-9 pointer link" style={{marginBottom: 8}}>
                              <ThunderboltFilled
                                  style={{color: "#999", marginRight: 4, fontSize: 16}}
                              />
                              {initiativeName}
                            </span>
                          </Link>
                        }
                      </Row>
                    </Col>

                    <Col span={4} className="ml-auto" style={{textAlign: "center"}}>
                      <Priorities task={task}
                                  submit={() => submit()}
                                  canEdit={canEdit} />
                    </Col>

                    <Col span={6}
                         className="ml-auto"
                         style={{textAlign: "right"}}
                    >
                      {
                        (
                          taskStatus !== "Claimed" && taskStatus !== "In Review"
                        ) ? (
                          <>
                            {taskStatus === "Done" && (
                              <CheckCircleFilled style={{color: "#389E0D", marginRight: 8}}/>
                            )}
                            <span>{taskStatus}</span>
                          </>
                        ) : taskStatus === "In Review" ? (
                          <>
                            <div>In Review</div>
                            <div className="mt-10">
                              <div className="d-flex-end" style={{fontSize: 13}}>
                                <CustomAvatar2
                                  person={{firstName: getProp(task, "reviewer.firstName", ""), slug: getProp(task, "reviewer.username", "")}}
                                  size={35}/>
                                <Link
                                  href={`/${getProp(task, "reviewer.username", "")}`}
                                >
                                  <a className="text-grey-9">{getProp(task, "reviewer.firstName", "")}</a>
                                </Link>
                              </div>
                            </div>
                          </>
                        ) : (
                          <span>{taskStatus}</span>
                        )}
                      {(assignee && !inReview) ? (
                        <div className="mt-10">
                          <div className="d-flex-end" style={{fontSize: 13}}>

                            <CustomAvatar2 person={{firstName: assignee.firstName, slug: assignee.slug}} size={35}/>
                            <Link href={`/${assignee.slug}`}>
                              <a className="text-grey-9">{assignee.firstName}</a>
                            </Link>
                          </div>
                        </div>
                      ) : null}
                    </Col>
                  </Row>
                </Col>
              )
            })
          }
        </> ) : !hideEmptyList && <Empty style={{ margin: "20px auto"}} description={"The task list is empty"}/>
      }
    </Row>
  </>
};

const mapStateToProps = (state: any) => ({
  roles: state.user.roles,
});

export default connect(
  mapStateToProps,
  null
)(TaskTable);
