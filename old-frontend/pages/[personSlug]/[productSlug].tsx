import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/react-hooks";
import { Col, Divider, Row, Tag, Typography } from "antd";
import { LockFilled } from "@ant-design/icons";
import ReactPlayer from "react-player";
import {
  GET_PRODUCT_BY_SLUG,
  GET_TASKS_BY_PRODUCT_COUNT,
} from "../../graphql/queries";
import { TagType } from "../../graphql/types";
import { DynamicHtml } from "../../components";
import { getProp } from "../../utilities/filters";
import LeftPanelContainer from "../../components/HOC/withLeftPanel";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";
import ProductMapTree from "../../components/ProductMapTree";
import Head from "next/head";

const Summary: React.FunctionComponent = () => {
  const router = useRouter();
  const { productSlug } = router.query;

  const [data, setData] = useState<any>({});

  const [availableTasksAmount, setAvailableTasksAmount] = useState(0);

  const { data: original, error, loading } = useQuery(GET_PRODUCT_BY_SLUG, {
    variables: { slug: productSlug },
    fetchPolicy: "no-cache",
  });

  let { data: tasks, error: tasksError, loading: tasksLoading } = useQuery(
    GET_TASKS_BY_PRODUCT_COUNT,
    {
      variables: {
        productSlug,
        input: { statuses: [2] }, // 2 - Available
      },
    }
  );

  useEffect(() => {
    if (!tasksError) {
      setAvailableTasksAmount(getProp(tasks, "tasklistingByProductCount", 0));
    }
  }, [tasks]);

  const formatData = (data: any) => {
    return data.map((node: any) => ({
      id: getProp(node, "id"),
      title: getProp(node, "data.name"),
      children: node.children ? formatData(getProp(node, "children", [])) : [],
    }));
  };

  useEffect(() => {
    if (original) {
      setData(original);
    }
  }, [original]);

  if (loading || tasksLoading) return <Loading />;

  return (
    <>
      <Head>
        <title>{`Summary`}</title>
        {/* getProp(data, "product.name", "") => Product name */}
        <meta name="description" content={getProp(data, "product.name", "")} />
      </Head>

      <LeftPanelContainer>
        {!error && (
          <div>
            <Row>
              <Typography.Text
                strong
                style={{
                  fontSize: "1.5rem",
                  marginBottom: 12,
                }}
              >
                About {getProp(data, "product.name", "")}
                {getProp(data, "product.isPrivate", false) && (
                  <LockFilled style={{ color: "#888", marginLeft: 10 }} />
                )}
              </Typography.Text>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={13}>
                <div
                  className="description html-description"
                  style={{ paddingRight: 40 }}
                >
                  <DynamicHtml
                    text={getProp(data, "product.fullDescription", "")}
                  />
                </div>
                {getProp(data, "product.tag", []).map(
                  (tag: TagType, idx: number) => (
                    <Tag key={`tag-${idx}`}>{tag.name}</Tag>
                  )
                )}
              </Col>
              {getProp(data, "product.videoUrl", null) !== null && (
                <Col xs={24} sm={24} md={11} className="product-video">
                  <ReactPlayer
                    width="100%"
                    height="200px"
                    url={getProp(data, "product.videoUrl")}
                  />
                </Col>
              )}
            </Row>
            <Divider />
            <div className="mt-15">
              <Row justify="space-between" className="mb-10">
                <Col>
                  <Link
                    href={`/${getProp(
                      data,
                      "product.owner",
                      ""
                    )}/${productSlug}/challenges#available`}
                  >
                    <Typography.Link strong style={{ fontSize: "1.1rem" }}>
                      {availableTasksAmount} Available Challenges
                    </Typography.Link>
                  </Link>
                </Col>
              </Row>
              <Row justify="space-between">
                {getProp(data, "product.capabilitySet", []).map(
                  (capability: any, idx: number) => {
                    if (capability.availableTaskNum > 0) {
                      const direction = idx % 2 === 0 ? "left" : "right";
                      return (
                        <Col
                          key={`cap-${idx}`}
                          span={12}
                          style={{ textAlign: direction }}
                        >
                          <Link
                            href={`/${getProp(
                              data,
                              "product.owner",
                              ""
                            )}/${productSlug}/capabilities/${capability.id}`}
                          >
                            {capability.name}
                          </Link>
                          &nbsp;
                          {`(${capability.availableTaskNum}/${capability.taskSet.length} 
                            Available Challenges ${capability.availableTaskNum})`}
                        </Col>
                      );
                    }

                    return null;
                  }
                )}
              </Row>
            </div>
            <Divider />
            <div className="mt-15">
              <Row justify="space-between">
                <Col>
                  <div className="section-title mb-15">Product Tree</div>
                </Col>
              </Row>
              <Row>
                <ProductMapTree />
              </Row>
            </div>
          </div>
        )}
      </LeftPanelContainer>
    </>
  );
};

export default Summary;
