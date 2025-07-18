import React from "react";
import { useNavigate, useParams } from "react-router";
import { Card, Descriptions, Tag, Button, Spin } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { useDiscountPackage } from "../../hooks";
import { formatDate } from "../../utils/formatDate";

export const DiscountPackageShow: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: discountPackage, isLoading } = useDiscountPackage(id!);

  // Format discount percentage for display (convert 0.15 to 15%)
  const formatDiscountPercentage = (percentage: number) => {
    return `${(percentage * 100).toFixed(0)}%`;
  };

  if (isLoading) {
    return (
      <Card style={{ margin: "16px" }}>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!discountPackage) {
    return (
      <Card style={{ margin: "16px" }}>
        <div style={{ textAlign: "center", padding: "50px" }}>
          Discount package not found
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Discount Package Details"
      extra={
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/discount-packages")}
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
        <Descriptions.Item label="Package Name">
          {discountPackage.name}
        </Descriptions.Item>

        <Descriptions.Item label="Description">
          {discountPackage.description}
        </Descriptions.Item>

        <Descriptions.Item label="Discount Percentage">
          <Tag color="green" style={{ fontSize: "14px" }}>
            {formatDiscountPercentage(discountPackage.discountPercentage)}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Duration">
          {discountPackage.duration} days
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          <Tag color={discountPackage.status === "ACTIVE" ? "green" : "red"}>
            {discountPackage.status}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Created At">
          {formatDate(discountPackage.createdAt)}
        </Descriptions.Item>

        <Descriptions.Item label="Last Updated">
          {formatDate(discountPackage.updatedAt || "")}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
