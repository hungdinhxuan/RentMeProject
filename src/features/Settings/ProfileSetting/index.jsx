import { Avatar } from "antd";
import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ProfileSetting.scss";
import ImgCrop from "antd-img-crop";
import { Upload } from "antd";
import { Form } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { Radio } from "antd";
import { AsyncLoadUser } from "features/Auth/AuthSlice";
import {
  AsyncUpdateAvatar,
  AsyncUpdateProfile,
} from "features/Settings/SettingSlice";
import { toast, ToastContainer } from "react-toastify";
import { toastSuccess } from "components/Toastify/toastHelper";
import Loading from "components/Loading";
import Cities from "constants/Cities";
import { socketContext } from "socket";

function ProfileSetting() {
  const { user } = useSelector((state) => state.auth);


  const { fileAvatar, loading } = useSelector((state) => state.setting);
  const [valueForm, setValueForm] = useState({
    fullName: user?.fullName,
    nickname: user?.nickname,
    birthDate: new Date(user?.birthDate),
    province: user?.province,
    gender: user?.gender,
  });
  const [startDate, setStartDate] = useState(new Date(user?.birthDate));
  const [genderState, setGenderState] = useState(user.gender);
  const fileList = [];
  const dispatch = useDispatch();

  const handleChange = (e) => {
    if (e.target.name === "gender") {
      setGenderState(e.target.value);
    }
    setValueForm({ ...valueForm, [e.target.name]: e.target.value });

    // console.log({ ...valueForm, [e.target.name]: e.target.value });
  };
  const handleDateChange = (value) => {
    setStartDate(value);
    setValueForm({ ...valueForm, birthDate: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(AsyncUpdateProfile({ ...valueForm, id: user._id }));
  };

  const uploadAvatar = (options) => {
    const { file } = options;
    dispatch(AsyncUpdateAvatar({ id: user._id, file: file }));
  };

  useEffect(() => {
    dispatch(AsyncLoadUser());
    
  }, [fileAvatar, dispatch]);
  

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
                  listType="picture-card"
                  customRequest={uploadAvatar}
                  fileList={fileList}
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
                  defaultValue={user?.fullName}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nick name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Please enter your nick name"
                  name="nickname"
                  defaultValue={user?.nickname}
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
                  defaultValue={user?.province}
                >
                  {Cities.map((item, index) => {
                    return (
                      <option value={`${item}`} key={index}>
                        {item}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <div>
                  <Radio.Group
                    name="gender"
                    onChange={handleChange}
                    value={genderState}
                  >
                    <Radio value="male">Male</Radio>
                    <Radio value="female">Female</Radio>
                  </Radio.Group>
                </div>
              </Form.Group>
              <div className="line"></div>
              <button className="submit-form" type="submit">
                Save
              </button>
            </Form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ProfileSetting;
