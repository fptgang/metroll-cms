import React from "react";
import { Show } from "@refinedev/antd";
import { Typography, Card, Row, Col, Divider, Tag, Spin } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import { useVoucher } from "../../hooks";
import { useParams } from "react-router";
import { VoucherStatus } from "../../data";
import { formatDate } from "../../utils/formatDate";

const { Title, Text } = Typography;

export const VoucherShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: voucher, isLoading } = useVoucher(id!);

  if (isLoading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
    );
  }

  if (!voucher) {
    return <div>Voucher not found</div>;
  }

  const getStatusColor = (status: VoucherStatus) => {
    switch (status) {
      case VoucherStatus.PRESERVED:
        return "blue";
      case VoucherStatus.VALID:
        return "green";
      case VoucherStatus.USED:
        return "purple";
      case VoucherStatus.EXPIRED:
        return "red";
      case VoucherStatus.REVOKED:
        return "volcano";
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
              {voucher.code}
            </Title>
            <Tag
              color={getStatusColor(voucher.status)}
              style={{ fontSize: "16px", padding: "8px 16px" }}
            >
              {voucher.status}
            </Tag>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>Owner ID</Title>
            <Text>{voucher.ownerId}</Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Voucher Code</Title>
            <Text style={{ fontFamily: "monospace", fontWeight: "bold" }}>
              {voucher.code}
            </Text>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>Discount Amount</Title>
            <Text style={{ fontSize: "18px", color: "#52c41a" }}>
              <DollarOutlined /> {voucher.discountAmount.toLocaleString()}
            </Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Minimum Transaction Amount</Title>
            <Text style={{ fontSize: "16px" }}>
              <DollarOutlined /> {voucher.minTransactionAmount.toLocaleString()}
            </Text>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>Valid From</Title>
            <Text>{formatDate(voucher.validFrom)}</Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Valid Until</Title>
            <Text>{formatDate(voucher.validUntil)}</Text>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>Created At</Title>
            <Text>{formatDate(voucher.createdAt)}</Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Updated At</Title>
            <Text>
              {voucher.updatedAt
                ? formatDate(voucher.updatedAt)
                : "Not updated"}
            </Text>
          </Col>
        </Row>
      </Card>
    </Show>
  );
};
