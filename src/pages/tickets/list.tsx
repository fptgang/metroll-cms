import React, { useState } from "react";
import {
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton,
} from "@refinedev/antd";
import { Table, Space, Tag, Card, Input, Pagination } from "antd";
import type { SortOrder } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";
import { TicketDto, TicketStatus, TicketType, SortDirection } from "../../data";
import { useTickets } from "../../hooks";
import { formatDate } from "../../utils/formatDate";

export const TicketList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<Record<string, SortDirection>>({
    createdAt: SortDirection.DESC
  });

  const { data, isLoading } = useTickets(page, size, sort, {
    search: searchQuery
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VALID":
        return "green";
      case "USED":
        return "blue";
      case "EXPIRED":
        return "red";
      case "CANCELLED":
        return "orange";
      default:
        return "default";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "P2P":
        return "blue";
      case "TIMED":
        return "purple";
      default:
        return "default";
    }
  };

  const tickets = data?.content || [];
  const total = data?.totalElements || 0;

  return (
    <Card title="Tickets" extra={false && <CreateButton />} style={{ margin: "16px" }}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Input.Search
          placeholder="Search tickets..."
          allowClear
          onSearch={setSearchQuery}
          style={{ width: 300 }}
          enterButton={<SearchOutlined />}
        />

        <Table
          dataSource={tickets}
          rowKey="id"
          loading={isLoading}
          pagination={false}
          onChange={handleTableChange}
        >
          <Table.Column 
            dataIndex="ticketNumber" 
            title="Ticket Number" 
            {...getSorterProps('ticketNumber')}
          />
          <Table.Column
            dataIndex="ticketType"
            title="Type"
            render={(value: string) => (
              <Tag color={getTypeColor(value)}>{value === "P2P" ? "P2P" : "TIMED"}</Tag>
            )}
            {...getSorterProps('ticketType')}
          />
          <Table.Column
            dataIndex="status"
            title="Status"
            render={(value: string) => (
              <Tag color={getStatusColor(value)}>{value}</Tag>
            )}
            {...getSorterProps('status')}
          />
          <Table.Column
            dataIndex="purchaseDate"
            title="Purchase Date"
            render={(value: string) => formatDate(value)}
            {...getSorterProps('purchaseDate')}
          />
          <Table.Column
            dataIndex="validUntil"
            title="Valid Until"
            render={(value: string) => formatDate(value)}
            {...getSorterProps('validUntil')}
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
            render={(_: unknown, record: TicketDto) => (
              <Space>
                <ShowButton hideText size="small" recordItemId={record.id} />
                {/* <EditButton hideText size="small" recordItemId={record.id} /> */}
                {/* <DeleteButton hideText size="small" recordItemId={record.id} /> */}
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
            `${range[0]}-${range[1]} of ${total} tickets`
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
