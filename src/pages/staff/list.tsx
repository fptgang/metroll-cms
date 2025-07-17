import React, { useState } from "react";
import { CreateButton } from "@refinedev/antd";
import {
  Table,
  Card,
  Input,
  Tag,
  Typography,
  Button,
  Pagination,
  Space,
  Dropdown,
  Avatar,
  Tooltip,
  Badge,
} from "antd";
import type { SortOrder } from "antd/es/table/interface";
import {
  SearchOutlined,
  TeamOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  UserOutlined,
  SettingOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { AccountDto, AccountRole, SortDirection } from "../../data/interfaces";
import { useStaff } from "../../hooks";
import { formatDate } from "../../utils/formatDate";

const { Title, Text } = Typography;
const { Search } = Input;

export const StaffList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<Record<string, SortDirection>>({
    createdAt: SortDirection.DESC
  });

  const { data, isLoading, error } = useStaff(page, size, sort, {
    search: searchQuery,
    role: AccountRole.STAFF,
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(0);
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

  const staff = data?.content || [];
  const total = data?.totalElements || 0;

  const columns = [
    {
      title: "Staff Member",
      key: "staff",
      width: 250,
      render: (_: any, record: AccountDto) => (
        <div className="flex items-center gap-3">
          <Avatar size={40} icon={<UserOutlined />} className="bg-blue-500" />
          <div>
            <div className="font-medium">{record.fullName}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (name: string) => <span className="font-medium">{name}</span>,
      ...getSorterProps('fullName'),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string) => (
        <div className="flex items-center gap-2">
          <MailOutlined className="text-blue-500" />
          <span className="font-mono text-sm">{email}</span>
        </div>
      ),
      ...getSorterProps('email'),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phone: string) => (
        <div className="flex items-center gap-2">
          <PhoneOutlined className="text-green-500" />
          <span className="font-mono text-sm">{phone}</span>
        </div>
      ),
      ...getSorterProps('phoneNumber'),
    },
    {
      title: "Station Assignment",
      dataIndex: "assignedStation",
      key: "assignedStation",
      render: (station: string) => (
        <div className="flex items-center gap-2">
          <EnvironmentOutlined className="text-purple-500" />
          {station ? (
            <Badge status="success" text={station} />
          ) : (
            <Badge status="default" text="Not Assigned" />
          )}
        </div>
      ),
      ...getSorterProps('assignedStation'),
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <Tag
          color={active ? "green" : "red"}
          icon={active ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        >
          {active ? "Active" : "Inactive"}
        </Tag>
      ),
      ...getSorterProps('active'),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span className="text-sm text-gray-500">{formatDate(date)}</span>
      ),
      ...getSorterProps('createdAt'),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: AccountDto) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              className="text-blue-600"
            />
          </Tooltip>
          <Tooltip title="Edit Staff">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              className="text-green-600"
            />
          </Tooltip>
          <Tooltip title="Settings">
            <Button
              type="text"
              icon={<SettingOutlined />}
              size="small"
              className="text-purple-600"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title={
          <div className="flex items-center gap-2">
            <TeamOutlined className="text-blue-600" />
            <Title level={4} className="m-0">
              Staff Management
            </Title>
          </div>
        }
        className="shadow-sm"
      >
        {/* Search and Filters */}
        <div className="mb-6">
          <Search
            placeholder="Search staff by name, username, or email..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            className="max-w-lg"
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{total}</div>
            <div className="text-sm text-blue-600">Total Staff</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {staff.filter((s) => s.assignedStation).length}
            </div>
            <div className="text-sm text-purple-600">Assigned to Stations</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {staff.filter((s) => !s.assignedStation).length}
            </div>
            <div className="text-sm text-orange-600">Unassigned</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {staff.filter((s) => s.active).length}
            </div>
            <div className="text-sm text-green-600">Active Staff</div>
          </div>
        </div>

        {/* Staff Table */}
        <Table
          dataSource={staff}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={false}
          onChange={handleTableChange}
          className="bg-white rounded-lg"
          size="middle"
          scroll={{ x: 1200 }}
        />

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <Pagination
            current={page + 1}
            pageSize={size}
            total={total}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} staff members`
            }
            onChange={(current, pageSize) => {
              setPage(current - 1);
              setSize(pageSize || 10);
            }}
          />
        </div>
      </Card>
    </div>
  );
};
