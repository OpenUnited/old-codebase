import React, {useEffect, useState} from 'react';
import {Modal, Button, Select, Form} from 'antd';
import {
  TASK_LIST_TYPES,
  TASK_LIST_TYPES_FOR_CONTRIBUTOR,
  TASK_LIST_TYPES_FOR_GUEST,
  TASK_PRIORITIES
} from "../../graphql/types";
import {useQuery} from "@apollo/react-hooks";
import {GET_CATEGORIES, GET_TAGS} from "../../graphql/queries";
import {connect} from "react-redux";
import {WorkState} from "../../lib/reducers/work.reducer";
import {saveTags, saveCategories} from "../../lib/actions";
import {getUserRole, hasManagerRoots} from "../../utilities/utils";

const { Option } = Select;

type Props = {
  user: any,
  modal?: boolean;
  closeModal: any;
  submit: Function,
  tags: any[],
  users: any[],
  categories: string[],
  saveTags: Function,
  saveCategories: Function,
  productSlug?: string,
  initialForm: any
};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const FilterModal: React.FunctionComponent<Props> = ({
  user,
  modal,
  closeModal,
  submit,
  tags,
  categories,
  saveTags,
  productSlug,
  saveCategories,
  initialForm
}) => {
  const [form] = Form.useForm();
  const handleCancel = () => closeModal(!modal);
  const [userHasManagerRoots, setUserRoot] = useState(false);
  const [userRoles, setUserRoles] = useState([])

  const {data: tagsData} = useQuery(GET_TAGS);
  const {data: categoriesData} = useQuery(GET_CATEGORIES);

  useEffect(() => {
    if (tagsData && tagsData.tags) saveTags({allTags: tagsData.tags})
  }, [tagsData]);

  useEffect(() => {
    if (categoriesData && categoriesData.categories) saveCategories({allCategories: categoriesData.categories})
  }, [categoriesData]);

  useEffect(() => {
    if (user.isLoggedIn) {
      let userRoles = getUserRole(user.roles, productSlug ? productSlug : "");

      setUserRoles(userRoles);
      setUserRoot(productSlug ? hasManagerRoots(userRoles) : true);
    } else {
      setUserRoot(false)
    }
  }, [user]);

  const onFinish = (values: any) => submit(values);

  const filterOption = (input: string, option: any) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  const clearFilter = () => {
    form.resetFields();
    form.setFieldsValue({
      sortedBy: "priority",
      categories: [],
      tags: [],
      priority: [],
      assignee: [],
      taskCreator: [],
      statuses: [],
    });
  }

  return (
    <>
      <Modal
        title="Filter"
        visible={modal}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={clearFilter}>
            Clear Filter
          </Button>,
          <Button key="submit" type="primary" htmlType="submit" form="filter-form" onClick={() => form.submit()}>
            Filter
          </Button>,
        ]}
        maskClosable={false}
      >
        <Form {...layout}
              form={form}
              initialValues={initialForm}
              name="control-ref"
              id="filter-form"
              onFinish={onFinish}>
          <Form.Item name="sortedBy" label="Sorted By">
            <Select placeholder="Select a priority">
              <Option value="title">Name</Option>
              <Option value="priority">Priority</Option>
              <Option value="status">Status</Option>
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="Priority">
            <Select
              placeholder="Select a priority"
              mode="multiple"
              showSearch={true}
              filterOption={filterOption}
              allowClear
            >
              {TASK_PRIORITIES.map((p: string, index: number) => <Option key={p} value={index}>{p}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="categories" label="Skill">
            <Select
              placeholder="Specify skill"
              mode="multiple"
              showSearch={true}
              filterOption={filterOption}
              allowClear
            >
              {categories.map((category: string) => {
                category = JSON.parse(category.replace(/"/g, '^').replace(/'/g, '"').replace(/^/g, "'").replace(/'/g, ''));
                return (
                  <Option key={category.id} value={category.id}>{category.name}</Option>
                )
              })
              }
            </Select>
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Select
              placeholder="Select a tag"
              mode="multiple"
              showSearch={true}
              filterOption={filterOption}
              allowClear
            >
              {tags.map((tag: {id: string, name: string}) =>
                <Option key={tag.id} value={tag.name}>{tag.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="statuses" label="Status">
            <Select
              placeholder="Select a status"
              mode="multiple"
              showSearch={true}
              filterOption={filterOption}
              allowClear
            >
              {(userHasManagerRoots ? TASK_LIST_TYPES :
                (userRoles.includes("Contributor") ? TASK_LIST_TYPES_FOR_CONTRIBUTOR : TASK_LIST_TYPES_FOR_GUEST))
                .map((option: { id: number, name: string }) => (
                <Option key={`status-${option.id}`} value={option.id}>{option.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

const mapStateToProps = (state: any) => ({
  tags: state.work.allTags,
  user: state.user,
  users: state.work.allUsers,
  categories: state.work.allCategories,
});

const mapDispatchToProps = (dispatch: any) => ({
  saveTags: (data: WorkState) => dispatch(saveTags(data)),
  saveCategories: (data: WorkState) => dispatch(saveCategories(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterModal);
