import React, { useState } from "react";
import { Create } from "@refinedev/antd";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Card,
  Button,
  Select,
  Spin,
  Alert,
} from "antd";
import {SortDirection, VoucherCreateRequest} from "../../data";
import { useCreateVoucher } from "../../hooks";
import { useAccounts } from "../../hooks";
import { useNavigate } from "react-router";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export const VoucherCreate: React.FC = () => {
  const [form] = Form.useForm();
  const createMutation = useCreateVoucher();
  const navigate = useNavigate();

  // Fetch accounts for the dropdown list
  const {
    data: accountsData,
    isLoading: isAccountsLoading,
    error: accountsError,
  } = useAccounts(0, 100, {}); // Fetch up to 100 accounts

  const onFinish = async (values: any) => {
    const { dateRange, ...rest } = values;
    const voucherData: VoucherCreateRequest = {
      ...rest,
      validFrom: dateRange[0].toISOString(),
      validUntil: dateRange[1].toISOString(),
    };

    createMutation.mutate(voucherData, {
      onSuccess: () => {
        navigate("/vouchers");
      },
    });
  };

  return (
    <Create
      saveButtonProps={{
        loading: createMutation.isPending,
        onClick: () => form.submit(),
      }}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Card title="Create New Voucher">
          <Form.Item
            label="Select Recipients"
            name="recipients"
            rules={[
              {
                required: true,
                message: "Please select at least one recipient",
              },
            ]}
          >
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Select users as voucher recipients"
              loading={isAccountsLoading}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              maxTagCount="responsive"
              dropdownStyle={{ maxHeight: 300 }}
              notFoundContent={
                accountsError ? (
                  <Alert
                    message="Error loading accounts"
                    description="Failed to load user accounts. Please try again."
                    type="error"
                    showIcon={false}
                    style={{ margin: 8 }}
                  />
                ) : isAccountsLoading ? (
                  <Spin size="small" />
                ) : (
                  "No accounts found"
                )
              }
              options={
                accountsData?.content?.filter(account => account.role === "CUSTOMER" && account.active)
                .map((account) => ({
                  label: `${account.fullName} (${account.email})`,
                  value: account.id,
                })) || []
              }
            />
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
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>
        </Card>
      </Form>
    </Create>
  );
};
