import React, { useState } from "react";
import {
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton,
} from "@refinedev/antd";
import { Table, Space, Card, Input, Pagination } from "antd";
import type { SortOrder } from "antd/es/table/interface";
import {
  SearchOutlined,
  DollarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { TimedTicketPlanDto, SortDirection } from "../../data";
import { useTimedTicketPlans, useDeleteTimedTicketPlan } from "../../hooks";
import { formatDate } from "../../utils/formatDate";
import { usePermissions } from "@refinedev/core";

export const TimedTicketPlanList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<Record<string, SortDirection>>({
    createdAt: SortDirection.DESC
  });
  
  const perm = usePermissions();

  const { data, isLoading } = useTimedTicketPlans(page, size, sort, {
    search: searchQuery
  });
  const deleteMutation = useDeleteTimedTicketPlan();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
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

  const plans = data?.content || [];
  const total = data?.totalElements || 0;

  const formatDuration = (validDuration: number) => {
    return `${validDuration} day${validDuration > 1 ? "s" : ""}`;
  };

  return (
    <Card
      title="Timed Ticket Plans"
      extra={perm.data == "ADMIN" && <CreateButton />}
      style={{ margin: "16px" }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Input.Search
          placeholder="Search plans..."
          allowClear
          onSearch={setSearchQuery}
          style={{ width: 300 }}
          enterButton={<SearchOutlined />}
        />

        <Table
          dataSource={plans}
          rowKey="id"
          loading={isLoading}
          pagination={false}
          onChange={handleTableChange}
        >
          <Table.Column
            dataIndex="name"
            title="Plan Name"
            render={(value) => (
              <span style={{ fontWeight: "bold" }}>{value}</span>
            )}
            {...getSorterProps('name')}
          />
          <Table.Column
            dataIndex="validDuration"
            title="Valid Duration"
            render={(value) => (
              <span>
                <ClockCircleOutlined /> {formatDuration(value)}
              </span>
            )}
            {...getSorterProps('validDuration')}
          />
          <Table.Column
            dataIndex="basePrice"
            title="Base Price"
            render={(value) => (
              <span style={{ color: "#52c41a" }}>
                <DollarOutlined /> {value.toLocaleString()}
              </span>
            )}
            {...getSorterProps('basePrice')}
          />
          <Table.Column
            dataIndex="createdAt"
            title="Created At"
            render={(value: string) => formatDate(value)}
            {...getSorterProps('createdAt')}
          />
          <Table.Column
            title="Actions"
            dataIndex="actions"
            render={(_: unknown, record: TimedTicketPlanDto) => (
              <Space>
                <ShowButton hideText size="small" recordItemId={record.id} />
                {perm.data == "ADMIN" && <EditButton hideText size="small" recordItemId={record.id} />}
                {perm.data == "ADMIN" && <DeleteButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  onSuccess={() => handleDelete(record.id)}
                />}
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
            `${range[0]}-${range[1]} of ${total} plans`
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
