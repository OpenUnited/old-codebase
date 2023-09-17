import React from "react";
import {Layout, Row, Col} from "antd";
// @ts-ignore
import Logo from "../../public/assets/logo.svg";
import Link from "antd/lib/typography/Link";


const Footer: React.FunctionComponent = () => {
  return (
    <>
      <Layout.Footer style={{ textAlign: "center", marginTop: 40 }}>
        <Row className="container footer-container">
          <Col md={24}>
            <Row className="footer-content">
              <Col span={24} md={6} xl={8} lg={8} className="logo-container">
                <Link href="/">
                  <img src={Logo} alt="logo"/>
                </Link>
              </Col>
              <Col span={24} md={18} lg={16} xl={16}>
                <Row>
                  <Col lg={6} span={12}>
                    <Link className="gray-link" href="/enterprise-customers">
                      {/*<a className="text-grey-9">Enterprise Customers</a>*/}
                      Enterprise Customers
                    </Link>
                  </Col>
                  <Col lg={6} span={12}>
                    <Link className="gray-link" href="/privacy-policy">
                      {/*<a className="text-grey-9">Privacy Policy</a>*/}
                      Privacy Policy
                    </Link>
                  </Col>
                  <Col lg={6} span={12}>
                    <Link className="gray-link" href="/terms-of-use">
                      {/*<a className="text-grey-9">Terms of Use</a>*/}
                      Terms of Use
                    </Link>
                  </Col>
                  <Col lg={6} span={12}>
                    <Link className="gray-link" href="/contact-us">
                      {/*<a className="text-grey-9">Contact Us</a>*/}
                      Contact Us
                    </Link>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Layout.Footer>
    </>
  );
};

export default Footer;
