import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Modal, Row, Input, Select, message, TreeSelect} from 'antd';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {
  GET_CAPABILITIES_BY_PRODUCT, GET_PRODUCTS_SHORT
} from '../../graphql/queries';
import {CREATE_IDEA, UPDATE_IDEA} from '../../graphql/mutations';
import {RICH_TEXT_EDITOR_WIDTH} from '../../utilities/constants';
import {getProp} from "../../utilities/filters";
import RichTextEditor from "../RichTextEditor";
// import {IDEA_TYPES} from "../../graphql/types";
import showUnAuthModal from "../UnAuthModal";

const {Option} = Select;

type Props = {
  modal?: boolean,
  productSlug?: string,
  closeModal: any,
  currentProduct?: any,
  modalType?: boolean,
  submit?: any;
  idea: {
    id: string,
    headline: string,
    description: string,
    product: {
      id: string
    },
    recentCapability: {
      id
    } | null,
    ideaType: string,
  },
  editMode?: boolean;
  loginUrl: string;
  registerUrl: string;
};

const AddEditIdea: React.FunctionComponent<Props> = (
  {
    modal = false,
    productSlug,
    closeModal,
    editMode = false,
    idea,
    submit,
    loginUrl,
    registerUrl
  }
) => {
  const [headline, setHeadline] = useState(editMode ? idea.headline : '');

  const [capabilityTreeData, setCapabilityTreeData] = useState([]);
  const [description, setDescription] = useState(editMode ? idea.description : '');
  const [descriptionClear, setDescriptionClear] = useState(0);
  // const [ideaType, setIdeaType] = useState(editMode ? idea.ideaType : '');
  const [product, setProduct] = useState(editMode ? idea.product?.id || null : null);
  const [capability, setCapability] = useState(
    editMode && idea.relatedCapability ? idea.relatedCapability?.id || null : null
  );

  const {data: capabilitiesData, loading: capabilitiesLoading, refetch: capabilitiesRefetch} =
    useQuery(GET_CAPABILITIES_BY_PRODUCT, {
      variables: {productSlug},
      fetchPolicy: "no-cache"
    });

  const {data: productsData} = useQuery(GET_PRODUCTS_SHORT, {
    fetchPolicy: "no-cache"
  });
  const [createIdea] = useMutation(CREATE_IDEA);
  const [updateIdea] = useMutation(UPDATE_IDEA);

  const filterOption = (input: string, option: any) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  const formatData = (data: any) => {
    return data.map((node: any) => {
      const nodeId = getProp(node, 'id');

      return {
        id: nodeId,
        title: getProp(node, 'data.name'),
        value: nodeId,
        description: getProp(node, 'data.description', ''),
        videoLink: getProp(node, 'data.video_link', ''),
        children: node.children ? formatData(getProp(node, 'children', [])) : [],
        expanded: isExpandedById(nodeId)
      }
    })
  }

  const isExpandedById = (id: number, data?: any) => {
    if (!data) data = capabilityTreeData;
    let isExpanded: boolean = false;

    data.map((node: any) => {
      if (getProp(node, 'id') === id && getProp(node, 'expanded', false)) {
        isExpanded = true;
        return;
      }

      if (getProp(node, 'children', []).length > 0) {
        if (isExpandedById(id, node.children)) {
          isExpanded = true;
        }
      }
    });

    return isExpanded;
  }

  const convertDataAndSetTree = (capabilities: any) => {
    let capabilitiesData: string = "";
    if (capabilities && capabilities.capabilities) {
      capabilitiesData = getProp(capabilities, 'capabilities', '');
      try {

        if (capabilitiesData !== "") {
          capabilitiesData = JSON.parse(capabilitiesData);
          //@ts-ignore
          setCapabilityTreeData(capabilitiesData.length > 0 && capabilitiesData[0].children
            //@ts-ignore
            ? formatData(capabilitiesData[0].children) : [])
        } else {
          setCapabilityTreeData([]);
        }
      } catch (e) {
        if (e instanceof SyntaxError) setCapabilityTreeData([]);
      }
    } else {
      setCapabilityTreeData([]);
    }
  }

  const filterTreeNode = (input: string, node: any) => node.title.toLowerCase().indexOf(input.toLowerCase()) !== -1;

  useEffect(() => {
    if (!capabilitiesLoading && !capabilitiesData.hasOwnProperty("error")) {
      convertDataAndSetTree(capabilitiesData);
    }
  }, [capabilitiesData]);

  useEffect(() => {
    if (product && productsData?.products) {
      const searchedProduct = productsData.products.find(p => p.id === product);
      if (searchedProduct) {
        setCapability(null);
        capabilitiesRefetch({productSlug: searchedProduct.slug})
      }
    }
  }, [product]);

  useEffect(() => {
    if (!editMode && productsData?.products) {
      const searchedProduct = productsData.products.find(p => p.slug === productSlug);
      if (searchedProduct) setProduct(searchedProduct.id);
    }
  }, [productsData, editMode, productSlug])

  // @ts-ignore
  const handleOk = async () => {
    if (!headline) {
      message.error("Headline is required. Please fill out headline");
      return;
    }
    if (!description || description === '<p></p>') {
      message.error("Long description is required. Please fill out description");
      return;
    }
    if (!product) {
      message.error("Product is required. Please select the product");
      return;
    }
    // if (ideaType === "") {
    //   message.error("Please select what best matches your idea");
    //   return;
    // }

    await addNewIdea();
  };

  const handleCancel = () => {
    closeModal(!modal);
    clearData();
  };

  const clearData = () => {
    setHeadline("");
    setCapability(null);
    setProduct(null);
    setDescription("");
    setDescriptionClear(prev => prev + 1);
    // setIdeaType(null);
  }

  // @ts-ignore
  const addNewIdea = async () => {
    const input = {
      headline,
      description,
      productId: parseInt(product),
      relatedCapabilityId: capability !== null ? parseInt(capability) : null,
      // ideaType,
    };

    try {
      const res = editMode
        ? await updateIdea({
          variables: {input, id: parseInt(idea.id)}
        })
        : await createIdea({
          variables: {input}
        })

      const modalTypeText = editMode ? 'updateIdea' : 'createIdea';
      const messageText = getProp(res, `data.${modalTypeText}.message`, '');

      if (messageText && getProp(res, `data.${modalTypeText}.success`, false)) {
        if (submit) submit();
        message.success(messageText);

        if (!editMode) clearData();
      } else if (messageText) {
        message.error(messageText);
      }

      closeModal(!modal);
    } catch (e) {
      if(e.message === "The person is undefined, please login to perform this action") {
        closeModal(!modal);
        showUnAuthModal("perform this action", loginUrl, registerUrl, true);
      } else {
        message.error(e.message);
      }

    }
  }

  return (
    <>
      <Modal
        title={`${editMode ? "Edit" : "Add"} Idea`}
        visible={modal}
        onOk={handleOk}
        onCancel={handleCancel}
        className="add-modal add-task-modal"
        width={RICH_TEXT_EDITOR_WIDTH}
        maskClosable={false}
      >
        <Row className='mb-15'>
          <label>Please give your idea a name *:</label>
          <Input
            placeholder="Headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            required
          />
        </Row>
        <Row className='mb-15'>
          <label>Please describe the idea *:</label>
          <RichTextEditor initialHTMLValue={description} onChangeHTML={setDescription} clear={descriptionClear}/>
        </Row>
        {/*<Row className='mb-15'>*/}
        {/*  <label>Which of the following best matches your idea? *:</label>*/}
        {/*  <Select*/}
        {/*    placeholder='Select an idea type'*/}
        {/*    onChange={setIdeaType}*/}
        {/*    value={ideaType}*/}
        {/*  >*/}
        {/*    <Option value="">-------------</Option>*/}
        {/*    {IDEA_TYPES.map((option: any, idx: number) => (*/}
        {/*      <Option key={`cap${idx}`} value={option.id}>*/}
        {/*        {option.name}*/}
        {/*      </Option>*/}
        {/*    ))}*/}
        {/*  </Select>*/}
        {/*</Row>*/}
        <Row className='mb-15'>
          <label>Product *:</label>
          <Select
            placeholder='Select a product'
            onChange={setProduct}
            filterOption={filterOption}
            showSearch
            value={product}
            disabled={!editMode}
          >
            {productsData?.products && productsData.products.map((option: { id: string, name: string }) =>
              <Option key={`product-${option.id}`} value={option.id}>{option.name}</Option>)}
          </Select>
        </Row>
        <Row className='mb-15'>
          <label>Related capability:</label>
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            value={capability ? capability : null}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Select a capability"
            allowClear
            treeData={capabilityTreeData}
            treeDefaultExpandAll
            filterTreeNode={filterTreeNode}
            onChange={setCapability}
          />
        </Row>
      </Modal>
    </>
  )
}

const mapStateToProps = (state: any) => ({
  user: state.user,
  currentProduct: state.work.currentProduct,
  loginUrl: state.work.loginUrl,
  registerUrl: state.work.registerUrl,
});

export default connect(
  mapStateToProps,
  null
)(AddEditIdea);