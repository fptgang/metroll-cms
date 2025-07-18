import React, { useState } from "react";
import {
  EditButton,
  ShowButton,
  CreateButton,
} from "@refinedev/antd";
import { Table, Space, Card, Input, Pagination, Button, Popconfirm } from "antd";
import type { SortOrder } from "antd/es/table/interface";
import {
  SearchOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { P2PJourneyDto, SortDirection } from "../../data";
import { useP2PJourneys, useDeleteP2PJourney } from "../../hooks";
import { formatDate } from "../../utils/formatDate";
import { usePermissions } from "@refinedev/core";

export const P2PJourneyList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<Record<string, SortDirection>>({
    createdAt: SortDirection.DESC
  });
  const perm = usePermissions();

  const { data, isLoading } = useP2PJourneys(page, size, sort, {
    search: searchQuery
  });
  const deleteMutation = useDeleteP2PJourney();

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

  const journeys = data?.content || [];
  const total = data?.totalElements || 0;

  return (
    <Card
      title="P2P Journeys"
      extra={perm.data == "ADMIN" && <CreateButton />}
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
          onChange={handleTableChange}
        >
          <Table.Column
            dataIndex="startStationId"
            title="Start Station"
            render={(value) => (
              <span>{value}</span>
            )}
            {...getSorterProps('startStationId')}
          />
          <Table.Column
            dataIndex="endStationId"
            title="End Station"
            render={(value) => (
              <span>{value}</span>
            )}
            {...getSorterProps('endStationId')}
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
            dataIndex="distance"
            title="Distance (km)"
            render={(value) => `${value} km`}
            {...getSorterProps('distance')}
          />
          <Table.Column
            dataIndex="travelTime"
            title="Travel Time"
            render={(value) => (
              <span>
                <ClockCircleOutlined /> {value} min
              </span>
            )}
            {...getSorterProps('travelTime')}
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
            render={(_: unknown, record: P2PJourneyDto) => (
              <Space>
                <ShowButton hideText size="small" recordItemId={record.id} />
                {perm.data == "ADMIN" && <EditButton hideText size="small" recordItemId={record.id} />} 
                {perm.data == "ADMIN" && (
                  <Popconfirm
                    title="Delete P2P Journey"
                    description="Are you sure you want to delete this P2P journey?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      loading={deleteMutation.isPending}
                    />
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
