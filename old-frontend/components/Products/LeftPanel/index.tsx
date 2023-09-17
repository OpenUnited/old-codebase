import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {useRouter} from 'next/router';
import {Avatar, Button, Menu, Modal, Row, Typography, Image, Select} from 'antd';
import {useQuery} from '@apollo/react-hooks';
import {GET_PRODUCT_BY_SLUG, GET_PRODUCT_INFO_BY_ID} from '../../../graphql/queries';
import {getProp} from '../../../utilities/filters';
import {getInitialName, getUserRole, hasAdminRoots} from '../../../utilities/utils';
import {EditOutlined} from "@ant-design/icons";
import AddOrEditProduct from "../../AddOrEditProduct";
import {RICH_TEXT_EDITOR_WIDTH} from "../../../utilities/constants";


interface ILeftPanelProps {
  user: any
}

interface ILink {
  type: string
  name: string
  url: string
}

const LeftPanel: React.FunctionComponent<ILeftPanelProps> = ({user}): any => {
  const router = useRouter();
  const {productSlug} = router.query;
  const [isMobile, setIsMobile] = useState(false);

  const {data: productOriginal} = useQuery(GET_PRODUCT_BY_SLUG, {
    variables: {slug: productSlug},
    fetchPolicy: "no-cache"
  });

  const [isEditingModalVisible, setIsEditingModalVisible] = useState(false);
  const [isDeleteProductModalVisible, setIsDeleteProductModalVisible] = useState(false);
  const [toUpdate, setToUpdate] = useState(0);
  const [toDelete, setToDelete] = useState(0);

  let links: ILink[] = [
    {url: '/', type: 'summary', name: 'Summary'},
    {url: '/initiatives', type: 'initiatives', name: 'Initiatives'},
    {url: '/challenges', type: 'challenges', name: 'Challenges'},
    {url: '/capabilities', type: 'capabilities', name: 'Product Tree'},
    {url: '/ideas-and-bugs', type: 'ideas-and-bugs', name: 'Ideas & Bugs'},
    {url: '/people', type: 'people', name: 'People'}
  ];

  const userHasAdminRoots = hasAdminRoots((getUserRole(user.roles, productSlug)));

  if (userHasAdminRoots) {
    links.push(
      {url: '/settings', type: 'settings', name: 'Settings'}
    );
  }

  const {data: product, error: productError, loading} = useQuery(GET_PRODUCT_INFO_BY_ID, {
    variables: {slug: productSlug},
    fetchPolicy: "no-cache"
  });

  const productPhoto = getProp(product, 'product.photo', '');

  const selectedIndex: number = links.findIndex((item: any) => {
    return router.asPath.includes(item.type);
  });
  const selectedLink = selectedIndex === -1 ? links[0].type : links[selectedIndex].type;

  const goToDetail = (type: string) => {
    router.push(detailedUrl(type)).then();
  };

  const detailedUrl = (type: string) => {
    return `/${getProp(product, "product.owner", "")}/${productSlug}${type}`;
  };

  const handleWindowSizeChange = () => {
    setIsMobile(window.innerWidth < 768);
  }

  useEffect(() => {
    handleWindowSizeChange();
    window.addEventListener('resize', handleWindowSizeChange);
    return () => window.removeEventListener('resize', handleWindowSizeChange)
  }, [window]);

  if (loading) return null;

  const footerButtons = ([
    //@ts-ignore
    <Button type="danger" style={{float: "left"}} onClick={() => {
      setIsDeleteProductModalVisible(true)
    }}>Delete this product</Button>,
    <Button key="back" onClick={() => setIsEditingModalVisible(false)}>Cancel</Button>,
    <Button key="submit" type="primary" onClick={() => setToUpdate(prev => prev + 1)}>Edit</Button>
  ]);

  const footerDeleteProductButtons = ([
    <Button key="back" onClick={() => setIsDeleteProductModalVisible(false)}>No</Button>,
    //@ts-ignore
    <Button type="danger" onClick={() => setToDelete(prev => prev + 1)}>Yes, I'm sure</Button>
  ]);


  const menu = (
    <Menu mode="inline" selectedKeys={[selectedLink]}>
      {links.map((link: any) => (
        <Menu.Item key={link.type}>
          <a href={detailedUrl(link.url)}>{link.name}</a>
        </Menu.Item>
      ))}
    </Menu>
  );
  const mobileMenu = (
    <div style={{padding: "0 24px 10px 24px"}}>
      <Select defaultValue={selectedLink}
              onChange={(e) => onMenuSelect(e)}
              style={{ width: "100%" }}>
        {links.map((link: any) => (
          <Select.Option key={link.type} value={link.type} url={link.url}>{link.name}</Select.Option>
        ))}
      </Select>
    </div>
  )

  const onMenuSelect = (e) => {
    let link = links.find(l => l.type === e);
    if (link) goToDetail(link.url)
  }

  return (
    <>
      {
        !productError && (
          <div className="left-panel">
            {
              userHasAdminRoots &&
              <Row style={{position: 'absolute', top: 10, right: 18, zIndex: 100}}>
                  <Button
                      onClick={() => setIsEditingModalVisible(true)}
                      type="primary"
                      icon={<EditOutlined/>}
                      style={{marginLeft: 10}}
                  />
              </Row>
            }

            <Row justify="center" style={{marginTop: 15}}>
              {
                productPhoto ?
                  <Image
                    style={{borderRadius: 200}}
                    width={80}
                    src={productPhoto}
                  /> :
                  <Avatar size={80}>
                    {getInitialName(getProp(product, 'product.name', ''))}
                  </Avatar>
              }
            </Row>
            <Row justify="center">
              <Typography.Title
                style={{marginTop: 10, marginBottom: 5, textAlign: 'center'}}
                level={4}
              >{getProp(product, 'product.name', '')}</Typography.Title>
            </Row>
            <Row justify="center">
              <Typography.Link className="gray-link" style={{marginBottom: 20, textAlign: 'center'}}
                               href={getProp(product, 'product.website', '')}>
                {getProp(product, 'product.website', '')}
              </Typography.Link>
            </Row>

            {!isMobile ? menu : mobileMenu}

          </div>
        )
      }

      <Modal
        visible={isEditingModalVisible}
        footer={footerButtons}
        onCancel={() => setIsEditingModalVisible(false)}
        width={RICH_TEXT_EDITOR_WIDTH}
        title="Edit Product"
        maskClosable={false}
      >
        <AddOrEditProduct
          isEditing={true}
          productData={getProp(productOriginal, 'product')}
          toUpdate={toUpdate}
          toDelete={toDelete}
          closeModal={() => setIsEditingModalVisible(false)}
        />
      </Modal>

      <Modal
        visible={isDeleteProductModalVisible}
        footer={footerDeleteProductButtons}
        onCancel={() => setIsDeleteProductModalVisible(false)}
        title="Delete Product"
        maskClosable={false}
      >
        <Typography.Text>Are you sure you want to remove this product permanently?</Typography.Text>
      </Modal>
    </>
  );
};

const mapStateToProps = (state: any) => (
  {
    user: state.user,
    work: state.work,
  }
);

const mapDispatchToProps = () => ({});

const LeftPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftPanel);

export default LeftPanelContainer;
