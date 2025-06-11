import React, { useEffect } from "react";
import { Edit } from "@refinedev/antd";
import { Form, Input, Select, Switch, Card } from "antd";
import { AccountUpdateRequest, AccountRole } from "../../data";
import { useAccount, useUpdateAccount } from "../../hooks";
import { useParams, useNavigate } from "react-router";

export const AccountEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const { data: account, isLoading } = useAccount(id!);
  const updateMutation = useUpdateAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (account) {
      form.setFieldsValue(account);
    }
  }, [account, form]);

  const onFinish = async (values: AccountUpdateRequest) => {
    updateMutation.mutate(
      { id: id!, data: values },
      {
        onSuccess: () => {
          navigate("/accounts");
        },
      }
    );
  };

  return (
    <Edit
      isLoading={isLoading}
      saveButtonProps={{
        loading: updateMutation.isPending,
        onClick: () => form.submit(),
      }}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Card title="Account Information">
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

          <Form.Item label="Active" name="active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Card>
      </Form>
    </Edit>
  );
};
