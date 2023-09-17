import React, { useState } from "react";
import LeftPanelContainer from "../../../components/HOC/withLeftPanel";
import {
  Button,
  Col,
  Dropdown,
  Menu,
  Row,
  Space,
  Tabs,
  Typography,
} from "antd";
import SettingsPolicies from "../../../components/SettingsPolicies";
import { DownOutlined } from "@ant-design/icons";
import SettingsContributing from "../../../components/SettingsContributing";
import Head from "next/head";

const { TabPane } = Tabs;

const Settings: React.FunctionComponent = () => {
  const pages: string[] = ["Contributions", "Policies", "Tags"];
  const [activePage, setActivePage] = useState("Contributions");

  const getActiveTab = () => {
    switch (activePage) {
      case "Policies":
        return <SettingsPolicies />;
      case "Contributions":
        return <SettingsContributing />;
      default:
        return (
          <Typography.Text>
            It will be implemented in the future
          </Typography.Text>
        );
    }
  };

  return (
    <>
      <Head>
        <title>Settings</title>
        <meta name="description" content="Project settings"/>
      </Head>
      <LeftPanelContainer>
        <Row style={{ marginBottom: 20 }}>
          <Col span={24}>
            <Dropdown
              className="settings-mobile-menu"
              trigger={["click"]}
              overlay={
                <Menu>
                  {pages.map((page: string, index: number) => (
                    <Menu.Item key={index} onClick={() => setActivePage(page)}>
                      {page}
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <Button style={{ width: "100%" }}>
                {activePage} <DownOutlined />
              </Button>
            </Dropdown>

            <Tabs
              className="settings-desktop-menu"
              onChange={(val) => setActivePage(val)}
              activeKey={activePage}
            >
              {pages.map((page: string) => (
                <TabPane tab={page} key={page} />
              ))}
            </Tabs>
          </Col>
        </Row>

        {getActiveTab()}
      </LeftPanelContainer>
    </>
  );
};

export default Settings;
