import React, {useEffect, useState} from "react";
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
  Tooltip,
  Popconfirm,
} from "antd";
import type { SortOrder } from "antd/es/table/interface";
import {
  UserOutlined,
  SearchOutlined,
  GiftOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {AccountDto, AccountRole, SortDirection} from "../../data";
import {
  useAccounts,
  useActivateAccount,
  useDeleteAccount,
  // useAccountDiscountPackageByAccountId,
} from "../../hooks";
import { formatDate } from "../../utils/formatDate";
import {usePermissions} from "@refinedev/core";

export const AccountList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const perm = usePermissions();
  const [sort, setSort] = useState<Record<string, SortDirection>>({
    createdAt: SortDirection.DESC
  });

  const { data, isLoading, error } = useAccounts(page, size, sort, {
    search: searchQuery
  });
  const deleteMutation = useDeleteAccount();
  const activateMutation = useActivateAccount();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleActivate = (id: string) => {
    activateMutation.mutate(id);
  };

  // Handle table changes including sorting
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const newSort: Record<string, SortDirection> = {};
    
    // Handle multiple column sorting
    if (Array.isArray(sorter)) {
      sorter.forEach((s) => {
        if (s.field && s.order) {
          newSort[s.field] = s.order === 'ascend' ? SortDirection.ASC : SortDirection.DESC;
        }
      });
    } else if (sorter.field && sorter.order) {
      // Handle single column sorting
      newSort[sorter.field] = sorter.order === 'ascend' ? SortDirection.ASC : SortDirection.DESC;
    }
    
    setSort(Object.keys(newSort).length > 0 ? newSort : { createdAt: SortDirection.DESC });
  };

  // Convert sort state to antd sorter format for controlled sorting
  const getSorterProps = (field: string) => {
    const sortDirection = sort?.[field];
    return {
      sorter: true,
      sortOrder: sortDirection ? (sortDirection === SortDirection.ASC ? 'ascend' : 'descend') as SortOrder : undefined,
    };
  };

  const accounts = data?.content || [];
  const total = data?.totalElements || 0;

  return (
    <Card title="Accounts" extra={perm.data === "ADMIN" && <CreateButton />} style={{ margin: "16px" }}>
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
          onChange={handleTableChange}
        >
          <Table.Column 
            dataIndex="id" 
            title="ID" 
            {...getSorterProps('id')}
          />
          <Table.Column 
            dataIndex="fullName" 
            title="Full Name" 
            {...getSorterProps('fullName')}
          />
          <Table.Column 
            dataIndex="email" 
            title="Email" 
            {...getSorterProps('email')}
          />
          <Table.Column 
            dataIndex="phoneNumber" 
            title="Phone Number" 
            {...getSorterProps('phoneNumber')}
          />
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
            {...getSorterProps('role')}
          />
          <Table.Column
            dataIndex="active"
            title="Status"
            render={(value) => (
              <Tag color={value ? "green" : "red"}>
                {value ? "Active" : "Inactive"}
              </Tag>
            )}
            {...getSorterProps('active')}
          />
          <Table.Column
            dataIndex="createdAt"
            title="Created At"
            render={(value) => formatDate(value)}
            {...getSorterProps('createdAt')}
          />
          {/* <Table.Column
            dataIndex="discountPackage"
            title="Discount Package"
            render={(_, record: AccountDto) => {
              const { data: discountPackage } =
                useAccountDiscountPackageByAccountId(record.id);
              if (discountPackage) {
                return (
                  <Tooltip
                    title={`${discountPackage.discountPackageId} - ${discountPackage.status}`}
                  >
                    <Tag color="green" icon={<GiftOutlined />}>
                      Active
                    </Tag>
                  </Tooltip>
                );
              }
              return (
                <Tag color="default" icon={<GiftOutlined />}>
                  None
                </Tag>
              );
            }}
          /> */}
          <Table.Column
            title="Actions"
            dataIndex="actions"
            render={(_, record: AccountDto) => (
              <Space>
                <ShowButton hideText size="small" recordItemId={record.id} />
                {record.active && <EditButton hideText size="small" recordItemId={record.id} />}
                {
                  (perm.data === "ADMIN" && record.active) && 
                    <Popconfirm
                      title="Delete account"
                      description="Are you sure?"
                      onConfirm={() => handleDelete(record.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Tooltip title="Delete Account">
                        <Button
                          type="text"
                          size="small"
                          danger
                          loading={deleteMutation.isPending}
                          icon={<DeleteOutlined />}
                        />
                      </Tooltip>
                    </Popconfirm>
                }
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
