import { Avatar } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./ProfileSetting.scss";
import ImgCrop from "antd-img-crop";
import { Upload } from "antd";
import { Form } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { Radio } from "antd";

function ProfileSetting() {
  const { user } = useSelector((state) => state.auth);
  const [fileList, setFileList] = useState([]);
  const [valueForm, setValueForm] = useState({});
  const [startDate, setStartDate] = useState(new Date());

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

  const handleChange = (e) => {
    setValueForm({ ...valueForm, [e.target.name]: e.target.value });

    // console.log({ ...valueForm, [e.target.name]: e.target.value });
  };
  const handleDateChange = (value) => {
    setStartDate(value);
    setValueForm({birthdate: startDate})
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(valueForm);
  }

  return (
    <div className="profile__setting">
      <div className="row">
        <div className="col-lg-6 col-md-12 col-12">
          <h3>Your Profile</h3>
          <div className="title">Avatar</div>
          <div className="d-flex profile__setting--avatar">
            <Avatar size={96} src={user?.avatar} />
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
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Please enter your Name"
                  name="fullName"
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nick name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Please enter your nick name"
                  name="nickname"
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date of birth</Form.Label>
                <DatePicker
                  onChange={handleDateChange}
                  className="form-control"
                  selected={startDate}
                  customInput={
                    <input
                      type="text"
                      id="validationCustomDate"
                      placeholder="Date of birth"
                    />
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  as="select"
                  onChange={handleChange}
                  name="province"
                >
                  <option>Open this select city</option>
                  <option value="TPHCM">TPHCM</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <div>
                  <Radio.Group name="gender" onChange={handleChange}>
                    <Radio value="Male">Male</Radio>
                    <Radio value="Female">Female</Radio>
                  </Radio.Group>
                </div>
              </Form.Group>
              <div className="line"></div>
              <button className="submit-form" type="submit">Save</button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetting;
