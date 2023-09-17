import React from "react";
import Link from 'next/link';
import {Button, Checkbox, Col, Form, Input, message, Row, Typography} from "antd";
import {useMutation} from "@apollo/react-hooks";
import {CREATE_PERSON} from "../../graphql/mutations";


const SignUp: React.FunctionComponent = () => {
  const [createPerson] = useMutation(CREATE_PERSON);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    if (values.remember) {
      const res = await createPerson({
        variables: {
          firstName: values['first-name'],
          lastName: values['last-name'],
          emailAddress: values['email'],
          password: values['password'],
          password2: values['password-2']
        }
      }).then();

      const data = res.data.createPerson;

      if (data.status) {
        message.success(data.message);
      } else {
        message.error(data.message);
      }
    }
  };

  return (
    <Row justify="center" style={{marginTop: 100}}>
      <Col xs={20} sm={13} md={10} lg={7} xl={6} xxl={5}>
        <Row>
          <Typography.Text strong style={{fontSize: '1.8rem'}}>Sign Up</Typography.Text>
        </Row>
        <Row style={{marginBottom: 30}}>
          <Typography.Text style={{marginRight: 5}}>Do you already have an account?</Typography.Text>
          <Link href="/sign-in">Sign In here</Link>
        </Row>

        <Form
          layout="vertical"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            name="first-name"
            label="First name"
            rules={[{required: true, message: 'Please input your first name'}]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name="last-name"
            label="Last name"
            rules={[{required: true, message: 'Please input your last name'}]}
          >
            <Input/>
          </Form.Item>
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
          <Form.Item
            name="password-2"
            label="Confirm password"
            rules={[{required: true, message: 'Passwords do not match'}]}
          >
            <Input.Password/>
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked"
            rules={[{required: true, message: 'You need to agree Community Policy'}]}
          >
            <Checkbox>I Agree With Community Policy</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Create Account</Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default SignUp;