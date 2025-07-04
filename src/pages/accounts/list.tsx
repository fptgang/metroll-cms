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
  Avatar,
  Card,
  Input,
  Button,
  Pagination,
} from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { AccountDto, AccountRole } from "../../data";
import { useAccounts, useDeleteAccount } from "../../hooks";
import { formatDate } from "../../utils/formatDate";

export const AccountList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useAccounts(page, size);
  const deleteMutation = useDeleteAccount();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const accounts = data?.content || [];
  const total = data?.totalElements || 0;

  return (
    <Card title="Accounts" extra={<CreateButton />} style={{ margin: "16px" }}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Input.Search
          placeholder="Search accounts..."
          allowClear
          onSearch={setSearchQuery}
          style={{ width: 300 }}
          enterButton={<SearchOutlined />}
        />

        <Table
          dataSource={accounts}
          rowKey="id"
          loading={isLoading}
          pagination={false}
        >
          <Table.Column
            dataIndex="avatar"
            title="Avatar"
            render={() => <Avatar size="small" icon={<UserOutlined />} />}
            width="80px"
          />
          <Table.Column dataIndex="fullName" title="Full Name" />
          <Table.Column dataIndex="email" title="Email" />
          <Table.Column dataIndex="phoneNumber" title="Phone Number" />
          <Table.Column
            dataIndex="role"
            title="Role"
            render={(value: AccountRole) => (
              <Tag
                color={
                  value === AccountRole.ADMIN
                    ? "red"
                    : value === AccountRole.STAFF
                    ? "blue"
                    : "green"
                }
              >
                {value}
              </Tag>
            )}
          />
          <Table.Column
            dataIndex="active"
            title="Status"
            render={(value) => (
              <Tag color={value ? "green" : "red"}>
                {value ? "Active" : "Inactive"}
              </Tag>
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
            render={(_, record: AccountDto) => (
              <Space>
                <ShowButton hideText size="small" recordItemId={record.id} />
                <EditButton hideText size="small" recordItemId={record.id} />
                <DeleteButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  onSuccess={() => handleDelete(record.id)}
                />
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
            `${range[0]}-${range[1]} of ${total} accounts`
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
