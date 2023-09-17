import React, {useEffect, useState} from "react";
import {Col, Row, Typography} from "antd";
import {useRouter} from "next/router";
import {useQuery} from "@apollo/react-hooks";
import {GET_LICENSE, GET_PRODUCT_INFO_BY_ID} from "../../../graphql/queries";
import {getProp} from "../../../utilities/filters";
import Loading from "../../../components/Loading";
import parse from "html-react-parser";


const ContributionLicenseAgreement: React.FunctionComponent = () => {
  const router = useRouter();
  const {productSlug} = router.query;

  const [productTitle, setProductTitle] = useState('');
  const [license, setLicense] = useState('');

  const {data: licenseOriginal, error: licenseError, loading: licenseLoading} = useQuery(GET_LICENSE, {
    variables: {productSlug}
  });
  const {data: productOriginal, error: productError, loading: productLoading} = useQuery(GET_PRODUCT_INFO_BY_ID, {
    variables: {slug: productSlug}
  });

  useEffect(() => {
    if (!licenseError) {
      setLicense(getProp(licenseOriginal, 'license.agreementContent', ''));
    }
  }, [licenseOriginal]);

  useEffect(() => {
    if (!productError) {
      setProductTitle(getProp(productOriginal, 'product.name', ''));
    }
  }, [productOriginal]);

  if (licenseLoading || productLoading) return <Loading/>;

  return (
    <>
      <Row justify="center" style={{padding: '20px 0', textAlign: 'center'}}>
        <Col>
          <Typography.Title>
            <Typography.Link className="text-grey-9" href={`/${getProp(productOriginal, 'product.owner', '')}/${productSlug}`}>{productTitle}</Typography.Link>
          </Typography.Title>
          <Typography.Title level={2}>Contribution License Agreement</Typography.Title>
        </Col>
      </Row>

      <Row justify="center" className="html-description">
        <Col span={20}>
          {parse(license)}
        </Col>
      </Row>
    </>
  )
}

export default ContributionLicenseAgreement;