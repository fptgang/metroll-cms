import React from "react";
import { Show } from "@refinedev/antd";
import {
  Typography,
  Card,
  Row,
  Col,
  Divider,
  Tag,
  Spin,
  Button,
  Space,
} from "antd";
import {
  CheckCircleOutlined,
  LogoutOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  QrcodeOutlined,
  UserOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useTicketValidation } from "../../hooks";
import { useParams, useNavigate } from "react-router";
import { ValidationType } from "../../data";
import { formatDate } from "../../utils/formatDate";

const { Title, Text } = Typography;

export const TicketValidationShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: validation, isLoading } = useTicketValidation(id!);

  if (isLoading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
    );
  }

  if (!validation) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <div>Ticket validation not found</div>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/ticket-validations")}
          style={{ marginTop: "16px" }}
        >
          Back to Validations
        </Button>
      </div>
    );
  }

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

  return (
    <Show
      headerButtons={({ defaultButtons }) => (
        <Space>
          {defaultButtons}
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/ticket-validations")}
          >
            Back to List
          </Button>
        </Space>
      )}
    >
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={24} style={{ textAlign: "center", marginBottom: 16 }}>
            <Title level={2}>Ticket Validation Details</Title>
            <Tag
              icon={getValidationTypeIcon(validation.validationType)}
              color={getValidationTypeColor(validation.validationType)}
              style={{ fontSize: "16px", padding: "8px 16px" }}
            >
              {validation.validationType}
            </Tag>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>
              <QrcodeOutlined /> Ticket ID
            </Title>
            <Text
              copyable
              style={{ fontFamily: "monospace", fontWeight: "bold" }}
            >
              {validation.ticketId}
            </Text>
          </Col>
          <Col span={12}>
            <Title level={5}>
              <EnvironmentOutlined /> Station ID
            </Title>
            <Text style={{ fontFamily: "monospace", fontWeight: "bold" }}>
              {validation.stationId}
            </Text>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>
              <UserOutlined /> Validator
            </Title>
            <Text style={{ fontFamily: "monospace" }}>
              {validation.validator.fullName} (#{validation.validatorId})
            </Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Validation ID</Title>
            <Text
              copyable
              style={{ fontFamily: "monospace", fontSize: "12px" }}
            >
              {validation.id}
            </Text>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>
              <ClockCircleOutlined /> Validation Time
            </Title>
            <Text>
              {formatDate(validation.validationTime)}
            </Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Validation Type</Title>
            <Tag
              icon={getValidationTypeIcon(validation.validationType)}
              color={getValidationTypeColor(validation.validationType)}
              style={{ fontSize: "14px", padding: "4px 12px" }}
            >
              {validation.validationType}
            </Tag>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>Created At</Title>
            <Text>{formatDate(validation.createdAt)}</Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Updated At</Title>
            <Text>
              {validation.updatedAt
                ? formatDate(validation.updatedAt)
                : "Not updated"}
            </Text>
          </Col>
        </Row>

        {/* Additional Information Section */}
        <Divider />
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={4}>Additional Information</Title>
          </Col>
          <Col span={24}>
            <Card size="small" style={{ backgroundColor: "#fafafa" }}>
              <Row gutter={[16, 8]}>
                <Col span={8}>
                  <Text strong>Record Type:</Text>
                </Col>
                <Col span={16}>
                  <Text>Ticket Validation</Text>
                </Col>
                <Col span={8}>
                  <Text strong>System Status:</Text>
                </Col>
                <Col span={16}>
                  <Tag color="green">Active</Tag>
                </Col>
                <Col span={8}>
                  <Text strong>Validation Action:</Text>
                </Col>
                <Col span={16}>
                  <Text>
                    {validation.validationType === ValidationType.ENTRY
                      ? "Passenger entered the station"
                      : "Passenger exited the station"}
                  </Text>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>
    </Show>
  );
};
