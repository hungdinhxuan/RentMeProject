import { Avatar } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./ProfileSetting.scss";
import ImgCrop from "antd-img-crop";
import { Upload } from "antd";
import {Form} from 'react-bootstrap';

function ProfileSetting() {
  const { user } = useSelector((state) => state.auth);
  const [fileList, setFileList] = useState([]);

  const handleChangeImg = ({ fileList: newFileList }) => {
    console.log(newFileList);
    setFileList(newFileList);
  };
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  return (
    <div className="profile__setting">
      <div className="row">
        <div className="col-lg-6 col-md-12 col-12">
          <h3>Your Profile</h3>
          <div className="title">Avatar</div>
          <div className="d-flex profile__setting--avatar">
            <Avatar size={96} src={user.avatar} />
            <div className="right-avatar">
              {/* Grid là cho không cho phép xoay ảnh != rotate */}
              <ImgCrop grid>
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleChangeImg}
                  onPreview={onPreview}
                >
                  + Upload File
                </Upload>
              </ImgCrop>
            </div>
          </div>
          <div className="line"></div>
          <div className="title">Information</div>
          <div className="profile__setting--form">
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              
              
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetting;
