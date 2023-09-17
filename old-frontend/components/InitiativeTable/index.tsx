import React from 'react';
import Link from 'next/link';
import {Row, Tag, Divider, Col, Empty, Typography} from 'antd';
import {getProp} from '../../utilities/filters';
import CheckableTag from "antd/lib/tag/CheckableTag";
import {pluralize} from "apollo/lib/utils";
import CheckCircle from "../../public/assets/icons/check-circle.svg";
import FilledCircle from "../../public/assets/icons/filled-circle.svg";

type Props = {
  initiatives: any;
  productSlug?: string;
  personSlug?: string;
  title?: string;
  hideTitle?: boolean;
  hideEmptyList?: boolean;
  content?: any;
};

const InitiativeTable: React.FunctionComponent<Props> = (
  {
    initiatives,
    hideTitle = false,
    hideEmptyList = false,
    productSlug,
    personSlug,
    content = undefined,
  }
) => {
  const getTaskText = (availableTasks: number, status: string) => {
    return `${pluralize(availableTasks, `${status} task`)}`;
  }


  return <>
    {!hideTitle &&
    <div className="mt-30 d-flex-justify-center">
        <Typography.Title level={5} style={{marginBottom: 0}}>Initiatives</Typography.Title> {content}
    </div>}
    <Row className="mb-20">
      {initiatives && initiatives.length > 0 ? (
        <>
          {
            initiatives.map((initiative: any, index: number) => {
              const status = (getProp(initiative, "status", 1) == 1) ? "Active" : "Completed";

              return (
                <Col key={index} span={24}>
                  <Divider/>
                  <Row justify="space-between">
                    <Col span={18}>
                      <Row>
                        <Link
                          href={`/${personSlug}/${productSlug}/initiatives/${initiative.id}`}
                        >
                          <strong>
                            <a className="text-grey-9">
                              <Row align="middle">{initiative.name}</Row>
                            </a>
                          </strong>
                        </Link>
                      </Row>
                      <Row align="middle" className="mt-10">
                        {getProp(initiative, "taskStacks", []).map((tag: any, taskIndex: number) =>
                          <CheckableTag key={`${index}-stack${taskIndex}`} checked={true}>{tag.name}</CheckableTag>
                        )}
                        {getProp(initiative, "taskTags", []).map((tag: any, taskIndex: number) =>
                          <Tag key={`${index}-tag${taskIndex}`}>{tag.name}</Tag>
                        )}
                      </Row>
                    </Col>
                    <Col span={6} className="text-right">
                      <div className="mb-5">
                        <img
                          src={status === "Active" ? FilledCircle : CheckCircle}
                          className="check-circle-icon ml-5"
                          alt="status"
                        />
                        {status}
                      </div>
                      <Link
                          href={`/${personSlug}/${productSlug}/initiatives/${initiative.id}`}
                      >
                        <a style={{textDecoration: "underline", fontWeight: 600}}>
                          {status === "Active"
                            ? getTaskText(initiative.availableTaskCount, "available")
                            : getTaskText(initiative.completedTaskCount, "completed")}
                        </a>
                      </Link>
                    </Col>
                  </Row>
                </Col>
              )
            })
          }
        </> ) : !hideEmptyList && <Empty style={{ margin: "20px auto"}} description={"The initiative list is empty"} />
      }
    </Row>
  </>
};

export default InitiativeTable;
