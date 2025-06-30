import React, { useState } from "react";
import {
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton,
} from "@refinedev/antd";
import { Table, Space, Card, Input, Pagination } from "antd";
import {
  SearchOutlined,
  DollarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { TimedTicketPlanDto } from "../../data";
import { useTimedTicketPlans, useDeleteTimedTicketPlan } from "../../hooks";
import { formatDate } from "../../utils/formatDate";

export const TimedTicketPlanList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useTimedTicketPlans(page, size);
  const deleteMutation = useDeleteTimedTicketPlan();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const plans = data?.content || [];
  const total = data?.totalElements || 0;

  const formatDuration = (validDuration: number) => {
    return `${validDuration} day${validDuration > 1 ? "s" : ""}`;
  };

  return (
    <Card
      title="Timed Ticket Plans"
      extra={<CreateButton />}
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
        >
          <Table.Column
            dataIndex="name"
            title="Plan Name"
            render={(value) => (
              <span style={{ fontWeight: "bold" }}>{value}</span>
            )}
          />
          <Table.Column
            dataIndex="validDuration"
            title="Valid Duration"
            render={(value) => (
              <span>
                <ClockCircleOutlined /> {formatDuration(value)}
              </span>
            )}
          />
          <Table.Column
            dataIndex="basePrice"
            title="Base Price"
            render={(value) => (
              <span style={{ color: "#52c41a" }}>
                <DollarOutlined /> {value.toLocaleString()}
              </span>
            )}
          />
          <Table.Column
            dataIndex="createdAt"
            title="Created At"
            render={(value: string) => formatDate(value)}
          />
          <Table.Column
            title="Actions"
            dataIndex="actions"
            render={(_: unknown, record: TimedTicketPlanDto) => (
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
