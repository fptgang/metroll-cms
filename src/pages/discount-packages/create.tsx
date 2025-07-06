import React from "react";
import { useNavigate } from "react-router";
import { Card, Form, Input, InputNumber, Button, Space } from "antd";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { DiscountPackageCreateRequest } from "../../data/interfaces";
import { useCreateDiscountPackage } from "../../hooks";

export const DiscountPackageCreate: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const createMutation = useCreateDiscountPackage();

  const onFinish = async (values: DiscountPackageCreateRequest) => {
    try {
      await createMutation.mutateAsync(values);
      navigate("/discount-packages");
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Card
      title="Create Discount Package"
      extra={
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/discount-packages")}
        >
          Back to List
        </Button>
      }
      style={{ margin: "16px" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          discountPercentage: 0.1,
          duration: 30,
        }}
      >
        <Form.Item
          name="name"
          label="Package Name"
          rules={[
            { required: true, message: "Please enter package name" },
            { min: 2, message: "Name must be at least 2 characters" },
          ]}
        >
          <Input placeholder="e.g., Student Discount" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "Please enter description" },
            { min: 10, message: "Description must be at least 10 characters" },
          ]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Describe the discount package and its eligibility criteria"
          />
        </Form.Item>

        <Form.Item
          name="discountPercentage"
          label="Discount Percentage"
          rules={[
            { required: true, message: "Please enter discount percentage" },
            {
              type: "number",
              min: 0.01,
              max: 1,
              message: "Discount must be between 1% and 100%",
            },
          ]}
          extra="Enter as decimal (e.g., 0.15 for 15% discount)"
        >
          <InputNumber
            min={0.01}
            max={1}
            step={0.01}
            style={{ width: "100%" }}
            placeholder="0.15"
          />
        </Form.Item>

        <Form.Item
          name="duration"
          label="Duration (Days)"
          rules={[
            { required: true, message: "Please enter duration" },
            {
              type: "number",
              min: 1,
              max: 365,
              message: "Duration must be between 1 and 365 days",
            },
          ]}
        >
          <InputNumber
            min={1}
            max={365}
            style={{ width: "100%" }}
            placeholder="30"
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={createMutation.isPending}
            >
              Create Package
            </Button>
            <Button onClick={() => navigate("/discount-packages")}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};
