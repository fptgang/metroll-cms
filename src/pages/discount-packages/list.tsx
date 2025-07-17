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
import type { SortOrder } from "antd/es/table/interface";
import { SearchOutlined, GiftOutlined } from "@ant-design/icons";
import { DiscountPackageDto, SortDirection } from "../../data/interfaces";
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
  const [sort, setSort] = useState<Record<string, SortDirection>>({
    createdAt: SortDirection.DESC
  });
  const perm = usePermissions();

  const filters = {
    search: searchQuery || undefined,
    status: statusFilter || undefined,
  };

  const { data, isLoading, error } = useDiscountPackages(page, size, sort, filters);
  const terminateMutation = useTerminateDiscountPackage();

  const handleTerminate = (id: string) => {
    terminateMutation.mutate(id);
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
    
    setSort(Object.keys(newSort).length > 0 ? newSort : {});
  };

  // Convert sort state to antd sorter format for controlled sorting
  const getSorterProps = (field: string) => {
    const sortDirection = sort?.[field];
    return {
      sorter: true,
      sortOrder: sortDirection ? (sortDirection === SortDirection.ASC ? 'ascend' : 'descend') as SortOrder : undefined,
    };
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
      extra={perm.data === 'ADMIN' && <CreateButton />}
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
          onChange={handleTableChange}
        >
          <Table.Column
            dataIndex="icon"
            title=""
            render={() => <GiftOutlined style={{ fontSize: "16px" }} />}
            width="50px"
          />
          <Table.Column 
            dataIndex="name" 
            title="Name" 
            {...getSorterProps('name')}
          />
          <Table.Column 
            dataIndex="description" 
            title="Description" 
            {...getSorterProps('description')}
          />
          <Table.Column
            dataIndex="discountPercentage"
            title="Discount"
            render={(value: number) => (
              <Tag color="green">{formatDiscountPercentage(value)}</Tag>
            )}
            {...getSorterProps('discountPercentage')}
          />
          <Table.Column
            dataIndex="duration"
            title="Duration"
            render={(value: number) => `${value} days`}
            {...getSorterProps('duration')}
          />
          <Table.Column
            dataIndex="status"
            title="Status"
            render={(value: string) => (
              <Tag color={value === "ACTIVE" ? "green" : "red"}>{value}</Tag>
            )}
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
