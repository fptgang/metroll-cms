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
import type { SortOrder } from "antd/es/table/interface";
import { SearchOutlined, UserOutlined, GiftOutlined } from "@ant-design/icons";
import {AccountDiscountPackageDto, SortDirection} from "../../data/interfaces";
import {
  useAccountDiscountPackages,
  useUnassignDiscountPackage,
} from "../../hooks";
import { formatDate } from "../../utils/formatDate";

const { Option } = Select;

export const AccountDiscountPackageList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState<Record<string, SortDirection>>();
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
    sort,
    filters
  );
  const unassignMutation = useUnassignDiscountPackage();

  const handleUnassign = (id: string) => {
    unassignMutation.mutate(id);
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
    
    setSort(Object.keys(newSort).length > 0 ? newSort : undefined);
  };

  // Convert sort state to antd sorter format for controlled sorting
  const getSorterProps = (field: string) => {
    const sortDirection = sort?.[field];
    return {
      sorter: true,
      sortOrder: sortDirection ? (sortDirection === SortDirection.ASC ? 'ascend' : 'descend') as SortOrder : undefined,
    };
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
          onChange={handleTableChange}
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
            {...getSorterProps('accountId')}
          />
          <Table.Column
            dataIndex="discountPackageId"
            title="Package ID"
            render={(value: string) => <Tag color="green">{value}</Tag>}
            {...getSorterProps('discountPackageId')}
          />
          <Table.Column
            dataIndex="activateDate"
            title="Activated"
            render={(value) => formatDate(value)}
            {...getSorterProps('activateDate')}
          />
          <Table.Column
            dataIndex="validUntil"
            title="Valid Until"
            render={(value) => formatDate(value)}
            {...getSorterProps('validUntil')}
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
            {...getSorterProps('status')}
          />
          <Table.Column
            dataIndex="createdAt"
            title="Created At"
            render={(value) => formatDate(value)}
            {...getSorterProps('createdAt')}
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
