import React from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Spin,
  Alert,
  Progress,
  Divider,
  Button,
  Tabs,
} from "antd";
import {
  UserOutlined,
  TagOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  LineChartOutlined,
  SafetyOutlined,
  GiftOutlined,
  NodeIndexOutlined,
  CarOutlined,
  ReloadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  useAccountDashboard,
  useTicketDashboard,
  useSubwayDashboard,
  useOrderDashboard,
} from "../../hooks";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Component for service error state
const ServiceErrorCard: React.FC<{
  title: string;
  serviceName: string;
  onRetry: () => void;
  isRetrying: boolean;
}> = ({ title, serviceName, onRetry, isRetrying }) => (
  <Card className="border-red-200 bg-red-50">
    <div className="text-center py-8">
      <WarningOutlined className="text-4xl text-red-500 mb-4" />
      <Title level={4} className="text-red-700 mb-2">
        {title} Service Unavailable
      </Title>
      <Text type="secondary" className="block mb-4">
        Unable to load data from {serviceName} service
      </Text>
      <Button
        type="primary"
        danger
        icon={<ReloadOutlined />}
        onClick={onRetry}
        loading={isRetrying}
      >
        Retry
      </Button>
    </div>
  </Card>
);

// Component for service loading state
const ServiceLoadingCard: React.FC<{
  title: string;
  height?: string;
}> = ({ title, height = "200px" }) => (
  <Card className="border-blue-200 bg-blue-50" style={{ minHeight: height }}>
    <div className="flex flex-col items-center justify-center py-8">
      <Spin size="large" className="mb-4" />
      <Text type="secondary">Loading {title} data...</Text>
    </div>
  </Card>
);

export const Dashboard: React.FC = () => {
  const accountDashboard = useAccountDashboard();
  const ticketDashboard = useTicketDashboard();
  const subwayDashboard = useSubwayDashboard();
  const orderDashboard = useOrderDashboard();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2} className="text-gray-800">
          Metroll CMS Dashboard
        </Title>
        <Text type="secondary">
          Real-time overview of your metro system operations
        </Text>

        {/* System Status Overview */}
        <div className="mt-4 flex flex-wrap gap-2">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
              accountDashboard.error
                ? "bg-red-100 text-red-700"
                : accountDashboard.isLoading
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                accountDashboard.error
                  ? "bg-red-500"
                  : accountDashboard.isLoading
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            />
            Account Service
          </div>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
              ticketDashboard.error
                ? "bg-red-100 text-red-700"
                : ticketDashboard.isLoading
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                ticketDashboard.error
                  ? "bg-red-500"
                  : ticketDashboard.isLoading
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            />
            Ticket Service
          </div>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
              subwayDashboard.error
                ? "bg-red-100 text-red-700"
                : subwayDashboard.isLoading
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                subwayDashboard.error
                  ? "bg-red-500"
                  : subwayDashboard.isLoading
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            />
            Subway Service
          </div>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
              orderDashboard.error
                ? "bg-red-100 text-red-700"
                : orderDashboard.isLoading
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                orderDashboard.error
                  ? "bg-red-500"
                  : orderDashboard.isLoading
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            />
            Order Service
          </div>
        </div>
      </div>

      <Tabs defaultActiveKey="1" size="large" className="dashboard-tabs">
        {/* Account Management Tab */}
        <TabPane
          tab={
            <span className="flex items-center gap-2">
              <UserOutlined />
              Account Management
            </span>
          }
          key="1"
        >
          {accountDashboard.error ? (
            <ServiceErrorCard
              title="Account Management"
              serviceName="Account"
              onRetry={() => accountDashboard.refetch()}
              isRetrying={accountDashboard.isLoading}
            />
          ) : accountDashboard.isLoading ? (
            <ServiceLoadingCard title="Account Management" />
          ) : (
            <>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <Statistic
                      title="Total Accounts"
                      value={accountDashboard.data?.totalAccounts || 0}
                      prefix={<UserOutlined />}
                      valueStyle={{ color: "#1890ff" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <Statistic
                      title="Active Accounts"
                      value={accountDashboard.data?.activeAccounts || 0}
                      prefix={<CheckCircleOutlined />}
                      valueStyle={{ color: "#52c41a" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <Statistic
                      title="Staff Assigned"
                      value={
                        accountDashboard.data?.staffWithAssignedStation || 0
                      }
                      prefix={<TeamOutlined />}
                      valueStyle={{ color: "#722ed1" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <Statistic
                      title="Total Vouchers"
                      value={accountDashboard.data?.totalVouchers || 0}
                      prefix={<GiftOutlined />}
                      valueStyle={{ color: "#fa8c16" }}
                      suffix={
                        <Text type="secondary" className="text-xs">
                          {accountDashboard.data?.totalVoucherValue
                            ? `(${formatCurrency(
                                parseFloat(
                                  accountDashboard.data.totalVoucherValue
                                )
                              )})`
                            : ""}
                        </Text>
                      }
                    />
                  </Card>
                </Col>
              </Row>

              {/* Account Role Breakdown */}
              {accountDashboard.data?.accountsByRole && (
                <Card className="mt-4 shadow-sm">
                  <Title level={4}>Account Distribution by Role</Title>
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {accountDashboard.data.accountsByRole.ADMIN}
                        </div>
                        <Text>Admins</Text>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {accountDashboard.data.accountsByRole.STAFF}
                        </div>
                        <Text>Staff</Text>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {accountDashboard.data.accountsByRole.CUSTOMER}
                        </div>
                        <Text>Customers</Text>
                      </div>
                    </Col>
                  </Row>
                </Card>
              )}
            </>
          )}
        </TabPane>

        {/* Ticket Operations Tab */}
        <TabPane
          tab={
            <span className="flex items-center gap-2">
              <TagOutlined />
              Ticket Operations
            </span>
          }
          key="2"
        >
          {ticketDashboard.error ? (
            <ServiceErrorCard
              title="Ticket Operations"
              serviceName="Ticket"
              onRetry={() => ticketDashboard.refetch()}
              isRetrying={ticketDashboard.isLoading}
            />
          ) : ticketDashboard.isLoading ? (
            <ServiceLoadingCard title="Ticket Operations" />
          ) : (
            <>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <Statistic
                      title="Total Tickets"
                      value={ticketDashboard.data?.totalTickets || 0}
                      prefix={<TagOutlined />}
                      valueStyle={{ color: "#1890ff" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <Statistic
                      title="Today's Validations"
                      value={ticketDashboard.data?.todayValidations || 0}
                      prefix={<CheckCircleOutlined />}
                      valueStyle={{ color: "#52c41a" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <Statistic
                      title="Total Validations"
                      value={ticketDashboard.data?.totalValidations || 0}
                      prefix={<LineChartOutlined />}
                      valueStyle={{ color: "#722ed1" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <Statistic
                      title="P2P Journeys"
                      value={ticketDashboard.data?.totalP2PJourneys || 0}
                      prefix={<EnvironmentOutlined />}
                      valueStyle={{ color: "#fa8c16" }}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Ticket Status and Type Breakdown */}
              <Row gutter={[16, 16]} className="mt-4">
                <Col xs={24} lg={12}>
                  <Card className="shadow-sm">
                    <Title level={4}>Tickets by Status</Title>
                    {ticketDashboard.data?.ticketsByStatus &&
                    ticketDashboard.data.totalTickets > 0 ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Text>Valid</Text>
                          <div className="flex items-center gap-2">
                            <Progress
                              percent={Math.round(
                                (ticketDashboard.data.ticketsByStatus.VALID /
                                  ticketDashboard.data.totalTickets) *
                                  100
                              )}
                              showInfo={false}
                              strokeColor="#52c41a"
                              className="w-20"
                            />
                            <Text strong>
                              {ticketDashboard.data.ticketsByStatus.VALID}
                            </Text>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <Text>Used</Text>
                          <div className="flex items-center gap-2">
                            <Progress
                              percent={Math.round(
                                (ticketDashboard.data.ticketsByStatus.USED /
                                  ticketDashboard.data.totalTickets) *
                                  100
                              )}
                              showInfo={false}
                              strokeColor="#1890ff"
                              className="w-20"
                            />
                            <Text strong>
                              {ticketDashboard.data.ticketsByStatus.USED}
                            </Text>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <Text>Expired</Text>
                          <div className="flex items-center gap-2">
                            <Progress
                              percent={Math.round(
                                (ticketDashboard.data.ticketsByStatus.EXPIRED /
                                  ticketDashboard.data.totalTickets) *
                                  100
                              )}
                              showInfo={false}
                              strokeColor="#f5222d"
                              className="w-20"
                            />
                            <Text strong>
                              {ticketDashboard.data.ticketsByStatus.EXPIRED}
                            </Text>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Text>No ticket data available</Text>
                      </div>
                    )}
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card className="shadow-sm">
                    <Title level={4}>Tickets by Type</Title>
                    {ticketDashboard.data?.ticketsByType &&
                    ticketDashboard.data.totalTickets > 0 ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Text>Point-to-Point</Text>
                          <div className="flex items-center gap-2">
                            <Progress
                              percent={Math.round(
                                (ticketDashboard.data.ticketsByType.P2P /
                                  ticketDashboard.data.totalTickets) *
                                  100
                              )}
                              showInfo={false}
                              strokeColor="#722ed1"
                              className="w-20"
                            />
                            <Text strong>
                              {ticketDashboard.data.ticketsByType.P2P}
                            </Text>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <Text>Timed</Text>
                          <div className="flex items-center gap-2">
                            <Progress
                              percent={Math.round(
                                (ticketDashboard.data.ticketsByType.TIMED /
                                  ticketDashboard.data.totalTickets) *
                                  100
                              )}
                              showInfo={false}
                              strokeColor="#fa8c16"
                              className="w-20"
                            />
                            <Text strong>
                              {ticketDashboard.data.ticketsByType.TIMED}
                            </Text>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Text>No ticket data available</Text>
                      </div>
                    )}
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </TabPane>

        {/* Infrastructure Tab */}
        <TabPane
          tab={
            <span className="flex items-center gap-2">
              <NodeIndexOutlined />
              Infrastructure
            </span>
          }
          key="3"
        >
          {subwayDashboard.error ? (
            <ServiceErrorCard
              title="Infrastructure"
              serviceName="Subway"
              onRetry={() => subwayDashboard.refetch()}
              isRetrying={subwayDashboard.isLoading}
            />
          ) : subwayDashboard.isLoading ? (
            <ServiceLoadingCard title="Infrastructure" />
          ) : (
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <Statistic
                    title="Total Stations"
                    value={subwayDashboard.data?.totalStations || 0}
                    prefix={<EnvironmentOutlined />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <Statistic
                    title="Metro Lines"
                    value={subwayDashboard.data?.totalMetroLines || 0}
                    prefix={<NodeIndexOutlined />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <Statistic
                    title="Total Trains"
                    value={subwayDashboard.data?.totalTrains || 0}
                    prefix={<CarOutlined />}
                    valueStyle={{ color: "#722ed1" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <Statistic
                    title="Avg Stations/Line"
                    value={
                      subwayDashboard.data?.averageStationsPerLine?.toFixed(
                        1
                      ) || 0
                    }
                    prefix={<LineChartOutlined />}
                    valueStyle={{ color: "#fa8c16" }}
                  />
                </Card>
              </Col>
            </Row>
          )}
        </TabPane>

        {/* Revenue & Orders Tab */}
        <TabPane
          tab={
            <span className="flex items-center gap-2">
              <DollarOutlined />
              Revenue & Orders
            </span>
          }
          key="4"
        >
          {orderDashboard.error ? (
            <ServiceErrorCard
              title="Revenue & Orders"
              serviceName="Order"
              onRetry={() => orderDashboard.refetch()}
              isRetrying={orderDashboard.isLoading}
            />
          ) : orderDashboard.isLoading ? (
            <ServiceLoadingCard title="Revenue & Orders" />
          ) : (
            <>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <Statistic
                      title="Total Revenue"
                      value={
                        orderDashboard.data?.totalRevenue
                          ? formatCurrency(
                              parseFloat(orderDashboard.data.totalRevenue)
                            )
                          : "₫0"
                      }
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: "#52c41a" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <Statistic
                      title="Today's Revenue"
                      value={
                        orderDashboard.data?.todayRevenue
                          ? formatCurrency(
                              parseFloat(orderDashboard.data.todayRevenue)
                            )
                          : "₫0"
                      }
                      prefix={<ClockCircleOutlined />}
                      valueStyle={{ color: "#1890ff" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <Statistic
                      title="Total Orders"
                      value={orderDashboard.data?.totalOrders || 0}
                      prefix={<ShoppingCartOutlined />}
                      valueStyle={{ color: "#722ed1" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <Statistic
                      title="Today's Orders"
                      value={orderDashboard.data?.todayOrders || 0}
                      prefix={<TagOutlined />}
                      valueStyle={{ color: "#fa8c16" }}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Order Status Breakdown */}
              {orderDashboard.data?.ordersByStatus && (
                <Card className="mt-4 shadow-sm">
                  <Title level={4}>Order Status Distribution</Title>
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {orderDashboard.data.ordersByStatus.COMPLETED}
                        </div>
                        <Text>Completed</Text>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {orderDashboard.data.ordersByStatus.PENDING}
                        </div>
                        <Text>Pending</Text>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {orderDashboard.data.ordersByStatus.FAILED}
                        </div>
                        <Text>Failed</Text>
                      </div>
                    </Col>
                  </Row>
                </Card>
              )}
            </>
          )}
        </TabPane>
      </Tabs>

      {/* Last Updated Footer */}
      <Card className="shadow-sm mt-6">
        <div className="text-center">
          <Text type="secondary">
            Last updated: {formatDate(new Date().toISOString())}
          </Text>
          <Divider type="vertical" />
          <Text type="secondary">
            Data refreshes automatically every 2-10 minutes
          </Text>
        </div>
      </Card>
    </div>
  );
};
