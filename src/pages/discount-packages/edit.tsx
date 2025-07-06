import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Card, Form, Input, InputNumber, Button, Space, Spin } from "antd";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { DiscountPackageUpdateRequest } from "../../data/interfaces";
import { useDiscountPackage, useUpdateDiscountPackage } from "../../hooks";

export const DiscountPackageEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const { data: discountPackage, isLoading } = useDiscountPackage(id!);
  const updateMutation = useUpdateDiscountPackage();

  useEffect(() => {
    if (discountPackage) {
      form.setFieldsValue(discountPackage);
    }
  }, [discountPackage, form]);

  const onFinish = async (values: DiscountPackageUpdateRequest) => {
    if (!id) return;

    try {
      await updateMutation.mutateAsync({ id, data: values });
      navigate("/discount-packages");
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  if (isLoading) {
    return (
      <Card style={{ margin: "16px" }}>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!discountPackage) {
    return (
      <Card style={{ margin: "16px" }}>
        <div style={{ textAlign: "center", padding: "50px" }}>
          Discount package not found
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Edit Discount Package"
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
      <Form form={form} layout="vertical" onFinish={onFinish}>
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
              loading={updateMutation.isPending}
            >
              Update Package
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
