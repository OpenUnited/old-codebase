import React, {useEffect, useState} from "react";
import {Layout, Row, Col} from "antd";
import Header from "../Header";
import ContainerFlex from "../ContainerFlex";
import {useQuery} from "@apollo/react-hooks";
import {GET_PAGE_CONTENT} from "../../graphql/queries";
import parse from "html-react-parser";
import NotFound404 from "../404";
import Footer from "../Footer";

type Props = {
  pageSlug: string
};

const PageComponent: React.FunctionComponent<Props> = ({pageSlug}) => {
  const [pageExist, setPageExist] = useState(true);
  const [content, setContent] = useState("");

  const {data, error} = useQuery(GET_PAGE_CONTENT, {variables: {slug: pageSlug}});

  useEffect(() => {
    if (data) {
      if (data.page) {
        setContent(data.page.description);
      } else {
        setPageExist(false);
      }
    }
  }, [data])

  useEffect(() => {
    if (error) setPageExist(false);
  }, [error])

  return (
    <ContainerFlex>
      <Layout style={{minHeight: "100vh"}}>
        <Header />
        <Layout.Content>
          <Row className="custom-page-content container">
            <Col lg={22} md={24} style={{margin: "auto", padding: "3rem 24px 1.5rem 24px"}}>
              {pageExist ? parse(content) : <NotFound404 /> }
            </Col>
          </Row>
        </Layout.Content>

        <Footer />
      </Layout>
    </ContainerFlex>
  )
}

export default PageComponent;