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
} from "../../data/interfaces";
import { useMetroLines } from "../../hooks";
import { formatDate } from "../../utils/formatDate";

const { Option } = Select;

export const MetroLineList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [filters, setFilters] = useState<MetroLineFilter>({});

  const { data, isLoading, error } = useMetroLines(page, size, filters);

  const handleSearch = (value: string) => {
    setFilters({ ...filters, name: value });
    setPage(0); // Reset to first page when searching
  };

  const handleStatusFilter = (status: LineStatus | undefined) => {
    setFilters({ ...filters, status });
    setPage(0);
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
      title: "Line",
      key: "line",
      width: 150,
      render: (_: any, record: MetroLineDto) => (
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: record.color }}
          />
          <div>
            <div className="font-mono font-semibold text-sm">{record.code}</div>
            <div className="text-xs text-gray-500">{record.name}</div>
          </div>
        </div>
      ),
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
    },
    {
      title: "Operating Hours",
      dataIndex: "operatingHours",
      key: "operatingHours",
      width: 150,
      render: (hours: string) => (
        <span className="font-mono text-sm">{hours}</span>
      ),
    },
    {
      title: "Segments",
      dataIndex: "segments",
      key: "segments",
      width: 120,
      render: (segments: any[]) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">
            {segments.length}
          </div>
          <div className="text-xs text-gray-500">segments</div>
        </div>
      ),
    },
    {
      title: "Stations",
      key: "stations",
      width: 120,
      render: (_: any, record: MetroLineDto) => {
        const stationCount = new Set(
          record.segments.flatMap((s) => [s.startStationCode, s.endStationCode])
        ).size;
        return (
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {stationCount}
            </div>
            <div className="text-xs text-gray-500">stations</div>
          </div>
        );
      },
    },
    {
      title: "Total Distance",
      key: "distance",
      width: 120,
      render: (_: any, record: MetroLineDto) => {
        const totalDistance = record.segments.reduce(
          (sum, s) => sum + s.distance,
          0
        );
        return (
          <div className="text-center">
            <div className="text-lg font-semibold text-purple-600">
              {totalDistance.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">km</div>
          </div>
        );
      },
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
      render: (_: any, record: MetroLineDto) => (
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
            <NodeIndexOutlined className="text-blue-600" />
            <span className="text-xl font-semibold">Metro Lines</span>
          </div>
        }
        extra={<CreateButton icon={<PlusOutlined />} />}
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
              defaultValue={LineStatus.OPERATIONAL}
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
                {
                  metroLines.filter((l) => l.status === LineStatus.PLANNED)
                    .length
                }
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
              <div className="text-sm text-orange-600">Under Maintenance</div>
            </div>
          </div>

          {/* Network Overview */}
          {metroLines.length > 0 && (
            <Card title="Network Overview" size="small">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {metroLines.reduce(
                      (sum, line) => sum + line.segments.length,
                      0
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Total Segments</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {
                      new Set(
                        metroLines.flatMap((line) =>
                          line.segments.flatMap((s) => [
                            s.startStationCode,
                            s.endStationCode,
                          ])
                        )
                      ).size
                    }
                  </div>
                  <div className="text-sm text-gray-600">Unique Stations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {metroLines
                      .reduce(
                        (sum, line) =>
                          sum +
                          line.segments.reduce(
                            (lineSum, segment) => lineSum + segment.distance,
                            0
                          ),
                        0
                      )
                      .toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total Network Distance (km)
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Lines Preview */}
          {metroLines.length > 0 && (
            <Card title="Lines Preview" size="small">
              <div className="space-y-2">
                {metroLines.slice(0, 5).map((line) => (
                  <div
                    key={line.id}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: line.color }}
                    />
                    <span className="font-mono font-semibold min-w-16">
                      {line.code}
                    </span>
                    <span className="flex-1">{line.name}</span>
                    <Tag color={getStatusColor(line.status)}>{line.status}</Tag>
                  </div>
                ))}
                {metroLines.length > 5 && (
                  <div className="text-center text-sm text-gray-500 py-2">
                    ... and {metroLines.length - 5} more lines
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Table */}
          <Table
            dataSource={metroLines}
            columns={columns}
            rowKey="id"
            loading={isLoading}
            pagination={false}
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
