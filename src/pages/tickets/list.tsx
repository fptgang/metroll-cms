import React, { useState } from "react";
import {
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton,
} from "@refinedev/antd";
import { Table, Space, Tag, Card, Input, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { TicketDto, TicketStatus, TicketType } from "../../data";
import { useTickets } from "../../hooks";
import { formatDate } from "../../utils/formatDate";

export const TicketList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useTickets(page, size);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
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
      case "SINGLE_JOURNEY":
        return "blue";
      case "TIMED_PASS":
        return "purple";
      default:
        return "default";
    }
  };

  const tickets = data?.content || [];
  const total = data?.totalElements || 0;

  return (
    <Card title="Tickets" extra={<CreateButton />} style={{ margin: "16px" }}>
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
        >
          <Table.Column dataIndex="ticketNumber" title="Ticket Number" />
          <Table.Column
            dataIndex="ticketType"
            title="Type"
            render={(value: string) => (
              <Tag color={getTypeColor(value)}>{value.replace("_", " ")}</Tag>
            )}
          />
          <Table.Column
            dataIndex="status"
            title="Status"
            render={(value: string) => (
              <Tag color={getStatusColor(value)}>{value}</Tag>
            )}
          />
          <Table.Column
            dataIndex="purchaseDate"
            title="Purchase Date"
            render={(value: string) => formatDate(value)}
          />
          <Table.Column
            dataIndex="validUntil"
            title="Valid Until"
            render={(value: string) => formatDate(value)}
          />
          <Table.Column
            dataIndex="createdAt"
            title="Created At"
            render={(value: string) => formatDate(value)}
          />
          <Table.Column
            title="Actions"
            dataIndex="actions"
            render={(_: unknown, record: TicketDto) => (
              <Space>
                <ShowButton hideText size="small" recordItemId={record.id} />
                <EditButton hideText size="small" recordItemId={record.id} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
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
