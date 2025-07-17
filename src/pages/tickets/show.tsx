import React, { useEffect, useState } from "react";
import { Show } from "@refinedev/antd";
import { Typography, Card, Row, Col, Divider, Tag, Spin, Space, Timeline, Empty } from "antd";
import { 
  QrcodeOutlined, 
  CalendarOutlined,
  CheckCircleOutlined,
  LogoutOutlined,
  EnvironmentOutlined,
  UserOutlined,
  ClockCircleOutlined 
} from "@ant-design/icons";
import { useTicket, useTicketValidationsByTicket } from "../../hooks";
import { useParams } from "react-router";
import { ticketService, TicketStatus, TicketType, ValidationType } from "../../data";
import { formatDate } from "../../utils/formatDate";

const { Title, Text } = Typography;

export const TicketShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: ticket, isLoading } = useTicket(id!);
  const { data: validations, isLoading: validationsLoading } = useTicketValidationsByTicket(id!);
  const [qr, setQr] = useState<string>("");

  if (isLoading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
    );
  }

  if (!ticket) {
    return <div>Ticket not found</div>;
  }

  const generateQrCode = async () => {
    try {
      const qrCode = await ticketService.getTicketQRCode(ticket.id);
      setQr(qrCode);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.VALID:
        return "green";
      case TicketStatus.USED:
        return "blue";
      case TicketStatus.EXPIRED:
        return "red";
      case TicketStatus.CANCELLED:
        return "orange";
      default:
        return "default";
    }
  };

  const getTypeColor = (type: TicketType) => {
    switch (type) {
      case TicketType.P2P:
        return "blue";
      case TicketType.TIMED:
        return "purple";
      default:
        return "default";
    }
  };

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
    <Show canDelete={false} canEdit={false}>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={24} style={{ textAlign: "center", marginBottom: 16 }}>
            <Title level={2} style={{ fontFamily: "monospace" }}>
              <Space>
                <QrcodeOutlined
                  onClick={async () => {
                    const qrCode = await ticketService.getTicketQRCode(
                      ticket.id
                    );
                    const newWindow = window.open();
                    newWindow?.document.write(
                      `<img src="data:image/png;base64,${qrCode}" />`
                    );
                  }}
                  style={{ cursor: "pointer" }}
                />
                {ticket.ticketNumber}
              </Space>
            </Title>
            <div style={{ marginTop: 8 }}>
              <Tag
                color={getTypeColor(ticket.ticketType)}
                style={{
                  fontSize: "14px",
                  padding: "6px 12px",
                  marginRight: 8,
                }}
              >
                {ticket.ticketType.replace("_", " ")}
              </Tag>
              <Tag
                color={getStatusColor(ticket.status)}
                style={{ fontSize: "14px", padding: "6px 12px" }}
              >
                {ticket.status}
              </Tag>
            </div>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>Ticket Number</Title>
            <Text style={{ fontFamily: "monospace", fontWeight: "bold" }}>
              {ticket.ticketNumber}
            </Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Order Detail ID</Title>
            <Text>{ticket.ticketOrderDetailId}</Text>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>Purchase Date</Title>
            <Text>
              <CalendarOutlined /> {formatDate(ticket.purchaseDate)}
            </Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Valid Until</Title>
            <Text
              style={{
                color:
                  new Date(parseInt(ticket.validUntil) * 1000) < new Date()
                    ? "#ff4d4f"
                    : "#52c41a",
              }}
            >
              <CalendarOutlined /> {formatDate(ticket.validUntil)}
            </Text>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>Created At</Title>
            <Text>{formatDate(ticket.createdAt)}</Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Updated At</Title>
            <Text>
              {ticket.updatedAt ? formatDate(ticket.updatedAt) : "Not updated"}
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Ticket Validations Timeline */}
      <Card 
        style={{ marginTop: 16 }}
        title={
          <Space>
            <ClockCircleOutlined />
            <span>Validation History</span>
          </Space>
        }
      >
        {validationsLoading ? (
          <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
        ) : validations && validations.length > 0 ? (
          <Timeline
            mode="left"
            items={validations
              .sort((a, b) => new Date(b.validationTime).getTime() - new Date(a.validationTime).getTime())
              .map((validation) => ({
                dot: getValidationTypeIcon(validation.validationType),
                children: (
                  <Card 
                    size="small" 
                    style={{ 
                      marginBottom: 8,
                      border: `1px solid ${validation.validationType === ValidationType.ENTRY ? '#52c41a' : '#1890ff'}20`
                    }}
                  >
                    <Row gutter={[16, 8]}>
                      <Col span={24}>
                        <Space>
                          <Tag
                            color={getValidationTypeColor(validation.validationType)}
                            icon={getValidationTypeIcon(validation.validationType)}
                          >
                            {validation.validationType}
                          </Tag>
                          <Text strong style={{ fontSize: "16px" }}>
                            {formatDate(validation.validationTime)}
                          </Text>
                        </Space>
                      </Col>
                      <Col span={12}>
                        <Space>
                          <EnvironmentOutlined style={{ color: "#8c8c8c" }} />
                          <Text type="secondary">Station ID:</Text>
                          <Text code>{validation.stationId}</Text>
                        </Space>
                      </Col>
                      <Col span={12}>
                        <Space>
                          <UserOutlined style={{ color: "#8c8c8c" }} />
                          <Text type="secondary">Validator:</Text>
                          <Text>{validation.validator.fullName}</Text>
                        </Space>
                      </Col>
                      <Col span={24}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Validation ID: {validation.id}
                        </Text>
                      </Col>
                    </Row>
                  </Card>
                ),
                color: getValidationTypeColor(validation.validationType),
              }))
            }
          />
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No validations found for this ticket"
          />
        )}
      </Card>
    </Show>
  );
};
