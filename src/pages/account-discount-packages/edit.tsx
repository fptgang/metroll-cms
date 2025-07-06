import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Card, Form, Button, Space, Spin, Alert } from "antd";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import {
  useAccountDiscountPackage,
  useUnassignDiscountPackage,
} from "../../hooks";

export const AccountDiscountPackageEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: accountDiscountPackage, isLoading } = useAccountDiscountPackage(
    id!
  );
  const unassignMutation = useUnassignDiscountPackage();

  const handleUnassign = async () => {
    if (!id) return;

    try {
      await unassignMutation.mutateAsync(id);
      navigate("/account-discount-packages");
    } catch (error) {
      // Error is handled by the mutation
    }
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

  if (!accountDiscountPackage) {
    return (
      <Card style={{ margin: "16px" }}>
        <div style={{ textAlign: "center", padding: "50px" }}>
          Account discount package not found
        </div>
      </Card>
    );
  }

  if (accountDiscountPackage.status !== "ACTIVATED") {
    return (
      <Card
        title="Edit Account Discount Package"
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
        <Alert
          message="Cannot Edit"
          description="This discount package assignment cannot be edited because it is not in an active state."
          type="warning"
          showIcon
          style={{ marginBottom: "16px" }}
        />
        <div style={{ textAlign: "center" }}>
          <Button onClick={() => navigate("/account-discount-packages")}>
            Back to List
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Edit Account Discount Package"
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
      <Alert
        message="Limited Editing"
        description="Account discount package assignments can only be unassigned. To change the package, please unassign the current one and assign a new package."
        type="info"
        showIcon
        style={{ marginBottom: "24px" }}
      />

      <div style={{ marginBottom: "24px" }}>
        <h4>Current Assignment Details:</h4>
        <p>
          <strong>Account ID:</strong> {accountDiscountPackage.accountId}
        </p>
        <p>
          <strong>Package ID:</strong>{" "}
          {accountDiscountPackage.discountPackageId}
        </p>
        <p>
          <strong>Status:</strong> {accountDiscountPackage.status}
        </p>
        <p>
          <strong>Valid Until:</strong>{" "}
          {new Date(accountDiscountPackage.validUntil).toLocaleDateString()}
        </p>
      </div>

      <Form.Item>
        <Space>
          <Button
            type="primary"
            danger
            icon={<SaveOutlined />}
            loading={unassignMutation.isPending}
            onClick={handleUnassign}
          >
            Unassign Package
          </Button>
          <Button onClick={() => navigate("/account-discount-packages")}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Card>
  );
};
