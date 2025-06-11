import React from "react";
import { Create } from "@refinedev/antd";
import { Form, Input, Select, Card, Button } from "antd";
import { AccountCreateRequest, AccountRole } from "../../data";
import { useCreateAccount } from "../../hooks";
import { useNavigate } from "react-router";

export const AccountCreate: React.FC = () => {
  const [form] = Form.useForm();
  const createMutation = useCreateAccount();
  const navigate = useNavigate();

  const onFinish = async (values: AccountCreateRequest) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        navigate("/accounts");
      },
    });
  };

  return (
    <Create
      saveButtonProps={{
        loading: createMutation.isPending,
        onClick: () => form.submit(),
      }}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Card title="Create New Account">
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Please enter the full name",
              },
            ]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter the email",
              },
              {
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please enter the phone number",
              },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter the password",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters",
              },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[
              {
                required: true,
                message: "Please select a role",
              },
            ]}
          >
            <Select placeholder="Select role">
              <Select.Option value={AccountRole.ADMIN}>Admin</Select.Option>
              <Select.Option value={AccountRole.STAFF}>Staff</Select.Option>
              <Select.Option value={AccountRole.CUSTOMER}>
                Customer
              </Select.Option>
            </Select>
          </Form.Item>
        </Card>
      </Form>
    </Create>
  );
};
