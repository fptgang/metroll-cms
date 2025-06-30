import React from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, InputNumber, Card, Space, Button } from "antd";
import {
  OrderCreateRequest,
  OrderType,
  PaymentMethod,
} from "../../data/interfaces";

export const OrderCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm<OrderCreateRequest>();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Card title="Order Information">
          <Form.Item
            label="Order Type"
            name="orderType"
            rules={[{ required: true, message: "Please select order type" }]}
          >
            <Select placeholder="Select order type">
              {Object.values(OrderType).map((type) => (
                <Select.Option key={type} value={type}>
                  {type.replace("_", " ")}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Payment Method"
            name="paymentMethod"
            rules={[
              { required: true, message: "Please select payment method" },
            ]}
          >
            <Select placeholder="Select payment method">
              {Object.values(PaymentMethod).map((method) => (
                <Select.Option key={method} value={method}>
                  {method.replace("_", " ")}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Customer Notes" name="customerNotes">
            <Input.TextArea rows={3} placeholder="Enter customer notes..." />
          </Form.Item>
        </Card>

        <Card title="Order Items" className="mt-4">
          <Form.List name="orderDetails">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "productType"]}
                      rules={[
                        { required: true, message: "Missing product type" },
                      ]}
                    >
                      <Input placeholder="Product Type" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "productId"]}
                      rules={[
                        { required: true, message: "Missing product ID" },
                      ]}
                    >
                      <Input placeholder="Product ID" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      rules={[{ required: true, message: "Missing quantity" }]}
                    >
                      <InputNumber placeholder="Quantity" min={1} />
                    </Form.Item>
                    <Button onClick={() => remove(name)}>Remove</Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Add Order Item
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>
      </Form>
    </Create>
  );
};
