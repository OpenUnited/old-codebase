import React, {useEffect} from 'react';
import {Modal, Button, Select, Form} from 'antd';
import {useQuery} from "@apollo/react-hooks";
import {GET_CATEGORIES, GET_TAGS} from "../../graphql/queries";
import {connect} from "react-redux";
import {WorkState} from "../../lib/reducers/work.reducer";
import {saveTags, saveCategories} from "../../lib/actions";

const { Option } = Select;

type Props = {
  modal?: boolean;
  closeModal: any;
  submit: Function,
  tags: any[],
  categories: any[],
  saveTags: Function,
  saveCategories: Function,
  initialForm: any
};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const InitiativeFilterModal: React.FunctionComponent<Props> = ({
  modal,
  closeModal,
  submit,
  tags,
  categories,
  saveTags,
  saveCategories,
  initialForm
}) => {
  const [form] = Form.useForm()
  const handleCancel = () => closeModal(!modal);

  const {data: tagsData} = useQuery(GET_TAGS);
  const {data: categoriesData} = useQuery(GET_CATEGORIES);

  useEffect(() => {
    if (tagsData && tagsData.tags) saveTags({allTags: tagsData.tags})
  }, [tagsData]);

  useEffect(() => {
    if (categoriesData && categoriesData.categories) saveCategories({allCategories: categoriesData.categories})
  }, [categoriesData]);

  const onFinish = (values: any) => submit(values);

  const filterOption = (input: string, option: any) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  const clearFilter = () => {
    form.resetFields();
    form.setFieldsValue({
      categories: [],
      tags: [],
      statuses: [1],
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
          <Button key="submit" type="primary" htmlType="submit" form="in-filter-form">
            Filter
          </Button>,
        ]}
        maskClosable={false}
      >
        <Form {...layout}
              form={form}
              initialValues={initialForm}
              name="control-ref"
              id="in-filter-form"
              onFinish={onFinish}>
          <Form.Item name="categories" label="Category">
            <Select
              placeholder="Select a category"
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
                <Option key={tag.id} value={tag.id}>{tag.name}</Option>)}
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
              <Option value={1}>Active</Option>
              <Option value={2}>Completed</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

const mapStateToProps = (state: any) => ({
  tags: state.work.allTags,
  categories: state.work.allCategories,
});

const mapDispatchToProps = (dispatch: any) => ({
  saveTags: (data: WorkState) => dispatch(saveTags(data)),
  saveCategories: (data: WorkState) => dispatch(saveCategories(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InitiativeFilterModal);
