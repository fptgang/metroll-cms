import React, { useState } from "react";
import {
  Table,
  Space,
  Tag,
  Card,
  Button,
  Modal,
  Form,
  Select,
  Typography,
  Avatar,
  Tooltip,
  Alert,
  Pagination,
  Input,
} from "antd";
import {
  UserOutlined,
  EnvironmentOutlined,
  EditOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  AccountDto,
  StationAssignmentRequest,
  AccountFilter,
} from "../../data/interfaces";
import {
  useStaff,
  useAssignStationToStaff,
  useOperationalStations,
} from "../../hooks";
import { formatDate } from "../../utils/formatDate";

const { Option } = Select;
const { Title, Text } = Typography;
const { Search } = Input;

export const StaffList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [filters, setFilters] = useState<AccountFilter>({});
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<AccountDto | null>(null);
  const [assignForm] = Form.useForm();

  const { data: staffData, isLoading, error } = useStaff(page, size, filters);
  const { data: stations, isLoading: stationsLoading } =
    useOperationalStations();
  const assignStation = useAssignStationToStaff();

  const staff = staffData?.content || [];
  const total = staffData?.totalElements || 0;

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value });
    setPage(0); // Reset to first page when searching
  };

  const handleAssignStation = (staffMember: AccountDto) => {
    setSelectedStaff(staffMember);
    assignForm.setFieldsValue({
      stationCode: staffMember.assignedStation || undefined,
    });
    setAssignModalVisible(true);
  };

  const handleAssignModalOk = () => {
    assignForm.validateFields().then((values) => {
      if (selectedStaff) {
        const request: StationAssignmentRequest = {
          stationCode: values.stationCode,
        };

        assignStation.mutate(
          { staffId: selectedStaff.id, request },
          {
            onSuccess: () => {
              setAssignModalVisible(false);
              assignForm.resetFields();
              setSelectedStaff(null);
            },
          }
        );
      }
    });
  };

  const handleAssignModalCancel = () => {
    setAssignModalVisible(false);
    assignForm.resetFields();
    setSelectedStaff(null);
  };

  const getStatusColor = (isActive: boolean, statusText: string) => {
    if (statusText.toLowerCase() === "pending") return "orange";
    return isActive ? "green" : "red";
  };

  const getStatusIcon = (isActive: boolean, statusText: string) => {
    if (statusText.toLowerCase() === "pending")
      return <ExclamationCircleOutlined />;
    return isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />;
  };

  const columns = [
    {
      title: "Staff",
      key: "staff",
      width: 250,
      render: (_: any, record: AccountDto) => (
        <div className="flex items-center gap-3">
          <Avatar size={40} icon={<UserOutlined />} className="bg-blue-500" />
          <div>
            <div className="font-semibold text-gray-900">{record.fullName}</div>
            <div className="text-xs text-gray-400">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role: string) => (
        <Tag color="blue" className="font-medium">
          {role?.toUpperCase() || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Assigned Station",
      key: "assignedStation",
      width: 200,
      render: (_: any, record: AccountDto) => (
        <div>
          {record.assignedStation ? (
            <div className="flex items-center gap-2">
              <EnvironmentOutlined className="text-green-500" />
              <div>
                <div className="font-medium text-green-700">
                  {record.assignedStation}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <EnvironmentOutlined />
              <span className="text-sm">No station assigned</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 120,
      render: (phone: string) => (
        <span className="font-mono text-sm">{phone || "N/A"}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: AccountDto) => (
        <Space size="small">
          <Tooltip title="Manage Station Assignment">
            <Button
              type="primary"
              size="small"
              icon={<EnvironmentOutlined />}
              onClick={() => handleAssignStation(record)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Assign
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <div className="p-6">
        <Alert
          message="Error"
          description="Failed to load staff data"
          type="error"
          showIcon
        />
      </div>
    );
  }

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
        </div>

        {/* Staff Table */}
        <Table
          dataSource={staff}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={false}
          className="bg-white rounded-lg"
          size="middle"
          scroll={{ x: 1200 }}
        />

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          <Pagination
            current={page + 1}
            total={total}
            pageSize={size}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} staff members`
            }
            onChange={(newPage, newSize) => {
              setPage(newPage - 1);
              if (newSize !== size) {
                setSize(newSize);
              }
            }}
            onShowSizeChange={(current, newSize) => {
              setSize(newSize);
              setPage(0);
            }}
          />
        </div>
      </Card>

      {/* Station Assignment Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <EnvironmentOutlined className="text-blue-600" />
            <span>Assign Station</span>
          </div>
        }
        open={assignModalVisible}
        onOk={handleAssignModalOk}
        onCancel={handleAssignModalCancel}
        confirmLoading={assignStation.isPending}
        width={500}
      >
        {selectedStaff && (
          <div className="mb-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Avatar
                size={48}
                icon={<UserOutlined />}
                className="bg-blue-500"
              />
              <div>
                <div className="font-semibold text-lg">
                  {selectedStaff.fullName}
                </div>
                <div className="text-xs text-gray-400">
                  {selectedStaff.email}
                </div>
              </div>
            </div>
          </div>
        )}

        <Form form={assignForm} layout="vertical">
          <Form.Item
            name="stationCode"
            label="Assign to Station"
            rules={[{ required: true, message: "Please select a station" }]}
          >
            <Select
              placeholder="Select a station"
              loading={stationsLoading}
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) =>
                Boolean(
                  option?.label
                    ?.toString()
                    .toLowerCase()
                    .includes(input.toLowerCase()) ||
                    option?.value
                      ?.toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                )
              }
            >
              {stations?.map((station) => (
                <Option key={station.code} value={station.code}>
                  <div className="flex items-center justify-between">
                    <span>
                      <strong>{station.code}</strong> - {station.name}
                    </span>
                    <Tag color="blue">{station.status}</Tag>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="bg-blue-50 p-3 rounded text-sm text-blue-700">
            <ExclamationCircleOutlined className="mr-2" />
            Assigning this staff member to a station will update their current
            assignment. Only operational stations are shown.
          </div>
        </Form>
      </Modal>
    </div>
  );
};
