import { Modal, Radio, Form, Input, Select } from "antd"; // Import Select component
import React, { useState } from "react";
import { getAntdInputValidation } from "../../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/loaderSlice";
import { AddInventory } from "../../../apicalls/inventory";
import { message } from "antd";

const { Option } = Select; // Destructure Option from Select

function InventoryForm({ open, setOpen, reloadData }) {
  const {currentUser} = useSelector(state => state.users);
  const [form] = Form.useForm();
  const [inventoryType, setInventoryType] = useState("in");
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(setLoading(true));
      const response = await AddInventory({
        ...values,
        inventoryType,
        organization: currentUser._id,
      });
      dispatch(setLoading(false));
      if (response.success) {
        reloadData();
        message.success("Inventory Added Successfully");
        setOpen(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(setLoading(false));
    }
  };

  return (
    <Modal
      title="ADD INVENTORY"
      visible={open} // Use "visible" instead of "open"
      onCancel={() => setOpen(false)}
      centered
      onOk={() => {
        form.submit();
      }}
    >
      <Form
        layout="vertical"
        className="flex flex-col gap-3"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item label="Inventory Type" name="inventoryType">
          <Radio.Group
            value={inventoryType}
            onChange={(e) => setInventoryType(e.target.value)}
          >
            <Radio value="in">In</Radio>
            <Radio value="out">Out</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Blood Group"
          name="bloodGroup"
          rules={getAntdInputValidation()}
        >
          <Select placeholder="Select blood group">
            <Option value="A+">A+</Option>
            <Option value="A-">A-</Option>
            <Option value="B+">B+</Option>
            <Option value="B-">B-</Option>
            <Option value="AB+">AB+</Option>
            <Option value="AB-">AB-</Option>
            <Option value="O+">O+</Option>
            <Option value="O-">O-</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={inventoryType === "out" ? "Hospital Email" : "Donar Email"}
          name="email"
          rules={getAntdInputValidation()}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          label="Quantity (ML)"
          name="quantity"
          rules={getAntdInputValidation()}
        >
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default InventoryForm;
