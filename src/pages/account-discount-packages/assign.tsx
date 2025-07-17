import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Card, Form, Input, Button, Space, Select, Spin } from "antd";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import {
  AccountDiscountAssignRequest,
  AccountRole, SortDirection,
} from "../../data/interfaces";
import {
  useAssignDiscountPackage,
  useDiscountPackages,
  useAccounts,
} from "../../hooks";

const { Option } = Select;

export const AccountDiscountPackageAssign: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const assignMutation = useAssignDiscountPackage();
  const location = useLocation();
  let account = location.state;
  // Get active discount packages for selection
  const { data: discountPackagesData, isLoading: loadingPackages } =
    useDiscountPackages(0, 100, {}, { status: "ACTIVE" });
  const { data: accountsData, isLoading: loadingAccounts } = useAccounts(
    0,
    100,
    {},
    { role: AccountRole.CUSTOMER, active: true }
  );

  const onFinish = async (values: AccountDiscountAssignRequest) => {
    try {
      await assignMutation.mutateAsync(values);
      navigate("/account-discount-packages");
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const discountPackages = discountPackagesData?.content || [];
  const accounts = accountsData?.content || [];

  if (loadingPackages || loadingAccounts) {
    return (
      <Card style={{ margin: "16px" }}>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Assign Discount Package to Account"
      extra={
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/account-discount-packages")}
        >
          Back to List
        </Button>
      }
      style={{ margin: "16px" }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="accountId"
          label="Customer Account"
          rules={[
            { required: true, message: "Please select a customer account" },
          ]}
          initialValue={account?.accountId} // Use accountId from state or empty string
        >
          <Select
            placeholder="Select customer account"
            showSearch
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                ?.toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {accounts.map((account) => (
              <Option key={account.id} value={account.id}>
                {account.fullName} ({account.email})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="discountPackageId"
          label="Discount Package"
          rules={[
            { required: true, message: "Please select a discount package" },
          ]}
        >
          <Select
            placeholder="Select discount package"
            showSearch
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                ?.toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {discountPackages.filter((pkg) => pkg.status === "ACTIVE").map((pkg) => (
              <Option key={pkg.id} value={pkg.id}>
                {pkg.name} ({(pkg.discountPercentage * 100).toFixed(0)}% off,{" "}
                {pkg.duration} days)
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={assignMutation.isPending}
            >
              Assign Package
            </Button>
            <Button onClick={() => navigate("/account-discount-packages")}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};
