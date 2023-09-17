import React, {useEffect, useState} from "react";
import AddOrEditProduct from "../../components/AddOrEditProduct";
import {ContainerFlex, Header} from "../../components";
import {Layout} from "antd";
import {connect} from "react-redux";
import PermissionDenied403 from "../../components/PermissionDenied403";
import Footer from "../../components/Footer";

const {Content} = Layout;

type Props = {
  user?: any;
};

const AddProduct: React.FunctionComponent<Props> = ({user}) => {
  const [showPage, setShowPage] = useState(true);

  useEffect(() => {
    if (!user.loading) setShowPage(user.isLoggedIn);
  }, [user]);

  return (
    <ContainerFlex>
      <Header/>
      <Layout style={{minHeight: "100vh"}}>
        <Content className="container product-page mt-42">
          {showPage ? <AddOrEditProduct isAdding={true} loading={user.loading} /> : <PermissionDenied403 />}
        </Content>
        <Footer />
      </Layout>
    </ContainerFlex>
  )
};

const mapStateToProps = (state: any) => ({
  user: state.user,
});

export default connect(
  mapStateToProps,
  null
)(AddProduct);