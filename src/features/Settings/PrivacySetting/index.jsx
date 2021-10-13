import React, { useState } from "react";
import "./PrivacySetting.scss";

import {
  Tabs,
  Form,
  Input,
  InputNumber,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
} from "antd";
import { AppleOutlined, AndroidOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AsyncUpdatePassword } from "../SettingSlice";
import { ToastContainer } from "react-toastify";

const { TabPane } = Tabs;

export default function PrivacySetting() {
  const [passwordState, setPasswordState] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const onSubmit = (values) => {
    console.log("Received values of form: ", values);
    values.id = user._id;
    dispatch(AsyncUpdatePassword(values))
    form.resetFields();
  };
  console.log(passwordState);

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 10,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 0,
      },
    },
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };
  
  return (
    <div className="privacy__setting">
      <div className="row">
        <div className="col-lg-6 col-md-12 col-12">
          <Tabs defaultActiveKey="1">
            <TabPane tab={<span>Change Password</span>} key="1">
              <Form
                {...formItemLayout}
                form={form}
                name="changePassword"
                onFinish={onSubmit}
              >
                <Form.Item
                  name="password"
                  label="Old password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Old password",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  name="newPassword"
                  label="Password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  name="confirmNewPassword"
                  label="Confirm Password"
                  dependencies={["newPassword"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          new Error(
                            "The two passwords that you entered do not match!"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                  <Button htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane tab={<span>Change Email</span>} key="2">
              Tab 2
            </TabPane>
          </Tabs>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}
