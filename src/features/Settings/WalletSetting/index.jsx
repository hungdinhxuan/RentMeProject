import { Avatar, Button, Form, Input, Radio, Space, Tabs } from "antd";
import IconMoney from "assets/IconMoney.png";
import MasterCard from "assets/MasterCard.svg";
import Momo from "assets/Momo.png";
import Money from "assets/Money.png";
import Withdraw from "assets/Withdraw.png";
import Zalopay from "assets/zalopay.png";
import { AsyncLoadUser } from "features/Auth/AuthSlice";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { AsyncTransactHistory, AsyncTransactWallet } from "../SettingSlice";
import TableTransact from "./TableTransact";
import TableWallet from "./TableWallet";
import "./WalletSetting.scss";

const { TabPane } = Tabs;
export default function WalletSetting() {
  const { user } = useSelector((state) => state.auth);
  const { money } = useSelector((state) => state.setting);
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

  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    console.log(values);
    dispatch(
      AsyncTransactWallet({ ...values, id: user?._id, type: "deposit" })
    );
    form.resetFields();
  };

  const handleSubmitWithdraw = (values) => {
    console.log(values);
    dispatch(
      AsyncTransactWallet({ ...values, id: user?._id, type: "withdraw" })
    );
    form.resetFields();
  };

  useEffect(() => {
    dispatch(AsyncLoadUser());
    dispatch(AsyncTransactHistory({ id: user?._id }));
  }, [money, dispatch, user?._id]);
  

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
                              <span>{(user?.balance).toFixed(2)}</span>
                            </div>
                          </Space>
                        </div>
                      </div>
                    </div>

                    <div className="items-right">
                      <Form {...formItemLayout} onFinish={handleSubmit}>
                        <Form.Item
                          name="paymentMethod"
                          rules={[
                            {
                              required: true,
                              message: "Please select an option!",
                            },
                          ]}
                        >
                          <Radio.Group>
                            <Radio value="visa">
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
                              <span>{user?.balance}</span>
                            </div>
                          </Space>
                        </div>
                      </div>
                    </div>

                    <div className="items-right">
                      <Form {...formItemLayout} onFinish={handleSubmitWithdraw}>
                        <Form.Item
                          name="paymentMethod"
                          rules={[
                            {
                              required: true,
                              message: "Please select an option!",
                            },
                          ]}
                        >
                          <Radio.Group>
                            <Radio value="visa">
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
              <TabPane tab={<span>History Wallet</span>} key="3">
                <TableWallet />
              </TabPane>
              {/* History transact */}
              <TabPane tab={<span>Transaction</span>} key="4">
                <TableTransact />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
