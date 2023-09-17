import React from 'react';
import '../../styles/Profile.module.less';
import Portfolio from "../../components/Portfolio";
import {Layout} from "antd";
import Header from "../../components/Header";
import ContainerFlex from "../../components/ContainerFlex";


const {Content} = Layout;


const Person: React.FunctionComponent = () => {

    return (
        <ContainerFlex>
            <Layout>
                <Header/>
                <Content className="container main-page">
                    <Portfolio/>
                </Content>
            </Layout>
        </ContainerFlex>
    )
}

export default Person;
