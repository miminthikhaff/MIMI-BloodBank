import { Button, Form, Input, Radio, message } from "antd";
import React, { useEffect } from "react"; // Import useEffect from 'react'
import { Link, useNavigate } from "react-router-dom";
import OrgHospitalForm from "./OrgHospitalForm";
import { RegisterUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loaderSlice";
import { getAntdInputValidation } from "../../utils/helper";

function Register() {
  const [type, setType] = React.useState("donar");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(setLoading(true));
      const response = await RegisterUser({
        ...values,
        userType: type,
      });
      dispatch(setLoading(false));
      if (response.success) {
        message.success(response.message);
        navigate("/login");
      } else {
        throw new Error(response.message);
      }
      dispatch(setLoading(false));
    } catch (error) {
      message.error(error.message);
      console.log("error:",error)
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-primary">
      <Form
        layout="vertical"
        className="grid w-1/2 grid-cols-2 gap-5 p-5 bg-white rounded shadow"
        onFinish={onFinish}
      >
        <h1 className="col-span-2 text-2xl uppercase">
          <span className="text-primary">
            {type.toUpperCase()} - REGISTRATION
          </span>
          <hr />
        </h1>

        <Radio.Group
          onChange={(e) => setType(e.target.value)}
          value={type}
          className="col-span-2"
        >
          <Radio value="donar">Donar</Radio>
          <Radio value="hospital">Hospital</Radio>
          <Radio value="organization">Organization</Radio>
        </Radio.Group>

        {type === "donar" && (
          <>
            {" "}
            <Form.Item
              label="Name"
              name="name"
              rules={getAntdInputValidation()}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={getAntdInputValidation()}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="phone"
              name="phone"
              rules={getAntdInputValidation()}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="password"
              name="password"
              rules={getAntdInputValidation()}
            >
              <Input type="password" />
            </Form.Item>
          </>
        )}

        {type !== "donar" && <OrgHospitalForm type={type} />}

        <Button type="primary" htmlType="submit" block className="col-span-2">
          Register
        </Button>

        <Link
          to="/Login"
          className="col-span-2 text-center text-gray-700 underline"
        >
          Already have an account? Login
        </Link>
      </Form>
    </div>
  );
}

export default Register;
