import React from "react";
import {Layout, Row, Col} from "antd";
import ContainerFlex from "../../components/ContainerFlex";
import HeaderMenu from "../../components/Header";
import LeftPanel from "../../components/Products/LeftPanel";
import {getProp} from "../../utilities/filters";
import {useQuery} from "@apollo/react-hooks";
import {GET_PRODUCT_BY_SLUG} from "../../graphql/queries";
import {useRouter} from "next/router";
import NotFound404 from "../404";
import Loading from "../Loading";
import Footer from "../Footer";


const {Content} = Layout;


const LeftPanelContainer: React.FunctionComponent = ({children}) => {
  const router = useRouter();
  const {productSlug} = router.query;

  const {data: productData, error: productError, loading: productLoading} = useQuery(GET_PRODUCT_BY_SLUG, {
    variables: {
      slug: productSlug
    }
  });

  if (productLoading) return <Loading/>;

  if (!productLoading && !productError) {
    if (!getProp(productData, "product", null)) {
      return <NotFound404/>;
    }
  }

  return (
    <ContainerFlex>
      <Layout style={{ minHeight: "100vh" }}>
        <HeaderMenu/>
        <Content className="container product-page">
          <Row gutter={16} className="mt-30">
            <Col xs={24} sm={24} md={8} lg={6}>
              <LeftPanel/>
            </Col>
            <Col xs={24} sm={24} md={16} lg={18}
                 className="product-page-children"
                 style={{paddingLeft: 32, paddingRight: 32}}>
              {children}
            </Col>
          </Row>
        </Content>
        <Footer />
      </Layout>
    </ContainerFlex>
  );
};

export default LeftPanelContainer;
