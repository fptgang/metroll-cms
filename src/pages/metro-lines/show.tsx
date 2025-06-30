import React from "react";
import { useNavigate, useParams } from "react-router";
import { Card, Button, Descriptions, Tag, Space, Spin, Alert } from "antd";
import {
  ArrowLeftOutlined,
  NodeIndexOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { LineStatus } from "../../data/interfaces";
import { useMetroLine } from "../../hooks";

export const MetroLineShow: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: metroLine, isLoading, error } = useMetroLine(id || "");

  const handleBack = () => {
    navigate("/metro-lines");
  };

  const handleEdit = () => {
    navigate(`/metro-lines/edit/${id}`);
  };

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
            <EyeOutlined className="text-blue-600" />
            <span className="text-xl font-semibold">Metro Line Details</span>
          </div>
        }
        extra={
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={handleEdit}
              type="primary"
              className="bg-green-600 hover:bg-green-700"
            >
              Edit Line
            </Button>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              Back to Metro Lines
            </Button>
          </Space>
        }
        className="shadow-sm"
      >
        <div className="space-y-6">
          {/* Line Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-8 h-8 rounded-full border-4 border-white shadow-lg"
                  style={{ backgroundColor: metroLine.color }}
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {metroLine.name}
                  </h2>
                  <p className="text-lg text-gray-600 font-mono">
                    {metroLine.code}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <Card title="Line Information" size="small">
            <Descriptions column={2} size="middle">
              <Descriptions.Item label="Line Code">
                <span className="font-mono font-semibold">
                  {metroLine.code}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Line Name">
                <span className="font-medium">{metroLine.name}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Operating Hours">
                <span className="font-mono">{metroLine.operatingHours}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Segments">
                {metroLine.segments.length}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <div className="text-center py-12">
            <NodeIndexOutlined className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Metro Line Details
            </h3>
            <p className="text-gray-500">
              Detailed metro line view will be implemented here.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
