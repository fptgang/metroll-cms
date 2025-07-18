import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Form,
  Input,
  Card,
  Button,
  Select,
  InputNumber,
  Space,
  Divider,
  Table,
  Modal,
  Tag,
  Alert,
  Spin,
  ColorPicker,
} from "antd";
import {
  SaveOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  MetroLineRequest,
  LineStatus,
  SegmentRequest,
} from "../../data/interfaces";
import {
  useMetroLine,
  useUpdateMetroLine,
  useOperationalStations,
} from "../../hooks";

const { Option } = Select;
const { TextArea } = Input;

export const MetroLineEdit: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [segments, setSegments] = useState<SegmentRequest[]>([]);
  const [segmentModalVisible, setSegmentModalVisible] = useState(false);

  const [segmentForm] = Form.useForm();
  const [selectedColor, setSelectedColor] = useState<string>('#1890ff');

  const { data: metroLine, isLoading, error } = useMetroLine(id || "");
  const updateMetroLine = useUpdateMetroLine();
  const { data: stations = [], isLoading: stationsLoading } =
    useOperationalStations();

  // Initialize form with metro line data
  useEffect(() => {
    if (metroLine) {
      form.setFieldsValue({
        code: metroLine.code,
        name: metroLine.name,
        color: metroLine.color,
        operatingHours: metroLine.operatingHours,
        status: metroLine.status,
        description: metroLine.description,
      });
      setSelectedColor(metroLine.color || '#1890ff');
      if (metroLine.segments) {
        const segmentsReq: SegmentRequest[] = metroLine.segments.map(
          (segment) => ({
            distance: segment.distance,
            travelTime: segment.travelTime,
            description: segment.description || "",
            startStationCode: segment.startStationCode,
            endStationCode: segment.endStationCode,
            sequence: segment.sequence,
          })
        );
        setSegments(segmentsReq);
      }
    }
  }, [metroLine, form]);

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
        description: values.description || "",
        segments: segments,
      };

      await updateMetroLine.mutateAsync({
        code: metroLine?.id || id!,
        data: metroLineData,
      });
      navigate("/metro-lines");
    } catch (error) {
      console.error("Error updating metro line:", error);
    }
  };

  const handleBack = () => {
    navigate("/metro-lines");
  };

  const handleAddSegment = () => {
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

  const handleDeleteSegment = (index: number) => {
    const segmentToDelete = segments[index];
    const newSegments = segments.filter((_, i) => i !== index);
    
    // If there are segments after the deleted one, update the next segment's start station
    if (index < segments.length - 1) {
      const nextSegmentIndex = 0; // After filtering, the next segment will be at the current index
      const prevSegment = index > 0 ? segments[index - 1] : null;
      
      if (prevSegment && newSegments[index]) {
        // Update the next segment's start station to connect with the previous segment
        newSegments[index] = {
          ...newSegments[index],
          startStationCode: prevSegment.endStationCode,
        };
      }
    }
    
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
        sequence: segments.length + 1,
        distance: values.distance,
        travelTime: values.travelTime,
        description: values.description,
        startStationCode: values.startStationCode,
        endStationCode: values.endStationCode,
      };

      setSegments([...segments, newSegment]);
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
      width: 80,
      render: (_: any, record: SegmentRequest, index: number) => (
        <Button
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteSegment(index)}
          title="Delete segment"
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !metroLine) {
    return (
      <div className="p-6">
        <Alert
          message="Error"
          description="Failed to load metro line data"
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
            <EditOutlined className="text-green-600" />
            <span className="text-xl font-semibold">
              Edit Metro Line: {metroLine.name}
            </span>
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
              >
                <Input
                  placeholder="e.g., RED, L001, BLUE"
                  className="font-mono"
                  style={{ textTransform: "uppercase" }}
                  disabled
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
                <ColorPicker
                  showText
                  format="hex"
                  value={selectedColor}
                  onChange={(color) => {
                    const hexColor = color?.toHexString() || '#1890ff';
                    setSelectedColor(hexColor);
                    form.setFieldValue('color', hexColor);
                  }}
                  presets={[
                    {
                      label: 'Common Colors',
                      colors: [
                        '#1890ff', // Blue
                        '#52c41a', // Green
                        '#faad14', // Yellow
                        '#f5222d', // Red
                        '#722ed1', // Purple
                        '#13c2c2', // Cyan
                        '#fa8c16', // Orange
                        '#eb2f96', // Magenta
                        '#000000', // Black
                        '#666666', // Gray
                      ],
                    },
                  ]}
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

              <Form.Item name="status" label="Status">
                <Select className="w-full">
                  <Option value={LineStatus.PLANNED}>🔵 Planned</Option>
                  <Option value={LineStatus.OPERATIONAL}>🟢 Operational</Option>
                  <Option value={LineStatus.UNDER_MAINTENANCE}>
                    {" "}
                    🔧 Under Maintenance
                  </Option>
                  <Option value={LineStatus.CLOSED}>🔴 Closed</Option>
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
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Line Segments
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Segments form a continuous path. To modify a segment, delete it and all following segments, then recreate them.
                </p>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddSegment}
                disabled={!!stationsLoading}
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
                loading={updateMetroLine.isPending}
                icon={<SaveOutlined />}
                className="bg-green-600 hover:bg-green-700"
              >
                Update Metro Line
              </Button>
            </Space>
          </div>
        </Form>
      </Card>

      {/* Segment Modal */}
      <Modal
        title="Add Segment"
        open={segmentModalVisible}
        onOk={handleSegmentModalOk}
        onCancel={() => setSegmentModalVisible(false)}
        width={600}
      >
        {segments.length > 0 && (
          <Alert
            message="Continuous Path"
            description="This segment will continue from the previous segment's end station. Each segment must connect seamlessly to form a complete metro line."
            type="info"
            showIcon
            className="mb-4"
          />
        )}
        <Form form={segmentForm} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="startStationCode"
              label="Start Station"
              rules={[{ required: true, message: "Start station is required" }]}
              help={
                segments.length > 0
                  ? "Start station is automatically set to continue from the previous segment"
                  : "Select the starting station for this segment"
              }
            >
              <Select
                placeholder="Select start station"
                loading={stationsLoading}
                showSearch
                disabled={segments.length > 0}
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
              help="Select a station that hasn't been used in other segments"
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

                    // Exclude start station
                    if (station.code === startStation) {
                      return false;
                    }

                    // Exclude already used stations
                    const usedStations = new Set(
                      segments.flatMap((s) => [s.startStationCode, s.endStationCode])
                    );
                    
                    return !usedStations.has(station.code);
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
