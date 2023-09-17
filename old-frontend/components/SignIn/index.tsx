import React from "react";
import Link from 'next/link';
import {Button, Checkbox, Col, Form, Input, Row, Typography} from "antd";


const SignIn: React.FunctionComponent = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
      // if (data.status) {
      //   message.success(data.message);
      // } else {
      //   message.error(data.message);
      // }
  };

  return (
    <Row justify="center" style={{marginTop: 100}}>
      <Col xs={20} sm={13} md={10} lg={7} xl={6} xxl={5}>
        <Row>
          <Typography.Text strong style={{fontSize: '1.8rem'}}>Sign In</Typography.Text>
        </Row>
        <Row style={{marginBottom: 30}}>
          <Typography.Text style={{marginRight: 5}}>Don't you have an account?</Typography.Text>
          <Link href="/sign-up">Sign Up here</Link>
        </Row>

        <Form
          layout="vertical"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            name="email"
            label="Email address"
            rules={[{required: true, message: 'Please input your email address'}]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{required: true, message: 'Please input your password'}]}
          >
            <Input.Password/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Log In</Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default SignIn;