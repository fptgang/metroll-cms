import React from "react";
import { useNavigate, useParams } from "react-router";
import { Card, Button, Descriptions, Tag, Space, Spin, Alert } from "antd";
import {
  ArrowLeftOutlined,
  NodeIndexOutlined,
  EditOutlined,
  EyeOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { LineStatus } from "../../data/interfaces";
import { useMetroLine } from "../../hooks";
import { MetroLineMap } from "../../components/map";
import { usePermissions } from "@refinedev/core";

export const MetroLineShow: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const perm = usePermissions();
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
            {perm.data == "ADMIN" &&
            <Button
              icon={<EditOutlined />}
              onClick={handleEdit}
              type="primary"
              className="bg-green-600 hover:bg-green-700"
            >
              Edit Line
            </Button>}
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

          {/* Metro Line Map */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <EnvironmentOutlined className="text-green-600" />
                <span className="text-lg font-semibold">Metro Line Map</span>
              </div>
            }
            size="small"
          >
            <MetroLineMap metroLine={metroLine} className="rounded-lg" />
          </Card>

          {/* Segments Information */}
          <Card title="Segments" size="small">
            <div className="space-y-3">
              {metroLine.segments
                .sort((a, b) => a.sequence - b.sequence)
                .map((segment) => (
                  <div
                    key={segment.sequence}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                          Segment {segment.sequence}
                        </span>
                      </div>
                      <p className="text-gray-700">{segment.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>
                          📏 Distance: <strong>{segment.distance} km</strong>
                        </span>
                        <span>
                          ⏱️ Travel Time:{" "}
                          <strong>{segment.travelTime} min</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};
