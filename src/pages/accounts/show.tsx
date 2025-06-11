import React from "react";
import { Show } from "@refinedev/antd";
import { Typography, Card, Row, Col, Avatar, Divider, Tag, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAccount } from "../../hooks";
import { useParams } from "react-router";
import { AccountRole } from "../../data";

const { Title, Text } = Typography;

export const AccountShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: account, isLoading } = useAccount(id!);

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
      </Card>
    </Show>
  );
};
