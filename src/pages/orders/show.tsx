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
  Avatar,
  QRCode,
  Tooltip,
  Badge,
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
  TeamOutlined,
  CreditCardOutlined,
  LinkOutlined,
  GiftOutlined,
  PercentageOutlined,
  BankOutlined,
  QrcodeOutlined,
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
  DiscountPackageDto,
} from "../../data/interfaces";
import { useOrder } from "../../hooks";
import { useParams, useNavigate } from "react-router";
import { accountService, ticketService, voucherService, discountService } from "../../data";
import { formatDate } from "../../utils/formatDate";

const { Title, Text, Paragraph } = Typography;

// Status configuration
const statusConfig = {
  [OrderStatus.PENDING]: {
    color: "orange",
    icon: <ClockCircleOutlined />,
    text: "Pending",
  },
  [OrderStatus.COMPLETED]: {
    color: "green",
    icon: <CheckCircleOutlined />,
    text: "Completed",
  },
  [OrderStatus.FAILED]: {
    color: "red",
    icon: <CloseCircleOutlined />,
    text: "Failed",
  },
};

// Payment method configuration
const paymentMethodConfig = {
  CASH: {
    color: "green",
    icon: <DollarOutlined />,
    text: "Cash",
  },
  VNPAY: {
    color: "blue",
    icon: <BankOutlined />,
    text: "VNPay",
  },
  PAYOS: {
    color: "purple",
    icon: <CreditCardOutlined />,
    text: "PayOS",
  },
};

export const OrderShow: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const { data: record, isLoading, error } = useOrder(orderNumber!);
  const [voucher, setVoucher] = React.useState<VoucherDto>();
  const [account, setAccount] = React.useState<AccountDto | null>(null);
  const [discountPackage, setDiscountPackage] = React.useState<DiscountPackageDto>();
  const [p2pTickets, setP2pTickets] = React.useState<P2PJourneyDto[]>([]);
  const [timedTickets, setTimedTickets] = React.useState<TimedTicketPlanDto[]>([]);

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
    if (record && record.discountPackage) {
      discountService
        .getDiscountPackageById(record.discountPackage)
        .then((data) => {
          setDiscountPackage(data);
        })
        .catch((err) => {
          console.error("Error fetching discount package:", err);
        });
    }
    if (record && record.orderDetails.length > 0) {
      record.orderDetails.forEach((detail) => {
        if (detail.ticketType === "P2P" && detail.p2pJourney) {
          ticketService
            .getP2PJourneyById(detail.p2pJourney)
            .then((data) => {
              setP2pTickets((prev) => [...prev, data]);
            })
            .catch((err) => {
              console.error("Error fetching P2P ticket:", err);
            });
        } else if (detail.ticketType === "TIMED" && detail.timedTicketPlan) {
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
  const paymentMethod = paymentMethodConfig[record.paymentMethod];

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
                  <Text code>{record.id}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Order Status">
                  <Badge 
                    status={record.status === "COMPLETED" ? "success" : record.status === "FAILED" ? "error" : "processing"} 
                    text={
                      <Tag color={status.color}>
                        {status.icon} {status.text}
                      </Tag>
                    }
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Created Date">
                  <DateField
                    value={formatDate(record.createdAt)}
                    format="MMM DD, YYYY HH:mm"
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Last Updated">
                  <DateField
                    value={formatDate(record.updatedAt)}
                    format="MMM DD, YYYY HH:mm"
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Payment Method">
                  <Tag color={paymentMethod.color}>
                    {paymentMethod.icon} {paymentMethod.text}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Transaction Reference">
                  {record.transactionReference ? (
                    <Text code>{record.transactionReference}</Text>
                  ) : (
                    <Text type="secondary">Not available</Text>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Staff Information */}
            {record.staff && (
              <Card title="Staff Information" className="mt-4">
                <div className="flex items-center space-x-4">
                  <Avatar size={64} icon={<TeamOutlined />} />
                  <div>
                    <Title level={4} className="mb-1">
                      {record.staff.fullName}
                    </Title>
                    <Text type="secondary">Staff ID: {record.staffId}</Text>
                    <br />
                    <Text type="secondary">
                      Email: {record.staff.email || "Not available"}
                    </Text>
                    <br />
                    <Tag color="blue">
                      Role: {record.staff.role || "STAFF"}
                    </Tag>
                  </div>
                </div>
              </Card>
            )}

            {/* Payment Information */}
            {(record.paymentUrl || record.qrCode) && (
              <Card title="Payment Information" className="mt-4">
                <Row gutter={[16, 16]}>
                  {record.paymentUrl && (
                    <Col xs={24} md={12}>
                      <div className="text-center">
                        <Title level={5}>Payment URL</Title>
                        <Button
                          type="primary"
                          icon={<LinkOutlined />}
                          href={record.paymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open Payment Page
                        </Button>
                      </div>
                    </Col>
                  )}
                  {record.qrCode && (
                    <Col xs={24} md={12}>
                      <div className="text-center">
                        <Title level={5}>QR Code</Title>
                        <QRCode value={record.qrCode} size={150} />
                      </div>
                    </Col>
                  )}
                </Row>
              </Card>
            )}

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
                      {
                        orderDetail.ticketType === "P2P" ? (
                          <div>
                            {p2pTickets.find(
                              (ticket) => ticket.id === orderDetail.p2pJourney
                            )?.startStationId}
                          </div>
                        ) : orderDetail.ticketType === "TIMED" ? (
                          <div>
                            {timedTickets.find(
                              (ticket) => ticket.id === orderDetail.timedTicketPlan
                            )?.name}
                          </div>
                        ) : null
                      }
                    </div>
                  )}
                />
                <Table.Column
                  dataIndex="unitPrice"
                  title="Unit Price"
                  width={120}
                  align="right"
                  render={(value: number) => formatCurrency(value)}
                />
                <Table.Column
                  dataIndex="discountTotal"
                  title="Discount"
                  width={120}
                  align="right"
                  render={(value: number) => (value ? '-' : '') + formatCurrency(value)}
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
                <Divider style={{ margin: "8px 0" }} />
                <div className="flex justify-end">
                  <Text strong style={{ fontSize: "16px" }}>
                    Total: {formatCurrency(record.finalTotal)}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>

          {/* Right Column */}
          <Col xs={24} lg={8}>
            {/* Customer Information */}
            {(record.customerId && (record.customer || account)) ? (
              <Card title="Customer Information">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                    <UserOutlined
                      style={{ fontSize: "24px", color: "#1890ff" }}
                    />
                  </div>
                  <Title level={4} className="mb-0">
                    {record.customer?.fullName || account?.fullName}
                  </Title>
                  <Text type="secondary">Customer ID: {record.customerId}</Text>
                </div>
                <div className="space-y-2">
                  <div>
                    <Text type="secondary">Email:</Text>
                    <div>{record.customer?.email || account?.email || "Not available"}</div>
                  </div>
                  <div>
                    <Text type="secondary">Phone:</Text>
                    <div>{record.customer?.phoneNumber || account?.phoneNumber || "Not available"}</div>
                  </div>
                </div>
              </Card>
            ) : record.customerId ? (
              <Card title="Customer Information">
                <div className="text-center">
                  <Spin size="large" />
                  <Title level={4} type="secondary">
                    Loading customer information...
                  </Title>
                </div>
              </Card>
            ) : (
              <Card title="Customer Information">
                <div className="text-center">
                  <UserOutlined style={{ fontSize: "48px", color: "#d9d9d9" }} />
                  <Title level={4} type="secondary">
                    Anonymous Customer
                  </Title>
                  <Text type="secondary">
                    No customer information provided
                  </Text>
                </div>
              </Card>
            )}

            {/* Discount Package */}
            {record.discountPackage && (
              <Card title="Discount Package" className="mt-4">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                    <PercentageOutlined
                      style={{ fontSize: "24px", color: "#52c41a" }}
                    />
                  </div>
                  <Title level={5} className="mb-0">
                    {discountPackage?.name || "Loading..."}
                  </Title>
                  <Text type="secondary">Package ID: {record.discountPackage}</Text>
                </div>
                                 {discountPackage && (
                   <div className="space-y-2">
                     <div>
                       <Text type="secondary">Discount Rate:</Text>
                       <div>
                         <Tag color="green">{(discountPackage.discountPercentage * 100).toFixed(1)}%</Tag>
                       </div>
                     </div>
                     <div>
                       <Text type="secondary">Description:</Text>
                       <div>{discountPackage.description || "No description"}</div>
                     </div>
                   </div>
                 )}
              </Card>
            )}

            {/* Applied Vouchers */}
            {record.voucher && (
              <Card title="Applied Vouchers" className="mt-4">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-3">
                    <GiftOutlined
                      style={{ fontSize: "24px", color: "#722ed1" }}
                    />
                  </div>
                </div>
                                 <div className="border-b pb-2 mb-2 last:border-b-0">
                   <div className="flex justify-between items-center">
                     <div>
                       <Text strong>{voucher?.code || record.voucher}</Text>
                       <br />
                       <Text type="secondary" style={{ fontSize: "12px" }}>
                         Min Amount: {formatCurrency(voucher?.minTransactionAmount || 0)}
                       </Text>
                     </div>
                     <div className="text-right">
                       <Text style={{ color: "#52c41a" }}>
                         -{formatCurrency(voucher?.discountAmount || 0)}
                       </Text>
                       <br />
                       <Tag color="purple" style={{ fontSize: "10px" }}>
                         {voucher?.status || "ACTIVE"}
                       </Tag>
                     </div>
                   </div>
                 </div>
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </Show>
  );
};
