import { Avatar, Button, Form, Input, Radio, Space, Tabs } from "antd";
import IconMoney from "assets/IconMoney.png";
import MasterCard from "assets/MasterCard.svg";
import Momo from "assets/Momo.png";
import Money from "assets/Money.png";
import Zalopay from "assets/zalopay.png";
import React from "react";
import "./WalletSetting.scss";
import Withdraw from "assets/Withdraw.png";
import { useEffect } from "react";
import TableWallet from "./TableWallet";

const { TabPane } = Tabs;
export default function WalletSetting() {
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 0,
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
        span: 0,
        offset: 0,
      },
      sm: {
        span: 8,
        offset: 8,
      },
    },
  };

  const handleSubmit = (values) => {
    console.log(values);
    form.resetFields();
  };

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  });

  return (
    <div className="wallet__setting">
      <div className="wallet__setting--payment">
        <div className="row">
          <div className="col-lg-8 col-md-12 col-12">
            <Tabs defaultActiveKey="1">
              <TabPane tab={<span>Deposit</span>} key="1">
                <div className="payment-method">
                  <div className="method-items">
                    <div className="items-left">
                      <h2>Payment method</h2>
                      <div className="balance">
                        <img src={Money} alt="Money" />
                        <div className="balance-content">
                          <div className="title">Current Money</div>
                          <Space size={4}>
                            <div className="icon">
                              <Avatar src={IconMoney} size={20} />
                            </div>
                            <div className="money">
                              <span>0.00</span>
                            </div>
                          </Space>
                        </div>
                      </div>
                    </div>

                    <div className="items-right">
                      <Form
                        {...formItemLayout}
                        form={form}
                        onFinish={handleSubmit}
                      >
                        <Form.Item
                          name="method"
                          rules={[
                            {
                              required: true,
                              message: "Please select an option!",
                            },
                          ]}
                        >
                          <Radio.Group>
                            <Radio value="mastercard">
                              <img src={MasterCard} alt="Hinh" />
                            </Radio>
                            <Radio value="zalopay">
                              <img src={Zalopay} alt="Hinh" />
                            </Radio>
                            <Radio value="momo">
                              <img src={Momo} alt="Hinh" />
                            </Radio>
                          </Radio.Group>
                        </Form.Item>

                        <div className="input-money mt-2">
                          <Form.Item
                            name="money"
                            label="Add money"
                            rules={[
                              {
                                required: true,
                                message: "Please input your money",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </div>

                        <Form.Item {...tailFormItemLayout}>
                          <Button htmlType="submit">Submit</Button>
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane tab={<span>Withdraw</span>} key="2">
                <div className="payment-method">
                  <div className="method-items">
                    <div className="items-left">
                      <h2>Withdraw</h2>
                      <div className="balance">
                        <img src={Withdraw} alt="Money" />
                        <div className="balance-content">
                          <div className="title">Current Money</div>
                          <Space size={4}>
                            <div className="icon">
                              <Avatar src={IconMoney} size={20} />
                            </div>
                            <div className="money">
                              <span>0.00</span>
                            </div>
                          </Space>
                        </div>
                      </div>
                    </div>

                    <div className="items-right">
                      <Form
                        {...formItemLayout}
                        form={form}
                        onFinish={handleSubmit}
                      >
                        <Form.Item
                          name="method"
                          rules={[
                            {
                              required: true,
                              message: "Please select an option!",
                            },
                          ]}
                        >
                          <Radio.Group>
                            <Radio value="mastercard">
                              <img src={MasterCard} alt="Hinh" />
                            </Radio>
                            <Radio value="zalopay">
                              <img src={Zalopay} alt="Hinh" />
                            </Radio>
                            <Radio value="momo">
                              <img src={Momo} alt="Hinh" />
                            </Radio>
                          </Radio.Group>
                        </Form.Item>

                        <div className="input-money mt-2">
                          <Form.Item
                            name="money"
                            label="Withdraw"
                            rules={[
                              {
                                required: true,
                                message: "Please input money",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </div>

                        <Form.Item {...tailFormItemLayout}>
                          <Button htmlType="submit">Submit</Button>
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                </div>
              </TabPane>

              {/* History */}
              <TabPane tab={<span>History</span>} key="3">
                <TableWallet />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
      <div className="wallet__setting--price"></div>
    </div>
  );
}
