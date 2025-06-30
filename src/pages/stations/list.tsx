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
} from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  BuildOutlined,
  StopOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  StationDto,
  StationStatus,
  StationFilter,
} from "../../data/interfaces";
import { useStations } from "../../hooks";
import { formatDate } from "../../utils/formatDate";

const { Option } = Select;

export const StationList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [filters, setFilters] = useState<StationFilter>({});

  const { data, isLoading, error } = useStations(page, size, filters);

  const handleSearch = (value: string) => {
    setFilters({ ...filters, name: value });
    setPage(0); // Reset to first page when searching
  };

  const handleStatusFilter = (status: StationStatus | undefined) => {
    setFilters({ ...filters, status });
    setPage(0);
  };

  const handleLineFilter = (lineCode: string | undefined) => {
    setFilters({ ...filters, lineCode });
    setPage(0);
  };

  const stations = data?.content || [];
  const total = data?.totalElements || 0;

  const getStatusColor = (status: StationStatus) => {
    switch (status) {
      case StationStatus.OPERATIONAL:
        return "green";
      case StationStatus.UNDER_MAINTENANCE:
        return "orange";
      case StationStatus.CLOSED:
        return "red";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: StationStatus) => {
    switch (status) {
      case StationStatus.OPERATIONAL:
        return <EnvironmentOutlined />;
      case StationStatus.UNDER_MAINTENANCE:
        return <BuildOutlined />;
      case StationStatus.CLOSED:
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
        <span className="font-mono font-semibold">{code}</span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <span className="font-medium">{name}</span>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      render: (address: string) => (
        <Tooltip title={address}>
          <span className="text-gray-600">{address}</span>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: StationStatus) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status.replace("_", " ")}
        </Tag>
      ),
    },
    {
      title: "Metro Lines",
      dataIndex: "lineStationInfos",
      key: "lines",
      width: 150,
      render: (lineInfos: any[]) => (
        <Space size={[0, 4]} wrap>
          {lineInfos.map((info, index) => (
            <Tag key={index} color="blue" className="text-xs">
              {info.lineCode}
            </Tag>
          ))}
          {lineInfos.length === 0 && (
            <span className="text-gray-400 text-xs">No lines</span>
          )}
        </Space>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => (
        <span className="text-xs text-gray-500">{formatDate(date)}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: StationDto) => (
        <Space size="small">
          <ShowButton
            hideText
            size="small"
            recordItemId={record.code}
            className="text-blue-600"
          />
          <EditButton
            hideText
            size="small"
            recordItemId={record.code}
            className="text-green-600"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title={
          <div className="flex items-center gap-2">
            <EnvironmentOutlined className="text-blue-600" />
            <span className="text-xl font-semibold">Metro Stations</span>
          </div>
        }
        extra={<CreateButton />}
        className="shadow-sm"
      >
        <Space direction="vertical" size="middle" className="w-full">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
            <Input.Search
              placeholder="Search stations by name..."
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
              <Option value={StationStatus.OPERATIONAL}>
                <Tag color="green">Operational</Tag>
              </Option>
              <Option value={StationStatus.UNDER_MAINTENANCE}>
                <Tag color="orange">Under Maintenance</Tag>
              </Option>
              <Option value={StationStatus.CLOSED}>
                <Tag color="red">Closed</Tag>
              </Option>
            </Select>

            <Input
              placeholder="Filter by line code..."
              allowClear
              className="max-w-40"
              onChange={(e) => handleLineFilter(e.target.value || undefined)}
            />
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{total}</div>
              <div className="text-sm text-blue-600">Total Stations</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {
                  stations.filter((s) => s.status === StationStatus.OPERATIONAL)
                    .length
                }
              </div>
              <div className="text-sm text-green-600">Operational</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {
                  stations.filter(
                    (s) => s.status === StationStatus.UNDER_MAINTENANCE
                  ).length
                }
              </div>
              <div className="text-sm text-orange-600">Maintenance</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {
                  stations.filter((s) => s.status === StationStatus.CLOSED)
                    .length
                }
              </div>
              <div className="text-sm text-red-600">Closed</div>
            </div>
          </div>

          {/* Table */}
          <Table
            dataSource={stations}
            columns={columns}
            rowKey="id"
            loading={isLoading}
            pagination={false}
            className="bg-white rounded-lg shadow-sm"
            size="middle"
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
                `${range[0]}-${range[1]} of ${total} stations`
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
