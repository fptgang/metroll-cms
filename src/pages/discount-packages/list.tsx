import React, { useState } from "react";
import {
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton,
} from "@refinedev/antd";
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
import { SearchOutlined, GiftOutlined } from "@ant-design/icons";
import { DiscountPackageDto } from "../../data/interfaces";
import { useDiscountPackages, useTerminateDiscountPackage } from "../../hooks";
import { formatDate } from "../../utils/formatDate";
import {usePermissions} from "@refinedev/core";

const { Option } = Select;

export const DiscountPackageList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ACTIVE" | "TERMINATED" | ""
  >("");
  const perm = usePermissions();

  const filters = {
    search: searchQuery || undefined,
    status: statusFilter || undefined,
  };

  const { data, isLoading, error } = useDiscountPackages(page, size, filters);
  const terminateMutation = useTerminateDiscountPackage();

  const handleTerminate = (id: string) => {
    terminateMutation.mutate(id);
  };

  const discountPackages = data?.content || [];
  const total = data?.totalElements || 0;

  // Format discount percentage for display (convert 0.15 to 15%)
  const formatDiscountPercentage = (percentage: number) => {
    return `${(percentage * 100).toFixed(0)}%`;
  };

  return (
    <Card
      title="Discount Packages"
      extra={<CreateButton />}
      style={{ margin: "16px" }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Space>
          <Input.Search
            placeholder="Search packages..."
            allowClear
            onSearch={setSearchQuery}
            style={{ width: 300 }}
            enterButton={<SearchOutlined />}
          />
          <Select
            placeholder="Filter by status"
            allowClear
            style={{ width: 150 }}
            onChange={setStatusFilter}
          >
            <Option value="ACTIVE">Active</Option>
            <Option value="TERMINATED">Terminated</Option>
          </Select>
        </Space>

        <Table
          dataSource={discountPackages}
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
          <Table.Column dataIndex="name" title="Name" />
          <Table.Column dataIndex="description" title="Description" />
          <Table.Column
            dataIndex="discountPercentage"
            title="Discount"
            render={(value: number) => (
              <Tag color="green">{formatDiscountPercentage(value)}</Tag>
            )}
          />
          <Table.Column
            dataIndex="duration"
            title="Duration"
            render={(value: number) => `${value} days`}
          />
          <Table.Column
            dataIndex="status"
            title="Status"
            render={(value: string) => (
              <Tag color={value === "ACTIVE" ? "green" : "red"}>{value}</Tag>
            )}
          />
          <Table.Column
            dataIndex="createdAt"
            title="Created At"
            render={(value) => formatDate(value)}
          />
          <Table.Column
            title="Actions"
            dataIndex="actions"
            render={(_, record: DiscountPackageDto) => (
              <Space>
                <ShowButton hideText size="small" recordItemId={record.id} />
                {(perm.data === 'ADMIN' && record.status === "ACTIVE") && (
                    <>
                      <EditButton hideText size="small" recordItemId={record.id} />
                      <Tooltip title="Terminate Package">
                        <Button
                            type="text"
                            size="small"
                            danger
                            onClick={() => handleTerminate(record.id)}
                            loading={terminateMutation.isPending}
                        >
                          <DeleteButton hideText size="small" />
                        </Button>
                      </Tooltip>
                    </>
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
            `${range[0]}-${range[1]} of ${total} discount packages`
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
