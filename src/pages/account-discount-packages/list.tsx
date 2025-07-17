import React, { useState, useMemo } from "react";
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
  Popconfirm,
} from "antd";
import type { SortOrder } from "antd/es/table/interface";
import { SearchOutlined, UserOutlined, GiftOutlined, DeleteOutlined } from "@ant-design/icons";
import {AccountDiscountPackageDto, SortDirection, DiscountPackageDto} from "../../data/interfaces";
import {
  useAccountDiscountPackages,
  useUnassignDiscountPackage,
  useDiscountPackages,
} from "../../hooks";
import { formatDate } from "../../utils/formatDate";

const { Option } = Select;

export const AccountDiscountPackageList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState<Record<string, SortDirection>>({
    createdAt: SortDirection.DESC
  });
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

  // Fetch all discount packages to get names
  const { data: discountPackagesData, isLoading: isLoadingDiscountPackages } = useDiscountPackages(
    0, // page
    1000, // size - fetch a large number to get all packages
    {}, // sort
    undefined // filters
  );

  // Create mapping from ID to name
  const discountPackageMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (discountPackagesData?.content) {
      discountPackagesData.content.forEach((pkg) => {
        map[pkg.id] = pkg.name;
      });
    }
    return map;
  }, [discountPackagesData?.content]);

  const handleUnassign = (id: string) => {
    unassignMutation.mutate(id);
  };

  // Handle table changes including sorting
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const newSort: Record<string, SortDirection> = {};
    
    // Helper function to convert field to consistent string format
    const getFieldKey = (field: string | string[]) => {
      if (Array.isArray(field)) {
        return field.join('.');
      }
      return field;
    };
    
    // Handle multiple column sorting
    if (Array.isArray(sorter)) {
      sorter.forEach((s) => {
        if (s.field && s.order) {
          const fieldKey = getFieldKey(s.field);
          newSort[fieldKey] = s.order === 'ascend' ? SortDirection.ASC : SortDirection.DESC;
        }
      });
    } else if (sorter.field && sorter.order) {
      // Handle single column sorting
      const fieldKey = getFieldKey(sorter.field);
      newSort[fieldKey] = sorter.order === 'ascend' ? SortDirection.ASC : SortDirection.DESC;
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
          loading={isLoading || isLoadingDiscountPackages}
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
            dataIndex={["account", "fullName"]}
            title="Account"
            render={(value: string) => <Tag color="blue">{value}</Tag>}
            {...getSorterProps('account.fullName')}
          />
          <Table.Column
            dataIndex="discountPackageId"
            title="Package"
            render={(value: string) => (
              <Tag color="green">
                {discountPackageMap[value] || value}
              </Tag>
            )}
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
                  <Popconfirm
                    title="Unassign discount package"
                    description="Are you sure?"
                    onConfirm={() => handleUnassign(record.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Tooltip title="Unassign Package">
                      <Button
                        type="text"
                        size="small"
                        danger
                        loading={unassignMutation.isPending}
                        icon={<DeleteOutlined />}
                      />
                    </Tooltip>
                  </Popconfirm>
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
