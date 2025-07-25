import React, { useState } from "react";
import { ShowButton } from "@refinedev/antd";
import {
  Table,
  Space,
  Input,
  Select,
  Button,
  DatePicker,
  Card,
  Row,
  Col,
  Tag,
  Typography,
  Pagination,
} from "antd";
import type { SortOrder } from "antd/es/table/interface";
import {
  SearchOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  TicketValidationDto,
  ValidationType,
  TicketValidationFilter,
  SortDirection,
} from "../../data/interfaces";
import {
  useTicketValidations,
  useTicketValidationsByStation,
  useStations,
} from "../../hooks";
import { formatDate } from "../../utils/formatDate";

const { Text } = Typography;
const { RangePicker } = DatePicker;

export const TicketValidationList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [search, setSearch] = useState<string>("");
  const [stationCode, setStationCode] = useState<string>("");
  const [validationType, setValidationType] = useState<
    ValidationType | undefined
  >();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );
  const [sort, setSort] = useState<Record<string, SortDirection>>({
    validationTime: SortDirection.DESC
  });

  // Fetch stations for selector
  const { data: stationsData } = useStations(0, 100); // Get stations for dropdown
  const stations = stationsData?.content || [];

  // Build filters object for general search
  const generalFilters: TicketValidationFilter = {
    ...(search && { search }),
  };

  // Build filters object for station-specific search
  const stationFilters = {
    ...(search && { search }),
    ...(stationCode && { stationCode }),
    ...(validationType && { validationType }),
    ...(dateRange && {
      startDate: dateRange[0].toISOString(),
      endDate: dateRange[1].toISOString(),
    }),
  };

  // Conditional hook usage based on search and station selection
  const shouldUseStationSearch = Boolean(stationCode);

  const generalQuery = useTicketValidations(page, size, sort, generalFilters);

  const stationQuery = useTicketValidationsByStation(
    stationCode || "dummy", // Provide dummy value when not needed
    page,
    size,
    sort,
    stationFilters,
    shouldUseStationSearch
  );

  // Use the appropriate query result
  const { data, isLoading } = shouldUseStationSearch
    ? stationQuery
    : generalQuery;

  const handleSearch = () => {
    setPage(0); // Reset to first page when searching
  };

  const handleReset = () => {
    setSearch("");
    setStationCode("");
    setValidationType(undefined);
    setDateRange(null);
    setPage(0);
  };

  // Handle table changes including sorting
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const newSort: Record<string, SortDirection> = {};
    
    // Helper function to convert field to consistent string format
    const getFieldKey = (field: string | string[]) => {
      if (Array.isArray(field)) {
        return field.join('.');
      }
      return field;
    };
    
    // Handle multiple column sorting
    if (Array.isArray(sorter)) {
      sorter.forEach((s) => {
        if (s.field && s.order) {
          const fieldKey = getFieldKey(s.field);
          newSort[fieldKey] = s.order === 'ascend' ? SortDirection.ASC : SortDirection.DESC;
        }
      });
    } else if (sorter.field && sorter.order) {
      // Handle single column sorting
      const fieldKey = getFieldKey(sorter.field);
      newSort[fieldKey] = sorter.order === 'ascend' ? SortDirection.ASC : SortDirection.DESC;
    }
    
    setSort(Object.keys(newSort).length > 0 ? newSort : { validationTime: SortDirection.DESC });
  };

  // Convert sort state to antd sorter format for controlled sorting
  const getSorterProps = (field: string) => {
    const sortDirection = sort?.[field];
    return {
      sorter: true,
      sortOrder: sortDirection ? (sortDirection === SortDirection.ASC ? 'ascend' : 'descend') as SortOrder : undefined,
    };
  };

  const getValidationTypeIcon = (type: ValidationType) => {
    return type === ValidationType.ENTRY ? (
      <CheckCircleOutlined style={{ color: "#52c41a" }} />
    ) : (
      <LogoutOutlined style={{ color: "#1890ff" }} />
    );
  };

  const getValidationTypeColor = (type: ValidationType) => {
    return type === ValidationType.ENTRY ? "green" : "blue";
  };

  const validations = data?.content || [];
  const total = data?.totalElements || 0;

  return (
    <Card
      title={
        <Space>
          Ticket Validations
          {shouldUseStationSearch && (
            <Tag color="blue">Station Search: {stationCode}</Tag>
          )}
        </Space>
      }
      style={{ margin: "16px" }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Card size="small">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={5}>
              <Input
                placeholder="Search validations..."
                prefix={<SearchOutlined />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onPressEnter={handleSearch}
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Station (optional)"
                onChange={setStationCode}
                allowClear
                style={{ width: "100%" }}
                showSearch
                optionFilterProp="children"
              >
                {stations.map((station) => (
                  <Select.Option key={station.code} value={station.code}>
                    {station.code} - {station.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            {shouldUseStationSearch && (
              <>
                <Col xs={24} sm={12} md={3}>
                  <Select
                    placeholder="Type"
                    value={validationType}
                    onChange={setValidationType}
                    allowClear
                    style={{ width: "100%" }}
                  >
                    <Select.Option value={ValidationType.ENTRY}>
                      Entry
                    </Select.Option>
                    <Select.Option value={ValidationType.EXIT}>
                      Exit
                    </Select.Option>
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={5}>
                  <RangePicker
                    value={dateRange}
                    onChange={(dates) =>
                      setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])
                    }
                    style={{ width: "100%" }}
                    showTime
                    format="YYYY-MM-DD HH:mm"
                  />
                </Col>
              </>
            )}
            <Col xs={24} sm={12} md={3}>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                >
                  Search
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  Reset
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Table
          dataSource={validations}
          rowKey="id"
          loading={isLoading}
          pagination={false}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
          size="small"
        >
          <Table.Column
            dataIndex="ticketId"
            title="Ticket ID"
            render={(value: string) => (
              <Text
                copyable
                style={{ fontFamily: "monospace", fontSize: "12px" }}
              >
                {value.substring(0, 20)}...
              </Text>
            )}
            {...getSorterProps('ticketId')}
          />
          <Table.Column
            dataIndex="validationType"
            title="Type"
            width={100}
            render={(type: ValidationType) => (
              <Tag
                icon={getValidationTypeIcon(type)}
                color={getValidationTypeColor(type)}
              >
                {type}
              </Tag>
            )}
            {...getSorterProps('validationType')}
          />
          <Table.Column
            dataIndex="stationId"
            title="Station ID"
            render={(value: string) => (
              <Text style={{ fontFamily: "monospace", fontSize: "12px" }}>
                {value}
              </Text>
            )}
            {...getSorterProps('stationId')}
          />
          <Table.Column
            dataIndex={["validator", "fullName"]}
            title="Validator"
            render={(value: string) => (
              <Text style={{ fontFamily: "monospace", fontSize: "12px" }}>
                {value}
              </Text>
            )}
            {...getSorterProps('validator.fullName')}
          />
          <Table.Column
            dataIndex="validationTime"
            title="Validation Time"
            width={180}
            render={(value: string) => (
              <span style={{ fontSize: "12px" }}>{formatDate(value)}</span>
            )}
            {...getSorterProps('validationTime')}
          />
          <Table.Column
            dataIndex="createdAt"
            title="Created At"
            width={180}
            render={(value: string) => (
              <span style={{ fontSize: "12px" }}>{formatDate(value)}</span>
            )}
            {...getSorterProps('createdAt')}
          />
          <Table.Column
            title="Actions"
            dataIndex="actions"
            width={120}
            fixed="right"
            render={(_, record: TicketValidationDto) => (
              <Space>
                <ShowButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>

        <Pagination
          current={page + 1}
          pageSize={size}
          total={total}
          showSizeChanger
          showQuickJumper
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} validations`
          }
          onChange={(current, pageSize) => {
            setPage(current - 1);
            setSize(pageSize || 20);
          }}
        />
      </Space>
    </Card>
  );
};
