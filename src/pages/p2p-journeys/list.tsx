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
import { P2PJourneyDto } from "../../data";
import { useP2PJourneys, useDeleteP2PJourney } from "../../hooks";
import { formatDate } from "../../utils/formatDate";

export const P2PJourneyList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useP2PJourneys(page, size);
  const deleteMutation = useDeleteP2PJourney();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const journeys = data?.content || [];
  const total = data?.totalElements || 0;

  return (
    <Card
      title="P2P Journeys"
      extra={<CreateButton />}
      style={{ margin: "16px" }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Input.Search
          placeholder="Search journeys..."
          allowClear
          onSearch={setSearchQuery}
          style={{ width: 300 }}
          enterButton={<SearchOutlined />}
        />

        <Table
          dataSource={journeys}
          rowKey="id"
          loading={isLoading}
          pagination={false}
        >
          <Table.Column
            dataIndex="startStationId"
            title="Start Station"
            render={(value) => (
              <span style={{ fontWeight: "bold" }}>{value}</span>
            )}
          />
          <Table.Column
            dataIndex="endStationId"
            title="End Station"
            render={(value) => (
              <span style={{ fontWeight: "bold" }}>{value}</span>
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
            dataIndex="distance"
            title="Distance (km)"
            render={(value) => `${value} km`}
          />
          <Table.Column
            dataIndex="travelTime"
            title="Travel Time"
            render={(value) => (
              <span>
                <ClockCircleOutlined /> {value} min
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
            render={(_: unknown, record: P2PJourneyDto) => (
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
            `${range[0]}-${range[1]} of ${total} journeys`
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
