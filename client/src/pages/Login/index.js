import { Button, Form, Input, Radio, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LoginUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loaderSlice";
import { getAntdInputValidation } from "../../utils/helper";

function Login() {
  const [type, setType] = useState("donar");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(setLoading(true));
      const response = await LoginUser({
        ...values,
        userType: type,
      });
      dispatch(setLoading(false));

      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        navigate("/");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    console.log("useEffect");
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []); // Empty dependency array

  return (
    <div className="flex items-center justify-center h-screen bg-primary">
      <Form
        layout="vertical"
        className="grid w-1/3 gap-5 p-5 bg-white rounded shadow"
        onFinish={onFinish}
      >
        <h1 className="text-2xl uppercase">
          <span className="text-primary">{type.toUpperCase()} - LOGIN</span>
          <hr />
        </h1>

        <Radio.Group
          onChange={(e) => setType(e.target.value)}
          value={type}
          className=""
        >
          <Radio value="donar">Donar</Radio>
          <Radio value="hospital">Hospital</Radio>
          <Radio value="organization">Organization</Radio>
        </Radio.Group>

        <Form.Item label="Email" name="email" rules={getAntdInputValidation()}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={getAntdInputValidation()}>
          <Input type="password" />
        </Form.Item>

        <Button type="primary" block className="" htmlType="submit">
          Login
        </Button>

        <Link to="/register" className="text-center text-gray-700 underline">
          Don't have an account? Register
        </Link>
      </Form>
    </div>
  );
}

export default Login;
