import { Form, Input, Select } from "antd";
import React from "react";

const UserForm = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Mobile" name="mobile" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Email" name="email" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Admin" name="admin" rules={[{ required: true }]}>
        <Select
          options={[
            { label: "True", value: true },
            { label: "False", value: false },
          ]}
        />
      </Form.Item>
    </Form>
  );
};

export default UserForm;
