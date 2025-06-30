import React from "react";
import { Show, TextField, DateField } from "@refinedev/antd";
import {
  Card,
  Space,
  Button,
  Tag,
  Descriptions,
  Table,
  Row,
  Col,
  Statistic,
  Typography,
  Divider,
} from "antd";
import {
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import {
  OrderDto,
  OrderDetailDto,
  OrderStatus,
  PaymentMethod,
} from "../../data/interfaces";

const { Title, Text } = Typography;

// Status configuration
const statusConfig = {
  [OrderStatus.PENDING]: {
    color: "orange",
    icon: <ClockCircleOutlined />,
    text: "Pending",
  },
  [OrderStatus.PAID]: {
    color: "blue",
    icon: <DollarOutlined />,
    text: "Paid",
  },
  [OrderStatus.PROCESSING]: {
    color: "purple",
    icon: <ReloadOutlined spin />,
    text: "Processing",
  },
  [OrderStatus.COMPLETED]: {
    color: "green",
    icon: <CheckCircleOutlined />,
    text: "Completed",
  },
  [OrderStatus.CANCELLED]: {
    color: "red",
    icon: <CloseCircleOutlined />,
    text: "Cancelled",
  },
  [OrderStatus.REFUNDED]: {
    color: "cyan",
    icon: <UndoOutlined />,
    text: "Refunded",
  },
  [OrderStatus.FAILED]: {
    color: "red",
    icon: <CloseCircleOutlined />,
    text: "Failed",
  },
};

export const OrderShow: React.FC = () => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Mock data for demonstration - in real app this would come from useShow hook
  const record: OrderDto = {
    id: "1",
    orderNumber: "ORD-2024-001",
    customerId: "cust1",
    customerInfo: {
      customerId: "cust1",
      fullName: "John Doe",
      email: "john@example.com",
      phoneNumber: "+1234567890",
    },
    orderType: "BULK_TICKETS" as any,
    status: OrderStatus.COMPLETED,
    subtotal: 100000,
    discountAmount: 10000,
    taxAmount: 5000,
    totalAmount: 95000,
    currency: "VND",
    paymentMethod: PaymentMethod.CREDIT_CARD,
    paymentStatus: "CAPTURED" as any,
    orderDetails: [],
    appliedVouchers: [],
    orderDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const status = statusConfig[record.status];

  return (
    <Show>
      <div>
        {record ? (
          <div className="space-y-6">
            {/* Order Summary */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Order Total"
                    value={record.totalAmount}
                    formatter={(value) => formatCurrency(Number(value))}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Status"
                    value={status.text}
                    prefix={status.icon}
                    valueStyle={{
                      color: status.color === "green" ? "#52c41a" : "#fa8c16",
                    }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Items Count"
                    value={record.orderDetails.length}
                    prefix={<ShoppingCartOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Discount"
                    value={record.discountAmount}
                    formatter={(value) => formatCurrency(Number(value))}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              {/* Order Details */}
              <Col xs={24} lg={16}>
                <Card title="Order Information">
                  <Descriptions column={2} bordered>
                    <Descriptions.Item label="Order Number">
                      {record.orderNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="Order Type">
                      <Tag color="blue">{record.orderType}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Order Date">
                      <DateField
                        value={record.orderDate}
                        format="MMM DD, YYYY HH:mm"
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label="Payment Date">
                      {record.paymentDate ? (
                        <DateField
                          value={record.paymentDate}
                          format="MMM DD, YYYY HH:mm"
                        />
                      ) : (
                        <Text type="secondary">Not paid yet</Text>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Payment Method">
                      {record.paymentMethod ? (
                        <Tag color="blue">{record.paymentMethod}</Tag>
                      ) : (
                        <Text type="secondary">Not selected</Text>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Payment Status">
                      <Tag
                        color={
                          record.paymentStatus === "CAPTURED"
                            ? "green"
                            : "orange"
                        }
                      >
                        {record.paymentStatus}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                {/* Order Items */}
                <Card title="Order Items" className="mt-4">
                  <Table
                    dataSource={record.orderDetails}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  >
                    <Table.Column
                      dataIndex="productName"
                      title="Product"
                      render={(value: string, orderDetail: OrderDetailDto) => (
                        <div>
                          <Text strong>{value}</Text>
                          {orderDetail.productDescription && (
                            <div>
                              <Text
                                type="secondary"
                                style={{ fontSize: "12px" }}
                              >
                                {orderDetail.productDescription}
                              </Text>
                            </div>
                          )}
                        </div>
                      )}
                    />
                    <Table.Column
                      dataIndex="quantity"
                      title="Quantity"
                      width={80}
                      align="center"
                    />
                    <Table.Column
                      dataIndex="unitPrice"
                      title="Unit Price"
                      width={120}
                      align="right"
                      render={(value: number) => formatCurrency(value)}
                    />
                    <Table.Column
                      dataIndex="totalPrice"
                      title="Total"
                      width={120}
                      align="right"
                      render={(value: number) => (
                        <Text strong>{formatCurrency(value)}</Text>
                      )}
                    />
                  </Table>

                  <Divider />

                  {/* Order Financial Summary */}
                  <div className="text-right space-y-2">
                    <div className="flex justify-end">
                      <Text>Subtotal: {formatCurrency(record.subtotal)}</Text>
                    </div>
                    {record.discountAmount > 0 && (
                      <div className="flex justify-end">
                        <Text style={{ color: "#52c41a" }}>
                          Discount: -{formatCurrency(record.discountAmount)}
                        </Text>
                      </div>
                    )}
                    {record.taxAmount > 0 && (
                      <div className="flex justify-end">
                        <Text>Tax: {formatCurrency(record.taxAmount)}</Text>
                      </div>
                    )}
                    <Divider style={{ margin: "8px 0" }} />
                    <div className="flex justify-end">
                      <Text strong style={{ fontSize: "16px" }}>
                        Total: {formatCurrency(record.totalAmount)}
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>

              {/* Customer Information */}
              <Col xs={24} lg={8}>
                <Card title="Customer Information">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                      <UserOutlined
                        style={{ fontSize: "24px", color: "#1890ff" }}
                      />
                    </div>
                    <Title level={4} className="mb-0">
                      {record.customerInfo.fullName}
                    </Title>
                    <Text type="secondary">
                      Customer ID: {record.customerInfo.customerId}
                    </Text>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Text type="secondary">Email:</Text>
                      <div>{record.customerInfo.email}</div>
                    </div>
                    {record.customerInfo.phoneNumber && (
                      <div>
                        <Text type="secondary">Phone:</Text>
                        <div>{record.customerInfo.phoneNumber}</div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Applied Vouchers */}
                {record.appliedVouchers.length > 0 && (
                  <Card title="Applied Vouchers" className="mt-4">
                    {record.appliedVouchers.map((voucher) => (
                      <div
                        key={voucher.voucherId}
                        className="border-b pb-2 mb-2 last:border-b-0"
                      >
                        <div className="flex justify-between items-center">
                          <Text strong>{voucher.voucherCode}</Text>
                          <Text style={{ color: "#52c41a" }}>
                            -{formatCurrency(voucher.discountAmount)}
                          </Text>
                        </div>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Applied on{" "}
                          {new Date(voucher.appliedAt).toLocaleDateString()}
                        </Text>
                      </div>
                    ))}
                  </Card>
                )}
              </Col>
            </Row>
          </div>
        ) : (
          <div>Order not found</div>
        )}
      </div>
    </Show>
  );
};
