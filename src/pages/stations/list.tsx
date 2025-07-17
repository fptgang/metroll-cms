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
import type { SortOrder } from "antd/es/table/interface";
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
  SortDirection,
} from "../../data/interfaces";
import { useStations } from "../../hooks";
import { formatDate } from "../../utils/formatDate";
import { usePermissions } from "@refinedev/core";

const { Option } = Select;

export const StationList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [filters, setFilters] = useState<StationFilter>({});
  const [sort, setSort] = useState<Record<string, SortDirection>>({
    createdAt: SortDirection.DESC,
  });
  const perm = usePermissions();

  const { data, isLoading, error } = useStations(page, size, sort, filters);

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

  // Handle table changes including sorting
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const newSort: Record<string, SortDirection> = {};

    // Handle multiple column sorting
    if (Array.isArray(sorter)) {
      sorter.forEach((s) => {
        if (s.field && s.order) {
          newSort[s.field] =
            s.order === "ascend" ? SortDirection.ASC : SortDirection.DESC;
        }
      });
    } else if (sorter.field && sorter.order) {
      // Handle single column sorting
      newSort[sorter.field] =
        sorter.order === "ascend" ? SortDirection.ASC : SortDirection.DESC;
    }

    setSort(
      Object.keys(newSort).length > 0
        ? newSort
        : { createdAt: SortDirection.DESC }
    );
  };

  // Convert sort state to antd sorter format for controlled sorting
  const getSorterProps = (field: string) => {
    const sortDirection = sort?.[field];
    return {
      sorter: true,
      sortOrder: sortDirection
        ? ((sortDirection === SortDirection.ASC
            ? "ascend"
            : "descend") as SortOrder)
        : undefined,
    };
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
      ...getSorterProps("code"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <span className="font-medium">{name}</span>,
      ...getSorterProps("name"),
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
      ...getSorterProps("address"),
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
      ...getSorterProps("status"),
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
      ...getSorterProps("createdAt"),
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
          {perm.data == "ADMIN" && (
            <EditButton
              hideText
              size="small"
              recordItemId={record.code}
              className="text-green-600"
            />
          )}
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
        extra={perm.data == "ADMIN" && <CreateButton />}
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

          {/* Table */}
          <Table
            dataSource={stations}
            columns={columns}
            rowKey="id"
            loading={isLoading}
            pagination={false}
            onChange={handleTableChange}
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
