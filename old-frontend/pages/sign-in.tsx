import React from "react";
import {Layout} from "antd";
import Header from "../components/Header";
import ContainerFlex from "../components/ContainerFlex";
import SignIn from "../components/SignIn";


const SignInPage: React.FunctionComponent = () => {
  return (
    <ContainerFlex>
      <Layout>
        <Header/>
        <SignIn/>
      </Layout>
    </ContainerFlex>
  )
}

export default SignInPage;