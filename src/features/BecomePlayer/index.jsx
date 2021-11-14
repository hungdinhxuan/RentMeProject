import { Avatar, Form, Input, InputNumber,  Select } from "antd";
import { Button } from "antd/lib/radio";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import "./BecomePlayer.scss";
import { getAllServicesAsync, registerToBecomePlayerAsync } from "./BecomePlayerSlice";


export default function BecomePlayer() {
  const { serviceGames } = useSelector((state) => state.services);
  const {user} = useSelector((state) => state.auth);
  const { Option } = Select;
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [avatar, setAvatar] = useState();
  const [listAvatar, setListAvatar] = useState([]);
  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    console.log(values);
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };

  function onChange(value) {
    console.log(value);
  }
  const handlePreviewAvatar = (e) => {
    const file = e.target.files[0];
    file.preview = URL.createObjectURL(file);
    setAvatar(file);
    
  };

  const handlePreviewListAvatar = (e) => {
    const files = e.target.files;
    let temp = [];
    for (const [key, value] of Object.entries(files)) {
      value.preview = URL.createObjectURL(value);
      temp.push(value);
    }
    setListAvatar(temp);   
  };

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  useEffect(() => {
    dispatch(getAllServicesAsync());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      avatar && URL.revokeObjectURL(avatar.preview);
    };
  }, [avatar]);
  useEffect(() => {
    return () => {
      listAvatar &&
        listAvatar.map((item) => {
          URL.revokeObjectURL(item.preview);
        });
    };
  }, [listAvatar]);

  const handleSubmitForm = () => {
    
    const formData = new FormData();
    formData.append('userId', user._id);
    
    for(const [key, val] of Object.entries(form.getFieldsValue())) {
      formData.append(key, JSON.stringify(val));
    }
    
    formData.append('albums', avatar);
    listAvatar.forEach((item) => {
      formData.append('albums', item);
    })
    console.log(formData.getAll('albums'));
    dispatch(registerToBecomePlayerAsync(formData));
    form.resetFields();
    setAvatar(null);
    setListAvatar([]);
  }
  return (
    <div className="become-player">
      <div className="player-container">
        <div className="player__header">
          Become to professional player
          <div className="player__header--desc">
            The information you submit will not be disclosed to third parties,
            and we promise to keep your information absolutely confidential
          </div>
        </div>

        <div className="form-register mt-3">
          <Form
            form={form}
            {...formItemLayout}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="nickname"
              label="Nick name"
              rules={[
                {
                  required: true,
                  message: "Please input your nickname",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="shortDesc"
              label="Short Describe"
              rules={[
                {
                  required: true,
                  message: "Please input short describe",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="longDesc"
              label="Detailed Describe"
              rules={[
                {
                  required: true,
                  message: "Please input detailed describe",
                },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="pricePerHour"
              label="Price"
              rules={[
                {
                  required: true,
                  message: "Please input request price",
                },
              ]}
            >
              <InputNumber
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                onChange={onChange}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name="services"
              label="Choose Services"
              rules={[
                {
                  required: true,
                  message: "Please choose service games",
                },
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                onChange={handleChange}
              >
                {serviceGames &&
                  serviceGames.map((item) => {
                    return <Option key={item._id}>{item.name}</Option>;
                  })}
              </Select>
            </Form.Item>

            <Form.Item
              name="albums"
              label="Image"
              rules={[
                {
                  required: true,
                  message: "Please choose your image",
                },
              ]}
            >
              <input
                type="file"
                onChange={handlePreviewAvatar}
                accept="image/png, image/jpeg"
              />
              {avatar && (
                <Avatar src={avatar.preview} alt="" size={180} shape="square" />
              )}
            </Form.Item>
            <Form.Item
              name="albums"
              label="List albums"
              rules={[
                {
                  required: true,
                  message: "Please choose your image",
                },
              ]}
            >
              <input
                type="file"
                multiple
                onChange={handlePreviewListAvatar}
                accept="image/png, image/jpeg"
              />
              {listAvatar &&
                listAvatar.map((item, index) => {
                  return (
                    <Avatar
                      src={item.preview}
                      alt=""
                      size={180}
                      shape="square"
                      key={index}
                    />
                  );
                })}
            </Form.Item>
            <Button onClick={handleSubmitForm}>Submit</Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
