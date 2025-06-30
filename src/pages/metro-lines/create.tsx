import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Form,
  Input,
  Card,
  Button,
  Select,
  InputNumber,
  Space,
  Divider,
  ColorPicker,
  Table,
  Modal,
  Tag,
  Alert,
} from "antd";
import {
  SaveOutlined,
  ArrowLeftOutlined,
  NodeIndexOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  MetroLineRequest,
  LineStatus,
  SegmentRequest,
} from "../../data/interfaces";
import { useCreateMetroLine, useOperationalStations } from "../../hooks";

const { Option } = Select;
const { TextArea } = Input;

export const MetroLineCreate: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [segments, setSegments] = useState<SegmentRequest[]>([]);
  const [segmentModalVisible, setSegmentModalVisible] = useState(false);
  const [editingSegment, setEditingSegment] = useState<SegmentRequest | null>(
    null
  );
  const [segmentForm] = Form.useForm();

  const createMetroLine = useCreateMetroLine();
  const { data: stations = [], isLoading: stationsLoading } =
    useOperationalStations();

  const handleSubmit = async (values: any) => {
    if (segments.length === 0) {
      Modal.error({
        title: "No Segments",
        content: "Please add at least one segment to the metro line.",
      });
      return;
    }

    try {
      const metroLineData: MetroLineRequest = {
        code: values.code,
        name: values.name,
        color: values.color,
        operatingHours: values.operatingHours,
        status: values.status || LineStatus.PLANNED,
        description: values.description,
        segments: segments,
      };

      await createMetroLine.mutateAsync(metroLineData);
      navigate("/metro-lines");
    } catch (error) {
      console.error("Error creating metro line:", error);
    }
  };

  const handleBack = () => {
    navigate("/metro-lines");
  };

  const handleAddSegment = () => {
    setEditingSegment(null);
    segmentForm.resetFields();

    // If there are existing segments, set the start station to the end station of the last segment
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      segmentForm.setFieldsValue({
        startStationCode: lastSegment.endStationCode,
      });
    }

    setSegmentModalVisible(true);
  };

  const handleEditSegment = (segment: SegmentRequest) => {
    setEditingSegment(segment);
    segmentForm.setFieldsValue(segment);
    setSegmentModalVisible(true);
  };

  const handleDeleteSegment = (index: number) => {
    const newSegments = segments.filter((_, i) => i !== index);
    // Reorder sequence numbers
    const reorderedSegments = newSegments.map((segment, i) => ({
      ...segment,
      sequence: i + 1,
    }));
    setSegments(reorderedSegments);
  };

  const handleSegmentModalOk = () => {
    segmentForm.validateFields().then((values) => {
      const newSegment: SegmentRequest = {
        sequence: editingSegment
          ? editingSegment.sequence
          : segments.length + 1,
        distance: values.distance,
        travelTime: values.travelTime,
        description: values.description,
        startStationCode: values.startStationCode,
        endStationCode: values.endStationCode,
      };

      if (editingSegment) {
        const index = segments.findIndex(
          (s) => s.sequence === editingSegment.sequence
        );
        const newSegments = [...segments];
        newSegments[index] = newSegment;
        setSegments(newSegments);
      } else {
        setSegments([...segments, newSegment]);
      }

      setSegmentModalVisible(false);
      segmentForm.resetFields();
    });
  };

  const segmentColumns = [
    {
      title: "Sequence",
      dataIndex: "sequence",
      key: "sequence",
      width: 80,
      render: (seq: number) => <Tag color="blue">{seq}</Tag>,
    },
    {
      title: "Route",
      key: "route",
      render: (_: any, record: SegmentRequest) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-green-600">
              {record.startStationCode}
            </span>
            <span>→</span>
            <span className="font-semibold text-red-600">
              {record.endStationCode}
            </span>
          </div>
          {record.description && (
            <div className="text-xs text-gray-500">{record.description}</div>
          )}
        </div>
      ),
    },
    {
      title: "Distance (km)",
      dataIndex: "distance",
      key: "distance",
      width: 120,
      render: (distance: number) => (
        <span className="font-mono">{distance}</span>
      ),
    },
    {
      title: "Travel Time (min)",
      dataIndex: "travelTime",
      key: "travelTime",
      width: 130,
      render: (time: number) => <span className="font-mono">{time}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_: any, record: SegmentRequest, index: number) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditSegment(record)}
          />
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteSegment(index)}
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
            <span className="text-xl font-semibold">Create New Metro Line</span>
          </div>
        }
        extra={
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="flex items-center"
          >
            Back to Metro Lines
          </Button>
        }
        className="shadow-sm"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="max-w-4xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Basic Information
              </h3>

              <Form.Item
                name="code"
                label="Line Code"
                rules={[
                  { required: true, message: "Line code is required" },
                  { max: 10, message: "Code must be 10 characters or less" },
                  {
                    pattern: /^[A-Z0-9]+$/,
                    message:
                      "Code must contain only uppercase letters and numbers",
                  },
                ]}
              >
                <Input
                  placeholder="e.g., RED, L001, BLUE"
                  className="font-mono"
                  style={{ textTransform: "uppercase" }}
                />
              </Form.Item>

              <Form.Item
                name="name"
                label="Line Name"
                rules={[
                  { required: true, message: "Line name is required" },
                  { max: 100, message: "Name must be 100 characters or less" },
                ]}
              >
                <Input placeholder="e.g., Red Line, Central Line" />
              </Form.Item>

              <Form.Item
                name="color"
                label="Line Color"
                rules={[{ required: true, message: "Line color is required" }]}
              >
                <Input
                  placeholder="e.g., BLUE, RED,..."
                  className="font-mono"
                />
              </Form.Item>
            </div>

            {/* Operational Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Operational Information
              </h3>

              <Form.Item
                name="operatingHours"
                label="Operating Hours"
                rules={[
                  { required: true, message: "Operating hours are required" },
                ]}
              >
                <Input placeholder="e.g., 05:00-24:00" className="font-mono" />
              </Form.Item>

              <Form.Item
                name="status"
                label="Status"
                initialValue={LineStatus.PLANNED}
              >
                <Select defaultValue={LineStatus.PLANNED} className="w-full">
                  <Option value={LineStatus.PLANNED}>🔵 Planned</Option>
                  <Option value={LineStatus.OPERATIONAL}>🟢 Operational</Option>
                  {/* <Option value={LineStatus.UNDER_MAINTENANCE}>
                    🟡 Under Maintenance
                  </Option>
                  <Option value={LineStatus.CLOSED}>🔴 Closed</Option> */}
                </Select>
              </Form.Item>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <Form.Item
              name="description"
              label="Description (Optional)"
              rules={[
                {
                  max: 1000,
                  message: "Description must be 1000 characters or less",
                },
              ]}
            >
              <TextArea
                rows={3}
                placeholder="Additional information about the metro line..."
              />
            </Form.Item>
          </div>

          <Divider />

          {/* Segments Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Line Segments
              </h3>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddSegment}
                disabled={stationsLoading}
              >
                Add Segment
              </Button>
            </div>

            {segments.length === 0 ? (
              <Alert
                message="No segments added yet"
                description="Add segments to define the route of this metro line. Each segment connects two stations."
                type="info"
                icon={<ExclamationCircleOutlined />}
                showIcon
              />
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {segments.length}
                    </div>
                    <div className="text-sm text-blue-600">Segments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {
                        new Set(
                          segments.flatMap((s) => [
                            s.startStationCode,
                            s.endStationCode,
                          ])
                        ).size
                      }
                    </div>
                    <div className="text-sm text-green-600">Stations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {segments
                        .reduce((sum, s) => sum + s.distance, 0)
                        .toFixed(1)}
                    </div>
                    <div className="text-sm text-purple-600">
                      Total Distance (km)
                    </div>
                  </div>
                </div>

                <Table
                  dataSource={segments}
                  columns={segmentColumns}
                  rowKey="sequence"
                  pagination={false}
                  size="small"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end">
            <Space>
              <Button onClick={handleBack}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMetroLine.isPending}
                icon={<SaveOutlined />}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Metro Line
              </Button>
            </Space>
          </div>
        </Form>
      </Card>

      {/* Segment Modal */}
      <Modal
        title={editingSegment ? "Edit Segment" : "Add Segment"}
        open={segmentModalVisible}
        onOk={handleSegmentModalOk}
        onCancel={() => setSegmentModalVisible(false)}
        width={600}
      >
        <Form form={segmentForm} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="startStationCode"
              label="Start Station"
              rules={[{ required: true, message: "Start station is required" }]}
              // help={
              //   !editingSegment && segments.length > 0
              //     ? "Start station is automatically set to continue from the previous segment"
              //     : undefined
              // }
            >
              <Select
                placeholder="Select start station"
                loading={stationsLoading}
                showSearch
                disabled={!editingSegment && segments.length > 0}
              >
                {stations.map((station) => (
                  <Option key={station.code} value={station.code}>
                    {station.code} - {station.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="endStationCode"
              label="End Station"
              // help="Only stations not already used in other segments are shown"
              rules={[
                { required: true, message: "End station is required" },
                ({ getFieldValue }) => ({
                  validator: (_, value) => {
                    const startStation = getFieldValue("startStationCode");
                    if (value && value === startStation) {
                      return Promise.reject(
                        new Error(
                          "End station must be different from start station"
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
              dependencies={["startStationCode"]}
            >
              <Select
                placeholder="Select end station"
                loading={stationsLoading}
                showSearch
              >
                {stations
                  .filter((station) => {
                    const startStation =
                      segmentForm.getFieldValue("startStationCode");

                    // Get used stations, excluding the current segment being edited
                    const usedStations = new Set(
                      segments
                        .filter(
                          (s) =>
                            !editingSegment ||
                            s.sequence !== editingSegment.sequence
                        )
                        .flatMap((s) => [s.startStationCode, s.endStationCode])
                    );

                    // Exclude start station and already used stations
                    return (
                      station.code !== startStation &&
                      !usedStations.has(station.code)
                    );
                  })
                  .map((station) => (
                    <Option key={station.code} value={station.code}>
                      {station.code} - {station.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="distance"
              label="Distance (km)"
              rules={[
                { required: true, message: "Distance is required" },
                {
                  type: "number",
                  min: 0.1,
                  message: "Distance must be at least 0.1 km",
                },
              ]}
            >
              <InputNumber
                placeholder="e.g., 2.5"
                precision={1}
                className="w-full"
                min={0.1}
                step={0.1}
              />
            </Form.Item>

            <Form.Item
              name="travelTime"
              label="Travel Time (minutes)"
              rules={[
                { required: true, message: "Travel time is required" },
                {
                  type: "number",
                  min: 1,
                  message: "Travel time must be at least 1 minute",
                },
              ]}
            >
              <InputNumber
                placeholder="e.g., 3"
                className="w-full"
                min={1}
                step={1}
              />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Description (Optional)">
            <TextArea
              rows={2}
              placeholder="Optional description for this segment..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
