import React, { useEffect } from "react";
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
  Spin,
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
  ArrowLeftOutlined,
} from "@ant-design/icons";
import {
  OrderDto,
  OrderDetailDto,
  OrderStatus,
  PaymentMethod,
  VoucherDto,
  AccountDto,
  P2PJourneyDto,
  TimedTicketPlanDto,
} from "../../data/interfaces";
import { useOrder } from "../../hooks";
import { useParams, useNavigate } from "react-router";
import { accountService, ticketService, voucherService } from "../../data";
import { formatDate } from "../../utils/formatDate";

const { Title, Text } = Typography;

// Status configuration
const statusConfig = {
  [OrderStatus.PENDING]: {
    color: "orange",
    icon: <ClockCircleOutlined />,
    text: "Pending",
  },
  // [OrderStatus.PAID]: {
  //   color: "blue",
  //   icon: <DollarOutlined />,
  //   text: "Paid",
  // },
  // [OrderStatus.PROCESSING]: {
  //   color: "purple",
  //   icon: <ReloadOutlined spin />,
  //   text: "Processing",
  // },
  [OrderStatus.COMPLETED]: {
    color: "green",
    icon: <CheckCircleOutlined />,
    text: "Completed",
  },
  // [OrderStatus.CANCELLED]: {
  //   color: "red",
  //   icon: <CloseCircleOutlined />,
  //   text: "Cancelled",
  // },
  // [OrderStatus.REFUNDED]: {
  //   color: "cyan",
  //   icon: <UndoOutlined />,
  //   text: "Refunded",
  // },
  [OrderStatus.FAILED]: {
    color: "red",
    icon: <CloseCircleOutlined />,
    text: "Failed",
  },
};

export const OrderShow: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const { data: record, isLoading, error } = useOrder(orderNumber!);
  const [voucher, setVoucher] = React.useState<VoucherDto>();
  const [account, setAccount] = React.useState<AccountDto | null>(null);
  const [p2pTickets, setP2pTickets] = React.useState<P2PJourneyDto[]>([]);
  const [timedTickets, setTimedTickets] = React.useState<TimedTicketPlanDto[]>(
    []
  );

  useEffect(() => {
    if (record && record.voucher) {
      voucherService
        .getVoucherById(record.voucher)
        .then((data) => {
          setVoucher(data);
        })
        .catch((err) => {
          console.error("Error fetching voucher:", err);
        });
    }
    if (record && record.customerId) {
      accountService
        .getAccountById(record.customerId)
        .then((data) => {
          setAccount(data);
        })
        .catch((err) => {
          console.error("Error fetching account:", err);
        });
    }
    if (record && record.orderDetails.length > 0) {
      record.orderDetails.forEach((detail) => {
        if (detail.ticketType === "P2P") {
          ticketService
            .getP2PJourneyById(detail.p2pJourney)
            .then((data) => {
              setP2pTickets((prev) => [...prev, data]);
            })
            .catch((err) => {
              console.error("Error fetching P2P ticket:", err);
            });
        } else if (detail.ticketType === "TIMED") {
          ticketService
            .getTimedTicketPlanById(detail.timedTicketPlan)
            .then((data) => {
              setTimedTickets((prev) => [...prev, data]);
            })
            .catch((err) => {
              console.error("Error fetching timed ticket plan:", err);
            });
        }
      });
    }
  }, [record]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !record) {
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

  const status = statusConfig[record.status];

  return (
    <Show
      headerButtons={({ defaultButtons }) => (
        <>
          {/* <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/orders")}
          >
            Back to Orders
          </Button>
          {defaultButtons} */}
        </>
      )}
    >
      <div className="space-y-6">
        {/* Order Summary */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Order Total"
                value={record.finalTotal}
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
                value={record.discountTotal}
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
                  {record.id}
                </Descriptions.Item>
                {/* <Descriptions.Item label="Order Type">
                  <Tag color="blue">{record.}</Tag>
                </Descriptions.Item> */}
                <Descriptions.Item label="Order Date">
                  <DateField
                    value={formatDate(record.createdAt)}
                    format="MMM DD, YYYY HH:mm"
                  />
                </Descriptions.Item>
                {/* <Descriptions.Item label="Payment Date">
                  {record.paymentDate ? (
                    <DateField
                      value={record.paymentDate}
                      format="MMM DD, YYYY HH:mm"
                    />
                  ) : (
                    <Text type="secondary">Not paid yet</Text>
                  )}
                </Descriptions.Item> */}
                <Descriptions.Item label="Payment Method">
                  {record.paymentMethod ? (
                    <Tag color="blue">{record.paymentMethod}</Tag>
                  ) : (
                    <Text type="secondary">Not selected</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Order Status">
                  <Tag
                    color={record.status === "COMPLETED" ? "green" : "orange"}
                  >
                    {record.status}
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
                  dataIndex="ticketId"
                  title="Product"
                  render={(value: string, orderDetail: OrderDetailDto) => (
                    <div>
                      {/* <Text strong>{value}</Text> */}
                      {orderDetail.ticketId && (
                        <div>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {orderDetail.ticketType === "P2P"
                              ? p2pTickets.find(
                                  (ticket) =>
                                    ticket.id === orderDetail.p2pJourney
                                )?.startStationId +
                                  " → " +
                                  p2pTickets.find(
                                    (ticket) =>
                                      ticket.id === orderDetail.p2pJourney
                                  )?.endStationId || "Unknown P2P Ticket"
                              : orderDetail.ticketType === "TIMED"
                              ? timedTickets.find(
                                  (ticket) =>
                                    ticket.id === orderDetail.timedTicketPlan
                                )?.name || "Unknown Timed Ticket"
                              : "Unknown Ticket Type"}
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
                  dataIndex="finalTotal"
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
                  <Text>Subtotal: {formatCurrency(record.baseTotal)}</Text>
                </div>
                {record.discountTotal > 0 && (
                  <div className="flex justify-end">
                    <Text style={{ color: "#52c41a" }}>
                      Discount: -{formatCurrency(record.discountTotal)}
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
                    Total: {formatCurrency(record.finalTotal)}
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
                  {account?.fullName}
                </Title>
                <Text type="secondary">Customer ID: {record.customerId}</Text>
              </div>

              {/* <div className="space-y-3">
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
              </div> */}
            </Card>

            {/* Applied Vouchers */}
            {record.voucher && (
              <Card title="Applied Vouchers" className="mt-4">
                {
                  <div
                    key={record.voucher}
                    className="border-b pb-2 mb-2 last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <Text strong>{record.voucher}</Text>
                      <Text style={{ color: "#52c41a" }}>
                        -{formatCurrency(voucher?.discountAmount || 0)}
                      </Text>
                    </div>
                  </div>
                }
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </Show>
  );
};
