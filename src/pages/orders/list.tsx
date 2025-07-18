import React, { useEffect, useState } from "react";
import {
  List,
  DateField,
  TagField,
  TextField,
  FilterDropdown,
  useSelect,
  getDefaultSortOrder,
} from "@refinedev/antd";
import {
  Table,
  Space,
  Button,
  Input,
  Select,
  Card,
  Statistic,
  Row,
  Col,
  Tag,
  DatePicker,
  InputNumber,
  Tooltip,
  Badge,
  Avatar,
  Typography,
  Dropdown,
  MenuProps,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  FilterOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  ExportOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import {
  OrderSummaryDto,
  OrderStatus,
  PaymentMethod,
  OrderType,
  OrderFilter,
  OrderDto,
  AccountDto,
} from "../../data/interfaces";
import { SortDirection } from "../../data/types/enums";
import { useOrders, useDashboardStats } from "../../hooks";
import { formatCurrency } from "../../utils/formatCurrency";
import { accountService } from "../../data";
import { formatDate } from "../../utils/formatDate";
import { useNavigate } from "react-router";
import { SortOrder } from "antd/es/table/interface";

const { RangePicker } = DatePicker;
const { Text } = Typography;

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
  //   icon: <ReloadOutlined />,
  //   text: "Refunded",
  // },
  [OrderStatus.FAILED]: {
    color: "red",
    icon: <CloseCircleOutlined />,
    text: "Failed",
  },
};

// Payment method configuration
const paymentMethodConfig = {
  [PaymentMethod.CREDIT_CARD]: { color: "blue", text: "Credit Card" },
  [PaymentMethod.DEBIT_CARD]: { color: "green", text: "Debit Card" },
  [PaymentMethod.DIGITAL_WALLET]: { color: "purple", text: "Digital Wallet" },
  [PaymentMethod.BANK_TRANSFER]: { color: "orange", text: "Bank Transfer" },
  [PaymentMethod.CASH]: { color: "gray", text: "Cash" },
  [PaymentMethod.PAYOS]: { color: "gold", text: "PayOS" },
};

// Order type configuration
const orderTypeConfig = {
  [OrderType.SINGLE_TICKET]: { color: "blue", text: "Single Ticket" },
  [OrderType.BULK_TICKETS]: { color: "green", text: "Bulk Tickets" },
  [OrderType.SUBSCRIPTION]: { color: "purple", text: "Subscription" },
  [OrderType.TIMED_PASS]: { color: "orange", text: "Timed Pass" },
};

export const OrderList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [filters, setFilters] = useState<OrderFilter>({});
  const [sort, setSort] = useState<Record<string, SortDirection>>({
    createdAt: SortDirection.DESC
  });
  const navigate = useNavigate();
  // Dashboard stats
  const {
    data: dashboardStats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useDashboardStats();

  // Orders data
  const {
    data: ordersData,
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useOrders({ page, size, sort }, filters);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Handle table changes including sorting
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const newSort: Record<string, SortDirection> = {};
    
    // Handle multiple column sorting
    if (Array.isArray(sorter)) {
      sorter.forEach((s) => {
        if (s.field && s.order) {
          newSort[s.field] = s.order === 'ascend' ? SortDirection.ASC : SortDirection.DESC;
        }
      });
    } else if (sorter.field && sorter.order) {
      // Handle single column sorting
      newSort[sorter.field] = sorter.order === 'ascend' ? SortDirection.ASC : SortDirection.DESC;
    }
    
    setSort(Object.keys(newSort).length > 0 ? newSort : { createdAt: SortDirection.DESC });
  };

  // Convert sort state to antd sorter format for controlled sorting
  const getSorterProps = (field: string) => {
    const sortDirection = sort?.[field];
    return {
      sorter: true,
      sortOrder: sortDirection ? (sortDirection === SortDirection.ASC ? 'ascend' : 'descend') as SortOrder : undefined,
    };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Dashboard Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={dashboardStats?.totalOrders || 0}
              prefix={<ShoppingCartOutlined />}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Orders"
              value={dashboardStats?.ordersByStatus.PENDING || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#fa8c16" }}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completed Orders"
              value={dashboardStats?.ordersByStatus.COMPLETED || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={dashboardStats?.totalRevenue || 0}
              formatter={(value) => formatCurrency(Number(value))}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#1890ff" }}
              loading={statsLoading}
            />
          </Card>
        </Col>
      </Row>

      {/* Orders List */}
      <List
        title="Order Management"
        headerButtons={({ defaultButtons }) => (
          <>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={() => {
                refetchOrders();
                refetchStats();
              }}
            >
              Refresh
            </Button>
            {defaultButtons}
          </>
        )}
      >
        {/* Search and Filter Form */}
        <Card className="mb-4">
          <Space wrap className="w-full justify-between">
            <Space wrap>
              <Input
                placeholder="Search orders, customers..."
                prefix={<SearchOutlined />}
                onChange={(e) => {
                  const newFilters = { ...filters, search: e.target.value };
                  setFilters(newFilters);
                }}
                style={{ width: 250 }}
                allowClear
              />

              {/* <Select
                placeholder="Status"
                style={{ width: 140 }}
                allowClear
                onChange={(value) => {
                  const newFilters = { ...filters, status: value };
                  setFilters(newFilters);
                }}
              >
                {Object.values(OrderStatus).map((status) => (
                  <Select.Option key={status} value={status}>
                    <Space>
                      {statusConfig[status].icon}
                      {statusConfig[status].text}
                    </Space>
                  </Select.Option>
                ))}
              </Select>

              <Select
                placeholder="Order Type"
                style={{ width: 140 }}
                allowClear
                onChange={(value) => {
                  const newFilters = { ...filters, orderType: value };
                  setFilters(newFilters);
                }}
              >
                {Object.values(OrderType).map((type) => (
                  <Select.Option key={type} value={type}>
                    {orderTypeConfig[type].text}
                  </Select.Option>
                ))}
              </Select>

              <Select
                placeholder="Payment Method"
                style={{ width: 140 }}
                allowClear
                onChange={(value) => {
                  const newFilters = { ...filters, paymentMethod: value };
                  setFilters(newFilters);
                }}
              >
                {Object.values(PaymentMethod).map((method) => (
                  <Select.Option key={method} value={method}>
                    {paymentMethodConfig[method].text}
                  </Select.Option>
                ))}
              </Select> */}
            </Space>

            {/* <Space>
              <RangePicker
                placeholder={["Start Date", "End Date"]}
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    const newFilters = {
                      ...filters,
                      orderDateFrom: dates[0].format("YYYY-MM-DD"),
                      orderDateTo: dates[1].format("YYYY-MM-DD"),
                    };
                    setFilters(newFilters);
                  } else {
                    const newFilters = { ...filters };
                    delete newFilters.orderDateFrom;
                    delete newFilters.orderDateTo;
                    setFilters(newFilters);
                  }
                }}
              />
            </Space> */}
          </Space>

          {/* Amount Range Filter */}
          {/* <Space className="mt-4" wrap>
            <Text>Amount Range:</Text>
            <InputNumber
              placeholder="Min Amount"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              onChange={(value) => {
                const newFilters = {
                  ...filters,
                  minAmount: typeof value === "number" ? value : undefined,
                };
                setFilters(newFilters);
              }}
              style={{ width: 120 }}
            />
            <Text>-</Text>
            <InputNumber
              placeholder="Max Amount"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              onChange={(value) => {
                const newFilters = {
                  ...filters,
                  maxAmount: typeof value === "number" ? value : undefined,
                };
                setFilters(newFilters);
              }}
              style={{ width: 120 }}
            />
            <Button
              icon={<FilterOutlined />}
              onClick={() => {
                refetchOrders();
              }}
            >
              Apply Filters
            </Button>
          </Space> */}
        </Card>

        {/* Orders Table */}
        <Table
          dataSource={ordersData?.content || []}
          rowKey="id"
          loading={ordersLoading}
          scroll={{ x: 1200 }}
          onChange={handleTableChange}
          pagination={{
            current: page + 1,
            pageSize: size,
            total: ordersData?.totalElements || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} orders`,
            onChange: (current, pageSize) => {
              setPage(current - 1);
              setSize(pageSize || 10);
            },
          }}
        >
          <Table.Column
            dataIndex="id"
            title="Order Id"
            render={(value: string, record: OrderDto) => (
              <Space direction="vertical" size="small">
                <Text strong>{value}</Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {record.orderDetails.length} item(s)
                </Text>
              </Space>
            )}
            {...getSorterProps('id')}
          />

          <Table.Column
            dataIndex={["customer", "fullName"]}
            title="Customer"
            render={(value: string) => {
              return (
                <Text>
                  {value || '-'}
                </Text>
              );
            }}
            {...getSorterProps('customer.fullName')}
          />

          <Table.Column
            dataIndex="status"
            title="Status"
            render={(value: OrderStatus) => {
              const config = statusConfig[value];
              if (!config) return <Text type="secondary">-</Text>;
              return (
                <Tag
                  color={config.color}
                  icon={config.icon}
                  className="font-medium"
                >
                  {config.text}
                </Tag>
              );
            }}
            {...getSorterProps('status')}
          />

          <Table.Column
            dataIndex="finalTotal"
            title="Total Amount"
            render={(value: number) => (
              <Text strong style={{ color: "#1890ff" }}>
                {formatCurrency(value)}
              </Text>
            )}
            {...getSorterProps('finalTotal')}
          />

          <Table.Column
            dataIndex="paymentMethod"
            title="Payment"
            render={(value: PaymentMethod) => {
              if (!value) return <Text type="secondary">-</Text>;
              const config = paymentMethodConfig[value];
              if (!config) return <Text type="secondary">-</Text>;
              return (
                <Tag color={config.color} className="font-medium">
                  {config.text}
                </Tag>
              );
            }}
            {...getSorterProps('paymentMethod')}
          />

          <Table.Column
            dataIndex="createdAt"
            title="Order Date"
            render={(value: string) => (
              <DateField
                value={formatDate(value)}
                format="MMM DD, YYYY HH:mm"
              />
            )}
            {...getSorterProps('createdAt')}
          />

          <Table.Column
            title="Actions"
            dataIndex="actions"
            render={(_: any, record: OrderDto) => (
              <Space>
                <Tooltip title="View Details">
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={() => {
                      navigate(`/orders/show/${record.id}`);
                    }}
                  />
                </Tooltip>

                {false && <Tooltip title="Edit Order">
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => {
                      navigate(`/orders/edit/${record.id}`);
                    }}
                  />
                </Tooltip>}
              </Space>
            )}
          />
        </Table>
      </List>
    </div>
  );
};
