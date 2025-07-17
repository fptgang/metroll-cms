import React from "react";
import { Show } from "@refinedev/antd";
import { Typography, Card, Row, Col, Divider, Spin } from "antd";
import {
  DollarOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useTimedTicketPlan } from "../../hooks";
import { useParams } from "react-router";
import { formatDate } from "../../utils/formatDate";
import { usePermissions } from "@refinedev/core";

const { Title, Text } = Typography;

export const TimedTicketPlanShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: plan, isLoading } = useTimedTicketPlan(id!);

  const perm = usePermissions();
  
  if (isLoading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
    );
  }

  if (!plan) {
    return <div>Timed Ticket Plan not found</div>;
  }

  const formatDuration = (validDuration: number) => {
    if (validDuration === 1) return "1 day";
    if (validDuration < 30) return `${validDuration} days`;
    if (validDuration === 30) return "1 month";
    if (validDuration < 365) return `${Math.round(validDuration / 30)} months`;
    return `${Math.round(validDuration / 365)} year${
      validDuration >= 730 ? "s" : ""
    }`;
  };

  return (
    <Show canDelete={perm.data == "ADMIN"} canEdit={perm.data == "ADMIN"}>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={24} style={{ textAlign: "center", marginBottom: 16 }}>
            <Title level={2}>{plan.name}</Title>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>Plan Name</Title>
            <Text style={{ fontWeight: "bold", fontSize: "16px" }}>
              {plan.name}
            </Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Valid Duration</Title>
            <Text style={{ fontSize: "16px", color: "#1890ff" }}>
              <ClockCircleOutlined /> {formatDuration(plan.validDuration)}
            </Text>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={5}>Base Price</Title>
            <Text
              style={{ fontSize: "24px", color: "#52c41a", fontWeight: "bold" }}
            >
              <DollarOutlined /> {plan.basePrice.toLocaleString()}
            </Text>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>Created At</Title>
            <Text>
              <CalendarOutlined /> {formatDate(plan.createdAt)}
            </Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Updated At</Title>
            <Text>
              <CalendarOutlined />{" "}
              {plan.updatedAt ? formatDate(plan.updatedAt) : "Not updated"}
            </Text>
          </Col>
        </Row>
      </Card>
    </Show>
  );
};
