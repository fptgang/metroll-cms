import React, { useState } from "react";
import { ShowButton, DeleteButton, CreateButton } from "@refinedev/antd";
import {
  Table,
  Space,
  Tag,
  Card,
  Input,
  Button,
  Pagination,
  Select,
  Tooltip,
} from "antd";
import { SearchOutlined, UserOutlined, GiftOutlined } from "@ant-design/icons";
import { AccountDiscountPackageDto } from "../../data/interfaces";
import {
  useAccountDiscountPackages,
  useUnassignDiscountPackage,
} from "../../hooks";
import { formatDate } from "../../utils/formatDate";

const { Option } = Select;

export const AccountDiscountPackageList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [accountIdFilter, setAccountIdFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ACTIVATED" | "EXPIRED" | "CANCELLED" | ""
  >("");

  const filters = {
    accountId: accountIdFilter || undefined,
    status: statusFilter || undefined,
  };

  const { data, isLoading, error } = useAccountDiscountPackages(
    page,
    size,
    filters
  );
  const unassignMutation = useUnassignDiscountPackage();

  const handleUnassign = (id: string) => {
    unassignMutation.mutate(id);
  };

  const accountDiscountPackages = data?.content || [];
  const total = data?.totalElements || 0;

  return (
    <Card
      title="Account Discount Packages"
      extra={<CreateButton />}
      style={{ margin: "16px" }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Space>
          <Input
            placeholder="Filter by Account ID..."
            allowClear
            value={accountIdFilter}
            onChange={(e) => setAccountIdFilter(e.target.value)}
            style={{ width: 250 }}
            prefix={<UserOutlined />}
          />
          <Select
            placeholder="Filter by status"
            allowClear
            style={{ width: 150 }}
            onChange={setStatusFilter}
          >
            <Option value="ACTIVATED">Activated</Option>
            <Option value="EXPIRED">Expired</Option>
            <Option value="CANCELLED">Cancelled</Option>
          </Select>
        </Space>

        <Table
          dataSource={accountDiscountPackages}
          rowKey="id"
          loading={isLoading}
          pagination={false}
        >
          <Table.Column
            dataIndex="icon"
            title=""
            render={() => <GiftOutlined style={{ fontSize: "16px" }} />}
            width="50px"
          />
          <Table.Column
            dataIndex="accountId"
            title="Account ID"
            render={(value: string) => <Tag color="blue">{value}</Tag>}
          />
          <Table.Column
            dataIndex="discountPackageId"
            title="Package ID"
            render={(value: string) => <Tag color="green">{value}</Tag>}
          />
          <Table.Column
            dataIndex="activateDate"
            title="Activated"
            render={(value) => formatDate(value)}
          />
          <Table.Column
            dataIndex="validUntil"
            title="Valid Until"
            render={(value) => formatDate(value)}
          />
          <Table.Column
            dataIndex="status"
            title="Status"
            render={(value: string) => {
              let color = "default";
              if (value === "ACTIVATED") color = "green";
              else if (value === "EXPIRED") color = "orange";
              else if (value === "CANCELLED") color = "red";

              return <Tag color={color}>{value}</Tag>;
            }}
          />
          <Table.Column
            dataIndex="createdAt"
            title="Created At"
            render={(value) => formatDate(value)}
          />
          <Table.Column
            title="Actions"
            dataIndex="actions"
            render={(_, record: AccountDiscountPackageDto) => (
              <Space>
                <ShowButton hideText size="small" recordItemId={record.id} />
                {record.status === "ACTIVATED" && (
                  <Tooltip title="Unassign Package">
                    <Button
                      type="text"
                      size="small"
                      danger
                      onClick={() => handleUnassign(record.id)}
                      loading={unassignMutation.isPending}
                    >
                      <DeleteButton hideText size="small" />
                    </Button>
                  </Tooltip>
                )}
              </Space>
            )}
          />
        </Table>

        <Pagination
          current={page + 1}
          pageSize={size}
          total={total}
          showSizeChanger
          showQuickJumper
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} account discount packages`
          }
          onChange={(current, pageSize) => {
            setPage(current - 1);
            setSize(pageSize || 10);
          }}
        />
      </Space>
    </Card>
  );
};
