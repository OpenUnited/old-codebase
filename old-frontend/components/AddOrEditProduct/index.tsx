import React, {ChangeEvent, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Row, message, Input, Button, Col, Switch} from 'antd';
import {useMutation} from '@apollo/react-hooks';
import {useRouter} from 'next/router';
import {CREATE_PRODUCT_REQUEST, DELETE_PRODUCT, UPDATE_PRODUCT} from '../../graphql/mutations';
import Loading from "../../components/Loading";
import RichTextEditor from "../../components/RichTextEditor";
import {getProp} from "../../utilities/filters";
import {Upload} from 'antd';
import ImgCrop from 'antd-img-crop';
import 'antd/es/modal/style';
import 'antd/es/slider/style';
import showUnAuthModal from "../UnAuthModal";


const {TextArea} = Input;


interface IAddOrEditProductProps {
  isAdding?: boolean,
  isEditing?: boolean,
  productData?: any,
  toUpdate?: number,
  toDelete?: number,
  closeModal?: Function,
  loading?: boolean,
  loginUrl: string;
  registerUrl: string;
}

const AddOrEditProduct: React.FunctionComponent<IAddOrEditProductProps> = (
  {
    isAdding = false,
    isEditing = false,
    productData,
    toUpdate = 0,
    toDelete = 0,
    loading = false,
    loginUrl,
    registerUrl
  }
  ) => {
    const router = useRouter();
    const {productSlug} = router.query;

    const [fileList, setFileList] = useState<any>([]);
    const [photo, setPhoto] = useState(null);

    const productPhoto = getProp(productData, 'photo', null);

    useEffect(() => {
      if (productPhoto) {
        setFileList([{
          uid: '-1',
          url: productPhoto,
        }]);
      }
    }, [productPhoto]);

    useEffect(() => {
      checkFileList();
    }, [fileList]);

    const checkFileList = () => {
      let filePhoto = null;
      if (fileList.length > 0) {
        const thumbUrl = getProp(fileList[0], 'thumbUrl', null);
        const url = getProp(fileList[0], 'url', null);

        if (thumbUrl !== null) {
          filePhoto = thumbUrl;
          setPhoto(filePhoto);
        } else if (url) {
          filePhoto = url;
        }
        setPhoto(filePhoto);
      } else {
        setPhoto(filePhoto);
      }
      return filePhoto;
    }

    const [name, setName] = useState(isEditing ? getProp(productData, 'name', '') : '');
    const [shortDescription, setShortDescription] = useState(isEditing ? getProp(productData, 'shortDescription', '') : '');
    const [fullDescription, setFullDescription] = useState(isEditing ? getProp(productData, 'fullDescription', '') : '');
    const [website, setWebsite] = useState(isEditing ? getProp(productData, 'website', '') : '');
    const [videoUrl, setVideoUrl] = useState(isEditing ? getProp(productData, 'videoUrl', '') : '');
    const [isPrivate, setIsPrivate] = useState(isEditing ? getProp(productData, 'isPrivate', false) : false);

    const [isShowLoading, setIsShowLoading] = useState(loading ? loading : false);

    const [createProduct] = useMutation(CREATE_PRODUCT_REQUEST, {
      onCompleted(res) {
        const status = getProp(res, 'createProductRequest.status', false);
        const messageText = getProp(res, 'createProductRequest.message', '');

        if (status) {
          message.success("We have received your request to add a product and will review it", 10).then();
          router.push('/').then();
        } else {
          message.error(messageText).then();
          setIsShowLoading(false);
        }
      },
      onError(e) {
        setIsShowLoading(false);

        if(e.message === "The person is undefined, please login to perform this action") {
          showUnAuthModal("perform this action", loginUrl, registerUrl, true);
        } else {
          message.error('Error with product creation').then();
        }
      }
    });

    const [updateProduct] = useMutation(UPDATE_PRODUCT, {
      onCompleted(res) {
        const status = getProp(res, 'updateProduct.status', false);
        const messageText = getProp(res, 'updateProduct.message', '');

        if (status) {
          const newSlug = getProp(res, 'updateProduct.newSlug', '');
          const newLink = (newSlug ? `/${getProp(productData, 'owner', 'products')}/${newSlug}/` : '/');
          router.push('/').then(() => {
            router.push(newLink).then(() => {
              message.success(messageText).then();
            });
          });
        } else {
          message.error(messageText).then();
          setIsShowLoading(false);
        }
      },
      onError(e) {
        setIsShowLoading(false);

        if(e.message === "The person is undefined, please login to perform this action") {
          showUnAuthModal("perform this action", loginUrl, registerUrl, true);
        } else {
          message.error('Error with product updating').then();
        }
      }
    });

    const [deleteProduct] = useMutation(DELETE_PRODUCT, {
      variables: {
        slug: productSlug
      },
      onCompleted(res) {
        const status = getProp(res, 'deleteProduct.status', false);
        const messageText = getProp(res, 'deleteProduct.message', '');

        if (status) {
          router.push('/').then(() => {
            message.success(messageText).then();
          });
        } else {
          message.error(messageText).then();
          setIsShowLoading(false);
        }
      },
      onError(e) {
        setIsShowLoading(false);

        if(e.message === "The person is undefined, please login to perform this action") {
          showUnAuthModal("perform this action", loginUrl, registerUrl, true);
        } else {
          message.error('Error with product deletion').then();
        }
      }
    });

    const addNewProduct = () => {
      if (!name || !shortDescription || !website) {
        message.error("Please fill the form fields").then();
        return;
      }

      let filePhoto = checkFileList();

      setIsShowLoading(true);

      createProduct({
        variables: {
          productInput: {
            name,
            shortDescription,
            fullDescription,
            website,
            videoUrl,
            isPrivate
          },
          file: filePhoto
        }
      }).then();
    }

    const updateCurrentProduct = () => {
      if (!name || !shortDescription || !website) {
        message.error("Please fill the form fields").then();
        return;
      }

      setIsShowLoading(true);

      updateProduct({
        variables: {
          productInput: {
            slug: getProp(productData, 'slug', ''),
            name,
            shortDescription,
            fullDescription,
            website,
            videoUrl,
            isPrivate
          },
          file: photo
        }
      }).then();
    }

    const onUploadChange = ({fileList: newFileList}: any) => {
      setFileList(newFileList);
    };

    const onImagePreview = async (file: any) => {
      let src = file.url;
      if (!src) {
        src = await new Promise(resolve => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj);
          reader.onload = () => resolve(reader.result);
        });
      }
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      imgWindow && imgWindow.document.write(image.outerHTML);
    };

    useEffect(() => {
      if (toUpdate !== 0) {
        updateCurrentProduct();
      }
    }, [toUpdate]);

    useEffect(() => {
      if (toDelete !== 0) {
        deleteProduct().then();
      }
    }, [toDelete]);

    useEffect(() => {
      setIsShowLoading(loading);
    }, [loading])

    return (
      <>
        {
          isShowLoading ? <Loading/> :
            <>
              <Row style={{marginBottom: 25}}>
                <ImgCrop rotate>
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onUploadChange}
                    onPreview={onImagePreview}
                  >
                    {fileList.length < 1 && '+ Upload'}
                  </Upload>
                </ImgCrop>
              </Row>
              <Row className="mb-15">
                <label>Product name*:</label>
                <Input
                  placeholder="Product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Row>
              <Row style={{width: '100%'}} className='mb-15'>
                <Row style={{width: '100%'}}>
                  <Col span={24}>
                    <label>Short description*:</label>
                  </Col>
                </Row>
                <Row style={{width: '100%'}}>
                  <Col span={24}>
                    <TextArea
                      placeholder="Short description"
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      autoSize={{minRows: 3}}
                      maxLength={256}
                      showCount
                    />
                  </Col>
                </Row>
              </Row>
              <Row>
                <label>Full description:</label>

                <RichTextEditor initialHTMLValue={fullDescription} onChangeHTML={setFullDescription}/>
              </Row>
              <Row className='mb-15'>
                <label>Website url *:</label>
                <Input
                  placeholder="Website url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </Row>
              <Row className="mb-15">
                <label>Video url (optional):</label>
                <Input
                  placeholder="Video url"
                  value={videoUrl}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value)}
                />
              </Row>
              <Row>
                <label>Product visibility:</label>
                <Switch
                  checked={isPrivate}
                  onChange={(checked: boolean) => {
                    setIsPrivate(checked)
                  }}
                  style={{marginLeft: 15}}
                />
              </Row>
              {
                isAdding &&
                <Row justify="end" style={{margin: '30px 0'}}>
                    <Button onClick={() => router.back()} style={{marginRight: 10}}>Back</Button>
                    <Button onClick={() => addNewProduct()} type="primary">Add</Button>
                </Row>
              }
            </>
        }
      </>
    );
  }
;

const mapStateToProps = (state: any) => ({
  loginUrl: state.work.loginUrl,
  registerUrl: state.work.registerUrl,
});

export default connect(
  mapStateToProps,
  null
)(AddOrEditProduct);