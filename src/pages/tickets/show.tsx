import React, { useEffect, useState } from "react";
import { Show } from "@refinedev/antd";
import { Typography, Card, Row, Col, Divider, Tag, Spin, Space } from "antd";
import { QrcodeOutlined, CalendarOutlined } from "@ant-design/icons";
import { useTicket } from "../../hooks";
import { useParams } from "react-router";
import { ticketService, TicketStatus, TicketType } from "../../data";
import { formatDate } from "../../utils/formatDate";

const { Title, Text } = Typography;

export const TicketShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: ticket, isLoading } = useTicket(id!);
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

  return (
    <Show>
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
                  new Date(ticket.validUntil) < new Date()
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
    </Show>
  );
};
