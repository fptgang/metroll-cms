import React, {useState} from "react";
import {CreateButton, EditButton, ShowButton,} from "@refinedev/antd";
import {Button, Card, Pagination, Popconfirm, Space, Table, Tag} from "antd";
import type { SortOrder } from "antd/es/table/interface";
import {DeleteOutlined, DollarOutlined,} from "@ant-design/icons";
import {SortDirection, VoucherDto, VoucherStatus} from "../../data";
import {useDeleteVoucher, useUpdateVoucherStatus, useVouchers,} from "../../hooks";
import {formatDate} from "../../utils/formatDate";
import {usePermissions} from "@refinedev/core";

export const VoucherList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const perm = usePermissions();
  const [sort, setSort] = useState<Record<string, SortDirection>>({
    createdAt: SortDirection.DESC
  });

  const { data, isLoading } = useVouchers(page, size, sort);
  const deleteMutation = useDeleteVoucher();
  const updateStatusMutation = useUpdateVoucherStatus();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleStatusChange = (id: string, status: VoucherStatus) => {
    updateStatusMutation.mutate({ id, status });
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

        <Table
          dataSource={vouchers}
          rowKey="id"
          loading={isLoading}
          pagination={false}
          onChange={handleTableChange}
        >
          <Table.Column
              dataIndex={["owner", "fullName"]}
              title="Owner"
              {...getSorterProps('owner.fullName')}
          />
          {perm.data === 'ADMIN' && <Table.Column
            dataIndex="code"
            title="Voucher Code"
            render={(value) => (
              <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>
                {value}
              </span>
            )}
            {...getSorterProps('code')}
          />}
          <Table.Column
            dataIndex="discountAmount"
            title="Discount Amount"
            render={(value) => (
              <span>
                <DollarOutlined /> {value.toLocaleString()}
              </span>
            )}
            {...getSorterProps('discountAmount')}
          />
          <Table.Column
            dataIndex="minTransactionAmount"
            title="Min Transaction"
            render={(value) => (
              <span>
                <DollarOutlined /> {value.toLocaleString()}
              </span>
            )}
            {...getSorterProps('minTransactionAmount')}
          />
          <Table.Column
            dataIndex="status"
            title="Status"
            render={(value: VoucherStatus) => (
              <Tag color={getStatusColor(value)}>{value}</Tag>
            )}
            {...getSorterProps('status')}
          />
          <Table.Column
            dataIndex="validFrom"
            title="Valid From"
            render={(value: string) => formatDate(value)}
            {...getSorterProps('validFrom')}
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
            render={(_: unknown, record: VoucherDto) => (
              <Space>
                <ShowButton hideText size="small" recordItemId={record.id} />
                {((perm.data === "ADMIN" || perm.data === "STAFF") && record.status == VoucherStatus.VALID) && <>
                  <EditButton hideText size="small" recordItemId={record.id} />
                  <Popconfirm
                    title="Delete voucher"
                    description="Are you sure?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                    />
                  </Popconfirm>
                </>}
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
