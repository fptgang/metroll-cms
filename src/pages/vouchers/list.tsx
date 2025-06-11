import React, { useState } from "react";
import {
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton,
} from "@refinedev/antd";
import { Table, Space, Tag, Card, Input, Pagination, Button } from "antd";
import { SearchOutlined, DollarOutlined } from "@ant-design/icons";
import { VoucherDto, VoucherStatus } from "../../data";
import {
  useVouchers,
  useDeleteVoucher,
  useUpdateVoucherStatus,
} from "../../hooks";

export const VoucherList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useVouchers(page, size);
  const deleteMutation = useDeleteVoucher();
  const updateStatusMutation = useUpdateVoucherStatus();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleStatusChange = (id: string, status: VoucherStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  const getStatusColor = (status: VoucherStatus) => {
    switch (status) {
      case VoucherStatus.PRESERVED:
        return "blue";
      case VoucherStatus.VALID:
        return "green";
      case VoucherStatus.USED:
        return "purple";
      case VoucherStatus.EXPIRED:
        return "red";
      case VoucherStatus.REVOKED:
        return "volcano";
      default:
        return "default";
    }
  };

  const vouchers = data?.content || [];
  const total = data?.totalElements || 0;

  return (
    <Card title="Vouchers" extra={<CreateButton />} style={{ margin: "16px" }}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Input.Search
          placeholder="Search vouchers..."
          allowClear
          onSearch={setSearchQuery}
          style={{ width: 300 }}
          enterButton={<SearchOutlined />}
        />

        <Table
          dataSource={vouchers}
          rowKey="id"
          loading={isLoading}
          pagination={false}
        >
          <Table.Column
            dataIndex="code"
            title="Voucher Code"
            render={(value) => (
              <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>
                {value}
              </span>
            )}
          />
          <Table.Column
            dataIndex="discountAmount"
            title="Discount Amount"
            render={(value) => (
              <span>
                <DollarOutlined /> {value.toLocaleString()}
              </span>
            )}
          />
          <Table.Column
            dataIndex="minTransactionAmount"
            title="Min Transaction"
            render={(value) => (
              <span>
                <DollarOutlined /> {value.toLocaleString()}
              </span>
            )}
          />
          <Table.Column
            dataIndex="status"
            title="Status"
            render={(value: VoucherStatus) => (
              <Tag color={getStatusColor(value)}>{value}</Tag>
            )}
          />
          <Table.Column
            dataIndex="validFrom"
            title="Valid From"
            render={(value: string) => new Date(value).toLocaleDateString()}
          />
          <Table.Column
            dataIndex="validUntil"
            title="Valid Until"
            render={(value: string) => new Date(value).toLocaleDateString()}
          />
          <Table.Column
            dataIndex="createdAt"
            title="Created At"
            render={(value: string) => new Date(value).toLocaleDateString()}
          />
          <Table.Column
            title="Actions"
            dataIndex="actions"
            render={(_: unknown, record: VoucherDto) => (
              <Space>
                <ShowButton hideText size="small" recordItemId={record.id} />
                <EditButton hideText size="small" recordItemId={record.id} />
                {record.status === VoucherStatus.VALID && (
                  <Button
                    size="small"
                    type="primary"
                    danger
                    onClick={() =>
                      handleStatusChange(record.id, VoucherStatus.REVOKED)
                    }
                  >
                    Revoke
                  </Button>
                )}
                {record.status === VoucherStatus.REVOKED && (
                  <Button
                    size="small"
                    type="primary"
                    onClick={() =>
                      handleStatusChange(record.id, VoucherStatus.VALID)
                    }
                  >
                    Activate
                  </Button>
                )}
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
            `${range[0]}-${range[1]} of ${total} vouchers`
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
