import React, {useEffect, useState} from 'react';
import {Modal, Select, Form, Typography, Input, message, TreeSelect} from 'antd';
import {useMutation, useQuery} from "@apollo/react-hooks";
import {connect} from "react-redux";
import {WorkState} from "../../lib/reducers/work.reducer";
import RichTextEditor from "../RichTextEditor";
import { InfoCircleOutlined } from "@ant-design/icons";
import "./style.less";
import {UPDATE_CONTRIBUTION_GUIDE, CREATE_CONTRIBUTION_GUIDE} from "../../graphql/mutations";
import { GET_CATEGORIES_LIST } from "../../graphql/queries";
import showUnAuthModal from "../UnAuthModal";

const { Option } = Select;
const {TreeNode} = TreeSelect;

interface Category {
  active: boolean,
  selectable: boolean,
  name: string,
  children: Category[]
}

type Props = {
  modal: boolean;
  closeModal: (updateGuides?: boolean) => void;
  productSlug?: string,
  item: null | {
    id?: string,
    title: string,
    description: string,
    category: Category
  },
  loginUrl: string;
  registerUrl: string;
};

const ContributionGuideModal: React.FunctionComponent<Props> = ({
  modal,
  closeModal,
  item,
  productSlug,
  loginUrl,
  registerUrl,
}) => {
  const [allCategories, setAllCategories] = React.useState([]);
  const [category, setCategory] = useState("");
  const {data: categories} = useQuery(GET_CATEGORIES_LIST);

  const makeCategoriesTree = (categories: Category[]) => {
    return categories.map((category, index) => (
        <TreeNode id={index} selectable={category.selectable} value={category.name} title={category.name}>
            {category.children ? makeCategoriesTree(category.children) : null}
        </TreeNode>));
  }

  useEffect(() => {
    if (categories?.taskCategoryListing) {
        setAllCategories(JSON.parse(categories.taskCategoryListing));
    }
  }, [categories]);

  const findCategory = (categories: Category[], value: string, parent: Category): Category | undefined => {
    for (let category of categories) {
        if (category.children && category.children.length > 0) {
            const skill = findCategory(category.children, value, category);
            if (skill) {
                return skill;
            }
        } else if (category.name === value) {
            category['parent'] = parent;
            return category;
        }
    }
  }


  const [form] = Form.useForm()
  const handleCancel = () => {
    closeModal();
    clearData();
  }
  const [description, setDescription] = useState(item?.description || "");
  const [longDescriptionClear, setLongDescriptionClear] = useState(0);
  let initialForm = {
    title: "",
    description: "",
    category: "",
  };

  const [createGuide] = useMutation(CREATE_CONTRIBUTION_GUIDE, {
    onCompleted(res) {
      if (res.createContributionGuide.status) {
        message.success(res.createContributionGuide.message).then();
        closeModal(true);
      } else {
        message.error(res.createContributionGuide.message).then();
      }
    },
    onError(e) {
      if(e.message === "The person is undefined, please login to perform this action") {
        closeModal(true);
        showUnAuthModal("perform this action", loginUrl, registerUrl, true);
      } else {      
        message.error(e.message || "Can't save the guide").then();
      }
    }
  })

  const [updateGuide] = useMutation(UPDATE_CONTRIBUTION_GUIDE, {
    onCompleted(res) {
      if (res.updateContributionGuide.status) {
        message.success(res.updateContributionGuide.message).then();
        closeModal(true);
      } else {
        message.error(res.updateContributionGuide.message).then();
      }
    },
    onError(e) {
      if(e.message === "The person is undefined, please login to perform this action") {
        closeModal(true);
        showUnAuthModal("perform this action", loginUrl, registerUrl, true);
      } else {      
        message.error(e.message || "Can't save the guide").then();
      }
    }
  })

  const clearData = () => {
    form.resetFields();
    setLongDescriptionClear(prev => prev + 1);
  };

  useEffect(() => {
    if (item) {
      form.setFields([
        {name: "title", value: item.title},
        {name: "description", value: item.description},
        {name: "category", value: item.category.name},
      ]);
      setDescription(item.description)
    }
  }, [item])

  const onFinish = (values: any) => {
    if (!values.title) {
      message.error("Guide title is required. Please fill out headline").then();
      return;
    }
    if (!description || description === "<p></p>") {
      message.error("Guide description is required. Please fill out description").then();
      return;
    }
    const input = {
      description,
      title: values.title,
      category: values.category ? findCategory(allCategories, values.category, null).id : "",
      productSlug
    };
    if (item) {
      updateGuide({variables: {input, id: item.id}}).then()
    } else {
      createGuide({variables: {input}}).then()
    }
  }

  const filterOption = (input: string, option: any) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  return (
    <>
      <Modal
        title={false}
        visible={modal}
        width={720}
        onCancel={handleCancel}
        okText="Save"
        className="contribution-guide-modal"
        okButtonProps={{
          htmlType: "submit",
          form: "contribution-guide-form"
        }}
      >
        <div className="info-container">
          <InfoCircleOutlined style={{fontSize: 20}} />
        </div>

        <Form layout="vertical"
              form={form}
              initialValues={initialForm}
              name="control-ref"
              id="contribution-guide-form"
              onFinish={onFinish}>
          <Typography.Text  style={{paddingBottom: 20, display: "block"}}>
            The guide you will add here will be accessible during task creation and you can add it to the tasks.
            Give it a descriptive title so you can easily distinguish it during the task creation. Optionally
            you can associate it with specific stacks and the task that includes any of these stacks will have
            this contribution guide by default where you can change if necessary.
          </Typography.Text>
          <Form.Item name="title" label="Guide Title *">
            <Input name="title" />
          </Form.Item>
          <Form.Item name="description" label="Guide Content *">
            <RichTextEditor initialHTMLValue={description}
                            onChangeHTML={setDescription}
                            clear={longDescriptionClear} />
          </Form.Item>
          <Form.Item name="category" label="Guide Category">
            <TreeSelect
                allowClear
                onChange={setCategory}
                placeholder="Select category"
                value={category}
            >
                {allCategories && makeCategoriesTree(allCategories)}
            </TreeSelect>
          </Form.Item>

        </Form>
      </Modal>
    </>
  );
}

const mapStateToProps = (state: any) => ({
  loginUrl: state.work.loginUrl,
  registerUrl: state.work.registerUrl,
});

export default connect(
  mapStateToProps,
  null
)(ContributionGuideModal);
