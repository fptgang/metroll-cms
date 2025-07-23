import React from "react";
import { Show } from "@refinedev/antd";
import { Typography, Card, Row, Col, Divider, Spin, Tag } from "antd";
import {
  DollarOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useP2PJourney } from "../../hooks";
import { useParams } from "react-router";
import { formatDate } from "../../utils/formatDate";
import { usePermissions } from "@refinedev/core";

const { Title, Text } = Typography;

export const P2PJourneyShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: journey, isLoading } = useP2PJourney(id!);

  const perm = usePermissions();

  if (isLoading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
    );
  }

  if (!journey) {
    return <div>P2P Journey not found</div>;
  }

  return (
    <Show canDelete={perm.data == "ADMIN"} canEdit={perm.data == "ADMIN"}>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={24} style={{ textAlign: "center", marginBottom: 16 }}>
            <Title
              level={2}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EnvironmentOutlined /> {journey.startStationId} →{" "}
              {journey.endStationId}
              <Tag
                color={journey.isActive ? "green" : "red"}
                style={{ marginLeft: 8 }}
              >
                {journey.isActive ? "Active" : "Inactive"}
              </Tag>
            </Title>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>Start Station ID</Title>
            <Text style={{ fontWeight: "bold", fontSize: "16px" }}>
              <EnvironmentOutlined /> {journey.startStationId}
            </Text>
          </Col>
          <Col span={12}>
            <Title level={5}>End Station ID</Title>
            <Text style={{ fontWeight: "bold", fontSize: "16px" }}>
              <EnvironmentOutlined /> {journey.endStationId}
            </Text>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Title level={5}>Base Price</Title>
            <Text
              style={{ fontSize: "20px", color: "#52c41a", fontWeight: "bold" }}
            >
              <DollarOutlined /> {journey.basePrice.toLocaleString()}
            </Text>
          </Col>
          <Col span={8}>
            <Title level={5}>Distance</Title>
            <Text style={{ fontSize: "16px", color: "#1890ff" }}>
              {journey.distance} km
            </Text>
          </Col>
          <Col span={8}>
            <Title level={5}>Travel Time</Title>
            <Text style={{ fontSize: "16px", color: "#722ed1" }}>
              <ClockCircleOutlined /> {journey.travelTime} min
            </Text>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>Created At</Title>
            <Text>
              <CalendarOutlined /> {formatDate(journey.createdAt)}
            </Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Updated At</Title>
            <Text>
              <CalendarOutlined />{" "}
              {journey.updatedAt
                ? formatDate(journey.updatedAt)
                : "Not updated"}
            </Text>
          </Col>
        </Row>
      </Card>
    </Show>
  );
};
