import React from "react";
import { Create } from "@refinedev/antd";
import { Form, Input, InputNumber, Card, Select } from "antd";
import { TimedTicketPlanCreateRequest } from "../../data";
import { useCreateTimedTicketPlan } from "../../hooks";
import { useNavigate } from "react-router";

export const TimedTicketPlanCreate: React.FC = () => {
  const [form] = Form.useForm();
  const createMutation = useCreateTimedTicketPlan();
  const navigate = useNavigate();

  const durationOptions = [
    { label: "30 minutes", value: 30 },
    { label: "1 hour", value: 60 },
    { label: "2 hours", value: 120 },
    { label: "4 hours", value: 240 },
    { label: "6 hours", value: 360 },
    { label: "12 hours", value: 720 },
    { label: "1 day", value: 1440 },
    { label: "3 days", value: 4320 },
    { label: "7 days", value: 10080 },
    { label: "1 month (30 days)", value: 43200 },
    { label: "3 months", value: 129600 },
    { label: "6 months", value: 259200 },
    { label: "1 year", value: 525600 },
  ];

  const onFinish = async (values: TimedTicketPlanCreateRequest) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        navigate("/timed-ticket-plans");
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
        <Card title="Create New Timed Ticket Plan">
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
    </Create>
  );
};
