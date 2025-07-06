import React from "react";
import { Show } from "@refinedev/antd";
import {
  Typography,
  Card,
  Row,
  Col,
  Avatar,
  Divider,
  Tag,
  Spin,
  Button,
  Space,
} from "antd";
import { UserOutlined, GiftOutlined } from "@ant-design/icons";
import { useAccount, useAccountDiscountPackageByAccountId } from "../../hooks";
import { useParams, useNavigate } from "react-router";
import { AccountRole } from "../../data";
import { formatDate } from "../../utils/formatDate";

const { Title, Text } = Typography;

export const AccountShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: account, isLoading } = useAccount(id!);
  const { data: discountPackage, isLoading: loadingDiscount } =
    useAccountDiscountPackageByAccountId(id!);

  if (isLoading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
    );
  }

  if (!account) {
    return <div>Account not found</div>;
  }

  return (
    <Show>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={24} style={{ textAlign: "center", marginBottom: 16 }}>
            <Avatar size={64} icon={<UserOutlined />} />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>Full Name</Title>
            <Text>{account.fullName}</Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Email</Title>
            <Text>{account.email}</Text>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>Phone Number</Title>
            <Text>{account.phoneNumber}</Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Role</Title>
            <Tag
              color={
                account.role === AccountRole.ADMIN
                  ? "red"
                  : account.role === AccountRole.STAFF
                  ? "blue"
                  : "green"
              }
            >
              {account.role}
            </Tag>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>Status</Title>
            <Tag color={account.active ? "green" : "red"}>
              {account.active ? "Active" : "Inactive"}
            </Tag>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={5}>Created At</Title>
            <Text>{new Date(account.createdAt).toLocaleDateString()}</Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Updated At</Title>
            <Text>
              {account.updatedAt
                ? new Date(account.updatedAt).toLocaleDateString()
                : "Not updated"}
            </Text>
          </Col>
        </Row>

        <Divider />

        {/* Discount Package Section */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={4}>
              <GiftOutlined /> Discount Package
            </Title>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            {loadingDiscount ? (
              <Spin size="small" />
            ) : discountPackage ? (
              <Card size="small" style={{ backgroundColor: "#f6ffed" }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Title level={5}>Package ID</Title>
                    <Text>{discountPackage.discountPackageId}</Text>
                  </Col>
                  <Col span={12}>
                    <Title level={5}>Status</Title>
                    <Tag
                      color={
                        discountPackage.status === "ACTIVATED"
                          ? "green"
                          : discountPackage.status === "EXPIRED"
                          ? "orange"
                          : "red"
                      }
                    >
                      {discountPackage.status}
                    </Tag>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Title level={5}>Activated</Title>
                    <Text>{formatDate(discountPackage.activateDate)}</Text>
                  </Col>
                  <Col span={12}>
                    <Title level={5}>Valid Until</Title>
                    <Text>{formatDate(discountPackage.validUntil)}</Text>
                  </Col>
                </Row>
                <Divider style={{ margin: "12px 0" }} />
                <Space>
                  <Button
                    type="primary"
                    size="small"
                    icon={<GiftOutlined />}
                    onClick={() =>
                      navigate(
                        `/account-discount-packages/show/${discountPackage.id}`
                      )
                    }
                  >
                    View Details
                  </Button>
                  {discountPackage.status === "ACTIVATED" && (
                    <Button
                      size="small"
                      onClick={() =>
                        navigate(
                          `/account-discount-packages/edit/${discountPackage.id}`
                        )
                      }
                    >
                      Edit Assignment
                    </Button>
                  )}
                </Space>
              </Card>
            ) : (
              <Card size="small" style={{ backgroundColor: "#fff2e8" }}>
                <Text type="secondary">No discount package assigned</Text>
                <br />
                <Button
                  type="primary"
                  size="small"
                  icon={<GiftOutlined />}
                  onClick={() =>
                    navigate("/account-discount-packages/assign", {
                      state: { accountId: id },
                    })
                  }
                  style={{ marginTop: "8px" }}
                >
                  Assign Package
                </Button>
              </Card>
            )}
          </Col>
        </Row>
      </Card>
    </Show>
  );
};
