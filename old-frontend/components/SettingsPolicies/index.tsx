import React, {useEffect, useState} from "react";
import {Button, message, Row, Space, Typography} from "antd";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {GET_LICENSE} from "../../graphql/queries";
import {useRouter} from "next/router";
import {getProp} from "../../utilities/filters";
import {UPDATE_LICENSE} from "../../graphql/mutations";
import {connect} from "react-redux";
import RichTextEditor from "../RichTextEditor";
import showUnAuthModal from "../UnAuthModal";


interface ISettingsPoliciesProps {
  user: any;
  loginUrl: string;
  registerUrl: string;
}

const SettingsPolicies: React.FunctionComponent<ISettingsPoliciesProps> = ({user, loginUrl, registerUrl}) => {
  const router = useRouter();
  const {productSlug} = router.query;

  const [license, setLicense] = useState('');

  const {data: licenseOriginal, error: licenseError} = useQuery(GET_LICENSE, {
    variables: {productSlug}
  });
  const [updateLicense] = useMutation(UPDATE_LICENSE, {
    onCompleted(res) {
      if (getProp(res, 'updateLicense.status', false)) {
        message.success(getProp(res, 'updateLicense.message', 'Success')).then();
      } else {
        message.error(getProp(res, 'updateLicense.message', 'Error')).then();
      }
    },
    onError(e) {
      if(e.message === "The person is undefined, please login to perform this action") {
        showUnAuthModal("perform this action", loginUrl, registerUrl, true);
      } else {      
        message.error('Error with license updating').then();
      }
    }
  })

  useEffect(() => {
    if (!licenseError) {
      setLicense(getProp(licenseOriginal, 'license.agreementContent', ''));
    }
  }, [licenseOriginal]);

  const updateLicenseHandler = () => {
    updateLicense({
      variables: {productSlug, content: license}
    }).then();
  }

  return (
    <>
      <Space direction="vertical" size={20}>
        <Typography.Text strong style={{fontSize: '1.8rem'}}>Contribution License Agreement</Typography.Text>
        <Typography.Text strong>
          You can set Contribution License Agreement here where the contributors need to agree with before start
          contributing to your product
        </Typography.Text>
        {
          !license &&
          <RichTextEditor onChangeHTML={setLicense} toolbarHeight={86}/>
        }
        {
          license &&
          <RichTextEditor initialHTMLValue={license} onChangeHTML={setLicense} toolbarHeight={86}/>
        }
        <Row justify="end" style={{marginBottom: 30}}>
          <Button type="primary" onClick={updateLicenseHandler}>Update license</Button>
        </Row>
      </Space>
    </>
  )
}

const mapStateToProps = (state: any) => ({
  user: state.user,
  loginUrl: state.work.loginUrl,
  registerUrl: state.work.registerUrl,
});

export default connect(
  mapStateToProps,
  null
)(SettingsPolicies);