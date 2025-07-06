import React from "react";
import { useNavigate, useParams } from "react-router";
import { Card, Descriptions, Tag, Button, Spin } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { useAccountDiscountPackage } from "../../hooks";
import { formatDate } from "../../utils/formatDate";

export const AccountDiscountPackageShow: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: accountDiscountPackage, isLoading } = useAccountDiscountPackage(
    id!
  );

  if (isLoading) {
    return (
      <Card style={{ margin: "16px" }}>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!accountDiscountPackage) {
    return (
      <Card style={{ margin: "16px" }}>
        <div style={{ textAlign: "center", padding: "50px" }}>
          Account discount package not found
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Account Discount Package Details"
      extra={
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/account-discount-packages")}
        >
          Back to List
        </Button>
      }
      style={{ margin: "16px" }}
    >
      <Descriptions
        bordered
        column={1}
        size="middle"
        labelStyle={{ fontWeight: "bold" }}
      >
        <Descriptions.Item label="Account ID">
          <Tag color="blue">{accountDiscountPackage.accountId}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Discount Package ID">
          <Tag color="green">{accountDiscountPackage.discountPackageId}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Activation Date">
          {formatDate(accountDiscountPackage.activateDate)}
        </Descriptions.Item>

        <Descriptions.Item label="Valid Until">
          {formatDate(accountDiscountPackage.validUntil)}
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          <Tag
            color={
              accountDiscountPackage.status === "ACTIVATED"
                ? "green"
                : accountDiscountPackage.status === "EXPIRED"
                ? "orange"
                : "red"
            }
          >
            {accountDiscountPackage.status}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Created At">
          {formatDate(accountDiscountPackage.createdAt)}
        </Descriptions.Item>

        <Descriptions.Item label="Last Updated">
          {formatDate(accountDiscountPackage.updatedAt || "")}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => {
            if (id) {
              navigate(`/account-discount-packages/edit/${id}`);
            }
          }}
          disabled={accountDiscountPackage.status !== "ACTIVATED"}
        >
          Edit Assignment
        </Button>
      </div>
    </Card>
  );
};
