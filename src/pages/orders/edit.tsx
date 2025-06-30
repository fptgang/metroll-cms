import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Card, Tag } from "antd";
import {
  OrderDto,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "../../data/interfaces";

export const OrderEdit: React.FC = () => {
  const { formProps, saveButtonProps } = useForm<OrderDto>();

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Card title="Order Information">
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
        </Card>
      </Form>
    </Edit>
  );
};

// Helper function to get status color
const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.PENDING:
      return "orange";
    case OrderStatus.PAID:
      return "blue";
    case OrderStatus.PROCESSING:
      return "purple";
    case OrderStatus.COMPLETED:
      return "green";
    case OrderStatus.CANCELLED:
      return "red";
    case OrderStatus.REFUNDED:
      return "cyan";
    case OrderStatus.FAILED:
      return "red";
    default:
      return "default";
  }
};
