import React from "react";
import { useNavigate } from "react-router";
import {
  Form,
  Input,
  Card,
  Button,
  Select,
  InputNumber,
  Space,
  message,
} from "antd";
import {
  SaveOutlined,
  ArrowLeftOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { StationDto, StationStatus } from "../../data/interfaces";
import { useSaveStation } from "../../hooks";

const { Option } = Select;
const { TextArea } = Input;

export const StationCreate: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const saveStation = useSaveStation();

  const handleSubmit = async (values: any) => {
    try {
      const stationData: StationDto = {
        code: values.code,
        name: values.name,
        address: values.address,
        lat: values.lat,
        lng: values.lng,
        status: values.status || StationStatus.OPERATIONAL,
        description: values.description,
        lineStationInfos: [], // Will be populated when adding to lines
      };

      await saveStation.mutateAsync(stationData);
      navigate("/stations");
    } catch (error) {
      console.error("Error creating station:", error);
    }
  };

  const handleBack = () => {
    navigate("/stations");
  };

  return (
    <div className="p-6">
      <Card
        title={
          <div className="flex items-center gap-2">
            <EnvironmentOutlined className="text-blue-600" />
            <span className="text-xl font-semibold">Create New Station</span>
          </div>
        }
        extra={
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="flex items-center"
          >
            Back to Stations
          </Button>
        }
        className="shadow-sm"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="max-w-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Basic Information
              </h3>

              <Form.Item
                name="code"
                label="Station Code"
                rules={[
                  { required: true, message: "Station code is required" },
                  { max: 10, message: "Code must be 10 characters or less" },
                  {
                    pattern: /^[A-Z0-9_]+$/,
                    message:
                      "Code must contain only uppercase letters and numbers",
                  },
                ]}
              >
                <Input
                  placeholder="e.g., S001, CENTRAL"
                  className="font-mono"
                  style={{ textTransform: "uppercase" }}
                />
              </Form.Item>

              <Form.Item
                name="name"
                label="Station Name"
                rules={[
                  { required: true, message: "Station name is required" },
                  { max: 100, message: "Name must be 100 characters or less" },
                ]}
              >
                <Input placeholder="e.g., Central Station" />
              </Form.Item>

              <Form.Item
                name="status"
                label="Status"
                initialValue={StationStatus.OPERATIONAL}
              >
                <Select>
                  <Option value={StationStatus.OPERATIONAL}>
                    🟢 Operational
                  </Option>
                </Select>
              </Form.Item>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Location Information
              </h3>

              <Form.Item
                name="lat"
                label="Latitude"
                rules={[
                  { required: true, message: "Latitude is required" },
                  {
                    type: "number",
                    min: -90,
                    max: 90,
                    message: "Latitude must be between -90 and 90",
                  },
                ]}
              >
                <InputNumber
                  placeholder="e.g., 40.7128"
                  precision={6}
                  className="w-full"
                />
              </Form.Item>

              <Form.Item
                name="lng"
                label="Longitude"
                rules={[
                  { required: true, message: "Longitude is required" },
                  {
                    type: "number",
                    min: -180,
                    max: 180,
                    message: "Longitude must be between -180 and 180",
                  },
                ]}
              >
                <InputNumber
                  placeholder="e.g., -74.0060"
                  precision={6}
                  className="w-full"
                />
              </Form.Item>

              <div className="text-sm text-gray-500">
                💡 You can use Google Maps to find exact coordinates
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mt-6">
            <Form.Item
              name="address"
              label="Address"
              rules={[
                { required: true, message: "Address is required" },
                { max: 500, message: "Address must be 500 characters or less" },
              ]}
            >
              <TextArea
                rows={3}
                placeholder="Enter the complete address of the station..."
              />
            </Form.Item>
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
                rows={4}
                placeholder="Additional information about the station (facilities, landmarks, etc.)..."
              />
            </Form.Item>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end">
            <Space>
              <Button onClick={handleBack}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={saveStation.isPending}
                icon={<SaveOutlined />}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Station
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};
