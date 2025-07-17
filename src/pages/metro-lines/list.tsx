import React, { useState } from "react";
import { EditButton, ShowButton, CreateButton } from "@refinedev/antd";
import {
  Table,
  Space,
  Tag,
  Card,
  Input,
  Select,
  Button,
  Pagination,
  Tooltip,
  Progress,
} from "antd";
import type { SortOrder } from "antd/es/table/interface";
import {
  SearchOutlined,
  NodeIndexOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BuildOutlined,
  StopOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  MetroLineDto,
  LineStatus,
  MetroLineFilter,
  SortDirection,
} from "../../data/interfaces";
import { useMetroLines } from "../../hooks";
import { formatDate } from "../../utils/formatDate";
import { usePermissions } from "@refinedev/core";

const { Option } = Select;

export const MetroLineList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [filters, setFilters] = useState<MetroLineFilter>({});
  const [sort, setSort] = useState<Record<string, SortDirection>>({
    createdAt: SortDirection.DESC
  });
  const perm = usePermissions();

  const { data, isLoading, error } = useMetroLines(page, size, sort, filters);

  const handleSearch = (value: string) => {
    setFilters({ ...filters, name: value });
    setPage(0); // Reset to first page when searching
  };

  const handleStatusFilter = (status: LineStatus | undefined) => {
    setFilters({ ...filters, status });
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

  const metroLines = data?.content || [];
  const total = data?.totalElements || 0;

  const getStatusColor = (status: LineStatus) => {
    switch (status) {
      case LineStatus.OPERATIONAL:
        return "green";
      case LineStatus.PLANNED:
        return "blue";
      case LineStatus.UNDER_MAINTENANCE:
        return "orange";
      case LineStatus.CLOSED:
        return "red";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: LineStatus) => {
    switch (status) {
      case LineStatus.OPERATIONAL:
        return <CheckCircleOutlined />;
      case LineStatus.PLANNED:
        return <ClockCircleOutlined />;
      case LineStatus.UNDER_MAINTENANCE:
        return <BuildOutlined />;
      case LineStatus.CLOSED:
        return <StopOutlined />;
      default:
        return <ExclamationCircleOutlined />;
    }
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 100,
      render: (code: string) => (
        <span className="font-mono font-bold text-blue-600">{code}</span>
      ),
      ...getSorterProps('code'),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <span className="font-medium">{name}</span>,
      ...getSorterProps('name'),
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      width: 80,
      render: (color: string) => (
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border"
            style={{ backgroundColor: color }}
          />
          <span className="font-mono text-xs">{color}</span>
        </div>
      ),
      ...getSorterProps('color'),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: LineStatus) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status.replace("_", " ")}
        </Tag>
      ),
      ...getSorterProps('status'),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => (
        <span className="text-xs text-gray-500">{formatDate(date)}</span>
      ),
      ...getSorterProps('createdAt'),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: MetroLineDto) => (
        <Space size="small">
          <ShowButton
            hideText
            size="small"
            recordItemId={record.code}
            className="text-blue-600"
          />
          {perm.data == "ADMIN" && <EditButton
            hideText
            size="small"
            recordItemId={record.code}
            className="text-green-600"
          />}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title={
          <div className="flex items-center gap-2">
            <NodeIndexOutlined className="text-blue-600" />
            <span className="text-xl font-semibold">Metro Lines</span>
          </div>
        }
        extra={perm.data == "ADMIN" && <CreateButton />}
        className="shadow-sm"
      >
        <Space direction="vertical" size="middle" className="w-full">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
            <Input.Search
              placeholder="Search metro lines by name..."
              allowClear
              onSearch={handleSearch}
              className="max-w-sm"
              enterButton={<SearchOutlined />}
            />

            <Select
              placeholder="Filter by status"
              allowClear
              className="min-w-40"
              onChange={handleStatusFilter}
            >
              <Option value={LineStatus.OPERATIONAL}>
                <Tag color="green">Operational</Tag>
              </Option>
              <Option value={LineStatus.PLANNED}>
                <Tag color="blue">Planned</Tag>
              </Option>
              <Option value={LineStatus.UNDER_MAINTENANCE}>
                <Tag color="orange">Under Maintenance</Tag>
              </Option>
              <Option value={LineStatus.CLOSED}>
                <Tag color="red">Closed</Tag>
              </Option>
            </Select>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{total}</div>
              <div className="text-sm text-blue-600">Total Lines</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {
                  metroLines.filter((l) => l.status === LineStatus.OPERATIONAL)
                    .length
                }
              </div>
              <div className="text-sm text-green-600">Operational</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {metroLines.filter((l) => l.status === LineStatus.PLANNED).length}
              </div>
              <div className="text-sm text-blue-600">Planned</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {
                  metroLines.filter(
                    (l) => l.status === LineStatus.UNDER_MAINTENANCE
                  ).length
                }
              </div>
              <div className="text-sm text-orange-600">Maintenance</div>
            </div>
          </div>


          {/* Table */}
          <Table
            dataSource={metroLines}
            columns={columns}
            rowKey="id"
            loading={isLoading}
            pagination={false}
            onChange={handleTableChange}
            className="bg-white rounded-lg shadow-sm"
            size="middle"
            scroll={{ x: 1000 }}
          />

          {/* Pagination */}
          <div className="flex justify-center">
            <Pagination
              current={page + 1}
              pageSize={size}
              total={total}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} metro lines`
              }
              onChange={(current, pageSize) => {
                setPage(current - 1);
                setSize(pageSize || 10);
              }}
              className="mt-4"
            />
          </div>
        </Space>
      </Card>
    </div>
  );
};
