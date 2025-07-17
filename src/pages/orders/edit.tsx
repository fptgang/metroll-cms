import React, { useEffect } from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Card, Tag, Button, Space, Spin } from "antd";
import {
  OrderDto,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  OrderUpdateRequest,
} from "../../data/interfaces";
import { useOrder, useUpdateOrder } from "../../hooks";
import { useParams, useNavigate } from "react-router";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";

export const OrderEdit: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { data: order, isLoading } = useOrder(orderNumber!);
  const updateMutation = useUpdateOrder();

  useEffect(() => {
    if (order) {
      form.setFieldsValue({
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.status,
        paymentReference: order.transactionReference,
      });
    }
  }, [order, form]);

  const onFinish = async (values: OrderUpdateRequest) => {
    if (!orderNumber) return;

    try {
      await updateMutation.mutateAsync({ orderNumber, update: values });
      navigate("/orders");
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <div>Order not found</div>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/orders")}
          style={{ marginTop: "16px" }}
        >
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px" }}>
      <Card
        title="Edit Order"
        extra={
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/orders")}
          >
            Back to Orders
          </Button>
        }
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Order Number" name="orderNumber">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Order Status"
            name="status"
            rules={[{ required: true, message: "Please select order status" }]}
          >
            <Select placeholder="Select order status">
              {Object.values(OrderStatus).map((status) => (
                <Select.Option key={status} value={status}>
                  <Tag color={getStatusColor(status)}>{status}</Tag>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Payment Method" name="paymentMethod">
            <Select placeholder="Select payment method">
              {Object.values(PaymentMethod).map((method) => (
                <Select.Option key={method} value={method}>
                  {method.replace("_", " ")}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Payment Status" name="paymentStatus">
            <Select placeholder="Select payment status">
              {Object.values(PaymentStatus).map((status) => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Payment Reference" name="paymentReference">
            <Input placeholder="Enter payment reference" />
          </Form.Item>

          <Form.Item label="Admin Notes" name="notes">
            <Input.TextArea rows={3} placeholder="Enter admin notes..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={updateMutation.isPending}
              >
                Update Order
              </Button>
              <Button onClick={() => navigate("/orders")}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

// Helper function to get status color
const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.PENDING:
      return "orange";
    // case OrderStatus.PAID:
    //   return "blue";
    // case OrderStatus.PROCESSING:
    //   return "purple";
    case OrderStatus.COMPLETED:
      return "green";
    // case OrderStatus.CANCELLED:
    //   return "red";
    // case OrderStatus.REFUNDED:
    //   return "cyan";
    case OrderStatus.FAILED:
      return "red";
    default:
      return "default";
  }
};
