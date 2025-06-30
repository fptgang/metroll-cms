import React, { useState } from "react";
import {
  List,
  useTable,
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
} from "../../data/interfaces";
import { useOrders, useDashboardStats } from "../../hooks";
import { formatCurrency } from "../../utils/formatCurrency";

const { RangePicker } = DatePicker;
const { Text } = Typography;

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
    icon: <ReloadOutlined />,
    text: "Refunded",
  },
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
};

// Order type configuration
const orderTypeConfig = {
  [OrderType.SINGLE_TICKET]: { color: "blue", text: "Single Ticket" },
  [OrderType.BULK_TICKETS]: { color: "green", text: "Bulk Tickets" },
  [OrderType.SUBSCRIPTION]: { color: "purple", text: "Subscription" },
  [OrderType.TIMED_PASS]: { color: "orange", text: "Timed Pass" },
};

export const OrderList: React.FC = () => {
  const [filters, setFilters] = useState<OrderFilter>({});

  // Dashboard stats
  const {
    data: dashboardStats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useDashboardStats();

  const { tableProps, searchFormProps, sorters, tableQueryResult } =
    useTable<OrderSummaryDto>({
      resource: "orders",
      onSearch: (values: any) => {
        const crudFilters: any[] = [];

        if (values.search) {
          crudFilters.push({
            field: "search",
            operator: "contains",
            value: values.search,
          });
        }

        const orderFilters: OrderFilter = {
          search: values.search,
          status: values.status,
          orderType: values.orderType,
          paymentMethod: values.paymentMethod,
          orderDateFrom: values.dateRange?.[0]?.format("YYYY-MM-DD"),
          orderDateTo: values.dateRange?.[1]?.format("YYYY-MM-DD"),
          minAmount: values.minAmount,
          maxAmount: values.maxAmount,
        };
        setFilters(orderFilters);

        return crudFilters;
      },
      syncWithLocation: true,
    });

  // Table action items
  const getActionItems = (record: OrderSummaryDto): MenuProps["items"] => [
    {
      key: "view",
      icon: <EyeOutlined />,
      label: "View Details",
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit Order",
      disabled: record.status === OrderStatus.COMPLETED,
    },
    {
      type: "divider",
    },
    {
      key: "export",
      icon: <ExportOutlined />,
      label: "Export Order",
    },
  ];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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
                tableQueryResult.refetch();
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

              <Select
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
              </Select>
            </Space>

            <Space>
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
            </Space>
          </Space>

          {/* Amount Range Filter */}
          <Space className="mt-4" wrap>
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
                tableQueryResult.refetch();
              }}
            >
              Apply Filters
            </Button>
          </Space>
        </Card>

        {/* Orders Table */}
        <Table
          {...tableProps}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} orders`,
          }}
        >
          <Table.Column
            dataIndex="orderNumber"
            title="Order Number"
            sorter
            defaultSortOrder={getDefaultSortOrder("orderNumber", sorters)}
            render={(value: string, record: OrderSummaryDto) => (
              <Space direction="vertical" size="small">
                <Text strong>{value}</Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {record.itemCount} item(s)
                </Text>
              </Space>
            )}
          />

          <Table.Column
            dataIndex="customerName"
            title="Customer"
            sorter
            defaultSortOrder={getDefaultSortOrder("customerName", sorters)}
            render={(value: string) => (
              <Space>
                <Avatar size="small">{value?.charAt(0)?.toUpperCase()}</Avatar>
                <Text>{value}</Text>
              </Space>
            )}
          />

          <Table.Column
            dataIndex="status"
            title="Status"
            sorter
            defaultSortOrder={getDefaultSortOrder("status", sorters)}
            render={(value: OrderStatus) => {
              const config = statusConfig[value];
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
          />

          <Table.Column
            dataIndex="totalAmount"
            title="Total Amount"
            sorter
            defaultSortOrder={getDefaultSortOrder("totalAmount", sorters)}
            render={(value: number) => (
              <Text strong style={{ color: "#1890ff" }}>
                {formatCurrency(value)}
              </Text>
            )}
          />

          <Table.Column
            dataIndex="paymentMethod"
            title="Payment"
            render={(value: PaymentMethod) => {
              if (!value) return <Text type="secondary">-</Text>;
              const config = paymentMethodConfig[value];
              return (
                <Tag color={config.color} className="font-medium">
                  {config.text}
                </Tag>
              );
            }}
          />

          <Table.Column
            dataIndex="orderDate"
            title="Order Date"
            sorter
            defaultSortOrder={getDefaultSortOrder("orderDate", sorters)}
            render={(value: string) => (
              <DateField value={value} format="MMM DD, YYYY HH:mm" />
            )}
          />

          <Table.Column
            title="Actions"
            dataIndex="actions"
            render={(_: any, record: OrderSummaryDto) => (
              <Space>
                <Tooltip title="View Details">
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    size="small"
                    href={`/orders/show/${record.orderNumber}`}
                  />
                </Tooltip>

                <Tooltip title="Edit Order">
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    disabled={record.status === OrderStatus.COMPLETED}
                    href={`/orders/edit/${record.orderNumber}`}
                  />
                </Tooltip>

                <Dropdown
                  menu={{
                    items: getActionItems(record),
                    onClick: ({ key }) => {
                      switch (key) {
                        case "view":
                          window.location.href = `/orders/show/${record.orderNumber}`;
                          break;
                        case "edit":
                          window.location.href = `/orders/edit/${record.orderNumber}`;
                          break;
                        default:
                          break;
                      }
                    },
                  }}
                  trigger={["click"]}
                >
                  <Button icon={<MoreOutlined />} size="small" />
                </Dropdown>
              </Space>
            )}
          />
        </Table>
      </List>
    </div>
  );
};
