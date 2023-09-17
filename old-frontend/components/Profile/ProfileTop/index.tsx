import React from "react";
import { Row, Col, Spin, Space } from "antd";
import { useQuery } from "@apollo/react-hooks";
import {
  GET_PERSON_PROFILE,
  GET_PERSON_SOCIALS,
} from "../../../graphql/queries";
import { CustomAvatar } from "../../CustomAvatar";
import { getProp } from "../../../utilities/filters";
import { formatDate } from "../../../utilities/utils";
import {
  BehanceSquareOutlined,
  DribbbleSquareOutlined,
  InstagramFilled,
  LinkedinFilled,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import Loading from "../../Loading";
import Head from "next/head";

type SocialProps = {
  name: string;
};

export const Social: React.FunctionComponent<SocialProps> = ({ name }) => {
  switch (name) {
    case "instagram":
      return <InstagramFilled />;
    case "linkedin":
      return <LinkedinFilled />;
    case "behance":
      return <BehanceSquareOutlined />;
    case "dribbble":
      return <DribbbleSquareOutlined />;
    default:
      return null;
  }
};

const ProfileTop: React.FunctionComponent = () => {
  const router = useRouter();
  const { personSlug } = router.query;

  const { data, error, loading } = useQuery(GET_PERSON_PROFILE, {
    variables: { personSlug },
  });

  const {
    data: socialsData,
    error: socialsDataError,
    loading: socialsDataLoading,
  } = useQuery(GET_PERSON_SOCIALS, {
    variables: { personId: getProp(data, "personProfile.person.id", "") | 0 },
  });
  const socials = getProp(socialsData, "personSocials", []);

  if (loading || socialsDataLoading) return <Loading />;

  return (
    <>
      {!error && !socialsDataError && (
        <>
          <Head>
            <title>{getProp(data, "personProfile.person.firstName", "")}</title>
            {/* getProp(data, "personProfile.person.firstName", "") => "Full name of person" */}
            <meta name="description" content={getProp(data, "personProfile.person.firstName", "")} />
          </Head>
          <Row>
            <Col>
              {CustomAvatar(
                getProp(data, "personProfile.person", null),
                "firstName",
                100
              )}
            </Col>
            <Col span={10}>
              <Row>
                <strong className="page-title">
                  {getProp(data, "personProfile.person.firstName", "")}
                </strong>
              </Row>
              <Row>
                <span className="text-grey">
                  Member since{" "}
                  {formatDate(
                    getProp(data, "personProfile.person.createdAt", new Date())
                  )}
                </span>
              </Row>
              <Row style={{ fontSize: 24, color: "#8C8C8C" }}>
                <Space size={8}>
                  {socials.map((social: any, index: number) => (
                    <a key={index} style={{ color: "#999" }} href={social.url}>
                      <Social name={social.name} />
                    </a>
                  ))}
                </Space>
              </Row>
              <Row>
                <p>{getProp(data, "personProfile.overview", "")}</p>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProfileTop;
