import React, {useEffect, useState} from "react";
import { Row, Col, Button, Select, Layout, Space, Tabs } from "antd";
import ProductTab from "./ProductTab";
import TaskTab from "./TaskTab";
import CreatePersonModal from "../CreatePersonModal";

const { Option } = Select;
const { Content } = Layout;
const { TabPane } = Tabs;


const Dashboard: React.FunctionComponent = () => {
  const [tabkey, setTabkey] = useState("challenges");
  const [filterModal, setFilterModal] = useState(false);
  const [createPersonModal, setCreatePersonModal] = useState<boolean>(false);

  const onChnageKey = (key: any) => {
    setTabkey(key);
  };

  useEffect(() => {
    let newUser = new URLSearchParams(location.search).get('new');
    if (newUser) setCreatePersonModal(true);
  });

  const extraTabButtons = () => {
    if (tabkey !== "products")
      return (
        <Button type="primary" onClick={() => setFilterModal(!filterModal)}>
          Filter
        </Button>
      );
  };

  return (
    <Content className="container main-page">
      <div className="mobile-select-tab">
        <Select
          style={{ width: "130px" }}
          onChange={onChnageKey}
          value={tabkey}
        >
          <Option key="challenges" value="challenges">
            Challenges
          </Option>
          <Option key="products" value="products">
            Products
          </Option>
        </Select>
        <div className="extra">{extraTabButtons()}</div>
      </div>
      <Row gutter={50} className="mb-40">
        <Col md={24}>
          <Tabs
            activeKey={tabkey}
            className="main-tab"
            onChange={onChnageKey}
            tabBarExtraContent={extraTabButtons()}
          >
            <TabPane tab="Challenges" key="challenges">
              <TaskTab
                showInitiativeName={true}
                showProductName={true}
                setFilterModal={setFilterModal}
                filterModal={filterModal}
              />
            </TabPane>
            <TabPane tab="Products" key="products">
              <ProductTab/>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
      <CreatePersonModal modal={createPersonModal} closeModal={setCreatePersonModal}/>
    </Content>
  );
};

export default Dashboard;
