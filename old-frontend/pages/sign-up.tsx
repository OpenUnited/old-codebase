import React from "react";
import {Layout} from "antd";
import Header from "../components/Header";
import ContainerFlex from "../components/ContainerFlex";
import SignUp from "../components/SignUp";


const SignUpPage: React.FunctionComponent = () => {
  return (
    <ContainerFlex>
      <Layout>
        <Header/>
        <SignUp/>
      </Layout>
    </ContainerFlex>
  )
}

export default SignUpPage;