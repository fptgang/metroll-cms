import React, { useEffect } from "react";
import { Edit } from "@refinedev/antd";
import { Form, Input, InputNumber, DatePicker, Card, Select } from "antd";
import { VoucherUpdateRequest, VoucherStatus } from "../../data";
import { useVoucher, useUpdateVoucher } from "../../hooks";
import { useParams, useNavigate } from "react-router";
import dayjs from "dayjs";
import { formatDate } from "../../utils/formatDate";
import {usePermissions} from "@refinedev/core";

const { RangePicker } = DatePicker;

export const VoucherEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const { data: voucher, isLoading } = useVoucher(id!);
  const updateMutation = useUpdateVoucher();
  const navigate = useNavigate();
  const perm = usePermissions();

  useEffect(() => {
    if (voucher) {
      form.setFieldsValue({
        ...voucher,
        dateRange: [
          dayjs(formatDate(voucher?.validFrom || "")),
          dayjs(formatDate(voucher?.validUntil || ""))
        ],
      });
    }
  }, [voucher, form]);

  const onFinish = async (values: any) => {
    const { dateRange, ...rest } = values;
    const voucherData: VoucherUpdateRequest = {
      discountAmount: rest.discountAmount,
      minTransactionAmount: rest.minTransactionAmount,
      validFrom: dateRange[0].toISOString(),
      validUntil: dateRange[1].toISOString(),
    };

    updateMutation.mutate(
      { id: id!, data: voucherData },
      {
        onSuccess: () => {
          navigate("/vouchers");
        },
      }
    );
  };

  return (
    <Edit
      isLoading={isLoading}
      saveButtonProps={{
        loading: updateMutation.isPending,
        onClick: () => form.submit(),
      }}
      canDelete={perm.data === "ADMIN" || perm.data === "STAFF"}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Card title="Edit Voucher">
          <Form.Item label="Owner ID" name="ownerId">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Discount Amount"
            name="discountAmount"
            rules={[
              {
                required: true,
                message: "Please enter the discount amount",
              },
              {
                type: "number",
                min: 0,
                message: "Discount amount must be greater than 0",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter discount amount"
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            label="Minimum Transaction Amount"
            name="minTransactionAmount"
            rules={[
              {
                required: true,
                message: "Please enter the minimum transaction amount",
              },
              {
                type: "number",
                min: 0,
                message: "Minimum transaction amount must be greater than 0",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter minimum transaction amount"
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            label="Validity Period"
            name="dateRange"
            rules={[
              {
                required: true,
                message: "Please select the validity period",
              },
            ]}
          >
            <RangePicker
              style={{ width: "100%" }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={["Valid From", "Valid Until"]}
              defaultValue={[
                dayjs(formatDate(voucher?.validFrom || "")),
                dayjs(formatDate(voucher?.validUntil || "")),
              ]}
            />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select disabled placeholder="Select status">
              <Select.Option value={VoucherStatus.PRESERVED}>
                Preserved
              </Select.Option>
              <Select.Option value={VoucherStatus.VALID}>Valid</Select.Option>
              <Select.Option value={VoucherStatus.USED}>Used</Select.Option>
              <Select.Option value={VoucherStatus.EXPIRED}>
                Expired
              </Select.Option>
              <Select.Option value={VoucherStatus.REVOKED}>
                Revoked
              </Select.Option>
            </Select>
          </Form.Item>
        </Card>
      </Form>
    </Edit>
  );
};
