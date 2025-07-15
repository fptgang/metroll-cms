import React, { useEffect } from "react";
import { Edit } from "@refinedev/antd";
import {
  Form,
  Input,
  Select,
  Switch,
  Card,
  Divider,
  Typography,
  Tag,
  Button,
  Space,
  Spin,
  Row,
  Col,
} from "antd";
import { AccountUpdateRequest, AccountRole } from "../../data";
import {
  useAccount,
  useUpdateAccount,
  useAccountDiscountPackageByAccountId,
} from "../../hooks";
import { useParams, useNavigate } from "react-router";
import { GiftOutlined } from "@ant-design/icons";
import { formatDate } from "../../utils/formatDate";
import {usePermissions} from "@refinedev/core";

const { Title, Text } = Typography;

export const AccountEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const { data: account, isLoading } = useAccount(id!);
  const { data: discountPackage, isLoading: loadingDiscount } =
    useAccountDiscountPackageByAccountId(id!);
  const updateMutation = useUpdateAccount();
  const navigate = useNavigate();
  const perm = usePermissions();

  useEffect(() => {
    if (account) {
      form.setFieldsValue(account);
    }
  }, [account, form]);

  const onFinish = async (values: AccountUpdateRequest) => {
    updateMutation.mutate(
      { id: id!, data: values },
      {
        onSuccess: () => {
          navigate("/accounts");
        },
      }
    );
  };

  return (
    <Edit
      isLoading={isLoading}
      saveButtonProps={{
        loading: updateMutation.isPending,
        onClick: () => form.submit(),
      }}
      canDelete={perm.data === "ADMIN"}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Card
          title={
            "Account Information - " + (account ? account.email : "Loading...")
          }
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Please enter the full name",
              },
            ]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              {
                required: false,
                message: "Please enter the phone number",
              },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[
              {
                required: true,
                message: "Please select a role",
              },
            ]}
          >
            <Select placeholder="Select role">
              {
                perm.data === "ADMIN" && <>
                    <Select.Option value={AccountRole.ADMIN}>Admin</Select.Option>
                    <Select.Option value={AccountRole.STAFF}>Staff</Select.Option>
                  </>
              }
              <Select.Option value={AccountRole.CUSTOMER}>
                Customer
              </Select.Option>
            </Select>
          </Form.Item>
        </Card>

        <Divider />

        {/* Discount Package Section */}
        <Card
          title={
            <>
              <GiftOutlined /> Discount Package
            </>
          }
        >
          {loadingDiscount ? (
            <Spin size="small" />
          ) : discountPackage ? (
            <div>
              <div style={{ marginBottom: "16px" }}>
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
              </div>
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
            </div>
          ) : (
            <div>
              <Text type="secondary">No discount package assigned</Text>
              <br />
              <Button
                type="primary"
                size="small"
                icon={<GiftOutlined />}
                onClick={() =>
                  navigate("/account-discount-packages/assign", {
                    state: {
                      accountId: id,
                    },
                  })
                }
                style={{ marginTop: "8px" }}
              >
                Assign Package
              </Button>
            </div>
          )}
        </Card>
      </Form>
    </Edit>
  );
};
