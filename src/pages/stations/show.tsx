import React from "react";
import { useNavigate, useParams } from "react-router";
import {
  Card,
  Button,
  Descriptions,
  Tag,
  Space,
  Spin,
  Alert,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  EditOutlined,
  EyeOutlined,
  BuildOutlined,
  StopOutlined,
  ExclamationCircleOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { StationStatus } from "../../data/interfaces";
import { useStation } from "../../hooks";
import { formatDate } from "../../utils/formatDate";

export const StationShow: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: station, isLoading, error } = useStation(id || "");

  const handleBack = () => {
    navigate("/stations");
  };

  const handleEdit = () => {
    navigate(`/stations/edit/${id}`);
  };

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

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !station) {
    return (
      <div className="p-6">
        <Alert
          message="Error"
          description="Failed to load station data"
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
            <span className="text-xl font-semibold">Station Details</span>
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
              Edit Station
            </Button>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              Back to Stations
            </Button>
          </Space>
        }
        className="shadow-sm"
      >
        <div className="space-y-6">
          {/* Station Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {station.name}
                </h2>
                <p className="text-lg text-gray-600 font-mono">
                  {station.code}
                </p>
              </div>
              <div className="text-right">
                <Tag
                  color={getStatusColor(station.status)}
                  icon={getStatusIcon(station.status)}
                  className="text-sm px-3 py-1"
                >
                  {station.status.replace("_", " ")}
                </Tag>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <Card title="Basic Information" size="small">
            <Descriptions column={2} size="middle">
              <Descriptions.Item label="Station Code">
                <span className="font-mono font-semibold">{station.code}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Station Name">
                <span className="font-medium">{station.name}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={getStatusColor(station.status)}
                  icon={getStatusIcon(station.status)}
                >
                  {station.status.replace("_", " ")}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {formatDate(station?.createdAt || "")}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {formatDate(station?.updatedAt || "")}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Location Information */}
          <Card title="Location Information" size="small">
            <Descriptions column={1} size="middle">
              <Descriptions.Item label="Address">
                <div className="flex items-start gap-2">
                  <EnvironmentOutlined className="text-red-500 mt-1" />
                  <span>{station.address}</span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Coordinates">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <GlobalOutlined className="text-blue-500" />
                    <strong>Lat:</strong> {station.lat}
                  </span>
                  <span className="flex items-center gap-1">
                    <GlobalOutlined className="text-blue-500" />
                    <strong>Lng:</strong> {station.lng}
                  </span>
                  <Button
                    type="link"
                    size="small"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps?q=${station.lat},${station.lng}`,
                        "_blank"
                      )
                    }
                    className="p-0"
                  >
                    View on Map
                  </Button>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Metro Lines */}
          <Card title="Connected Metro Lines" size="small">
            {station.lineStationInfos.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 mb-3">
                  This station is connected to {station.lineStationInfos.length}{" "}
                  metro line(s):
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {station.lineStationInfos.map((info, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-blue-800">
                          {info.lineCode}
                        </span>
                        <Tag color="blue" className="text-xs">
                          Position {info.sequence}
                        </Tag>
                      </div>
                      <div className="text-sm text-blue-600">
                        Station Code:{" "}
                        <span className="font-mono">{info.code}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <EnvironmentOutlined className="text-4xl mb-2 opacity-50" />
                <p>This station is not connected to any metro lines yet.</p>
                <p className="text-sm">
                  Add this station to metro lines to enable passenger journeys.
                </p>
              </div>
            )}
          </Card>

          {/* Description */}
          {station.description && (
            <Card title="Description" size="small">
              <div className="text-gray-700 whitespace-pre-wrap">
                {station.description}
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card title="Quick Actions" size="small">
            <Space wrap>
              <Button
                icon={<EditOutlined />}
                onClick={handleEdit}
                type="primary"
                className="bg-green-600 hover:bg-green-700"
              >
                Edit Station
              </Button>
              <Button
                icon={<GlobalOutlined />}
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps?q=${station.lat},${station.lng}`,
                    "_blank"
                  )
                }
              >
                View on Google Maps
              </Button>
              <Button
                icon={<EnvironmentOutlined />}
                onClick={() =>
                  navigator.clipboard.writeText(`${station.lat},${station.lng}`)
                }
              >
                Copy Coordinates
              </Button>
            </Space>
          </Card>
        </div>
      </Card>
    </div>
  );
};
