import React, {useState} from "react";
import {connect} from 'react-redux';
import {Button, Table, Space, Typography, message, Spin} from "antd";
import {useMutation, useQuery, useLazyQuery} from "@apollo/react-hooks";
import {useRouter} from "next/router";
import {GET_CONTRIBUTOR_GUIDES, GET_LOGGED_IN_USER} from "../../graphql/queries";
import { PlusSquareOutlined } from "@ant-design/icons";
import ContributionGuideModal from "../ContributionGuideModal";
import parse from "html-react-parser";
import DeleteModal from "../Products/DeleteModal";
import {DELETE_CONTRIBUTION_GUIDE} from "../../graphql/mutations";
import showUnAuthModal from "../UnAuthModal";

type Params = {
  loginUrl: string;
  registerUrl: string;
}

const SettingsContributing: React.FunctionComponent<Params> = ({loginUrl, registerUrl}) => {
  const router = useRouter();
  const {productSlug} = router.query;
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [actionName, setActionName] = useState("");

  const {data, refetch} = useQuery(GET_CONTRIBUTOR_GUIDES, {
    variables: {productSlug}
  });

  const [deleteGuide] = useMutation(DELETE_CONTRIBUTION_GUIDE, {
    variables: {
      id: currentItem?.id || null
    },
    onCompleted(res) {
      if (res.deleteContributionGuide.isExists) {
        message.success("Contributor guide has been removed successfully").then();
        setDeleteModal(false);
        refetch().then();
      } else {
        message.error("Contributor guide was not found").then();
      }
    },
    onError(e) {
      if(e.message === "The person is undefined, please login to perform this action") {
        setDeleteModal(false);
        showUnAuthModal("perform this action", loginUrl, registerUrl, true);
      } else {      
        message.error(e.message || "Can't delete the guide").then();
      }
    }
  });

  const [checkLoggedInUser, { data: loggedInUser, loading: checkLoggedInUserLoading }] = useLazyQuery(GET_LOGGED_IN_USER, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    onCompleted() {
      if(actionName === "edit_modal") {
        setShowModal(true);
      } else if(actionName === "delete_modal") {
        setDeleteModal(true);
      }
    },
    onError(e) {
        if(e.message === "The person is undefined, please login to perform this action") {
            showUnAuthModal("create a new capability", loginUrl, registerUrl, true);
        }
    },

  });

  const showEditModal = (currentItem) => {
    setCurrentItem(currentItem);
    setActionName("edit_modal");
    checkLoggedInUser();
  };

  const showDeleteModal = (currentItem) => {
    setCurrentItem(currentItem);
    setActionName("delete_modal");
    checkLoggedInUser();
  };

  const tableColumns = [
    {
      title: "Guide Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Guide Content",
      dataIndex: "description",
      key: "description",
      render: description => parse(description)
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => showEditModal(record)}>Edit</a>
          <a onClick={() => showDeleteModal(record)}>Delete</a>
        </Space>
      ),
    }
  ];

  const closeModal = (updateGuides = false) => {
    setShowModal(false);
    if (updateGuides) refetch().then();
  }

  return (
    <>
      <Spin
          wrapperClassName={"full-width"}
          tip="Loading..."
          spinning={checkLoggedInUserLoading}
          delay={200}
        >
        <Space direction="vertical" size={20}>
          <Typography.Text strong style={{fontSize: '1.8rem'}}>Contributing Guideline</Typography.Text>
          <Typography.Text>
            Here you can add the list of guides that help contributors to do their task better. Optionally
            you can add stacks in front of each guides and if you create tasks with this stack, these
            guides appears in the contribution guide section.
          </Typography.Text>
          <Button type="text"
                  style={{padding: 0}}
                  className="d-flex-align-center"
                  onClick={() => showEditModal(null)}>
            <PlusSquareOutlined style={{fontSize: 20, height: 20}} /> Add a new guide
          </Button>
          {data?.contributorGuides && data.contributorGuides.length > 0 &&
          <Table columns={tableColumns}
                dataSource={data.contributorGuides}
                rowKey="id"
                pagination={false} />}
        </Space>

        {showModal &&
          <ContributionGuideModal 
            modal={showModal} item={currentItem} 
            productSlug={productSlug.toString()} closeModal={closeModal}/>
        }

        <DeleteModal
          modal={deleteModal}
          closeModal={() => setDeleteModal(false)}
          submit={deleteGuide}
          description="Are you sure you want to delete contributor guide?"
          title="Delete Contributor Guide"
        />
      </Spin>
    </>
  )
}

const mapStateToProps = (state: any) => ({
  loginUrl: state.work.loginUrl,
  registerUrl: state.work.registerUrl,
});

export default connect(
  mapStateToProps,
  null
)(SettingsContributing);
