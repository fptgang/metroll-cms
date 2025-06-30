import React, { useEffect } from "react";
import { Edit } from "@refinedev/antd";
import { Form, Input, InputNumber, Card, Select } from "antd";
import { TimedTicketPlanUpdateRequest } from "../../data";
import { useTimedTicketPlan, useUpdateTimedTicketPlan } from "../../hooks";
import { useParams, useNavigate } from "react-router";

export const TimedTicketPlanEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const { data: plan, isLoading } = useTimedTicketPlan(id!);
  const updateMutation = useUpdateTimedTicketPlan();
  const navigate = useNavigate();

  const durationOptions = [
    { label: "1 day", value: 1 },
    { label: "3 days", value: 3 },
    { label: "7 days", value: 7 },
    { label: "1 month (30 days)", value: 30 },
    { label: "3 months", value: 90 },
    { label: "6 months", value: 183 },
    { label: "1 year", value: 365 },
  ];

  useEffect(() => {
    if (plan) {
      form.setFieldsValue({
        name: plan.name,
        validDuration: plan.validDuration,
        basePrice: plan.basePrice,
      });
    }
  }, [plan, form]);

  const onFinish = async (values: TimedTicketPlanUpdateRequest) => {
    updateMutation.mutate(
      { id: id!, data: values },
      {
        onSuccess: () => {
          navigate("/timed-ticket-plans");
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
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Card title="Edit Timed Ticket Plan">
          <Form.Item
            label="Plan Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter the plan name",
              },
            ]}
          >
            <Input placeholder="Enter plan name (e.g., Monthly Pass, Weekly Pass)" />
          </Form.Item>

          <Form.Item
            label="Valid Duration"
            name="validDuration"
            rules={[
              {
                required: true,
                message: "Please select the valid duration",
              },
            ]}
          >
            <Select
              placeholder="Select valid duration"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={durationOptions}
            />
          </Form.Item>

          <Form.Item
            label="Base Price"
            name="basePrice"
            rules={[
              {
                required: true,
                message: "Please enter the base price",
              },
              {
                type: "number",
                min: 0,
                message: "Base price must be greater than 0",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter base price"
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
        </Card>
      </Form>
    </Edit>
  );
};
