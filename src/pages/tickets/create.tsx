import React from "react";
import { Create } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, Card } from "antd";
import { TicketUpsertRequest, TicketType } from "../../data";
import { useCreateTicket } from "../../hooks";
import { useNavigate } from "react-router";
import dayjs from "dayjs";

export const TicketCreate: React.FC = () => {
  const [form] = Form.useForm();
  const createMutation = useCreateTicket();
  const navigate = useNavigate();

  const generateTicketNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TKT${timestamp}${random}`;
  };

  const onFinish = async (values: any) => {
    const ticketData: TicketUpsertRequest = {
      ...values,
      validUntil: values.validUntil.toISOString(),
      ticketNumber: generateTicketNumber(),
    };

    createMutation.mutate(ticketData, {
      onSuccess: () => {
        navigate("/tickets");
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
        <Card title="Create New Ticket">
          <Form.Item
            label="Ticket Type"
            name="ticketType"
            rules={[
              {
                required: true,
                message: "Please select the ticket type",
              },
            ]}
          >
            <Select placeholder="Select ticket type">
              <Select.Option value={TicketType.P2P}>P2P Journey</Select.Option>
              <Select.Option value={TicketType.TIMED}>Timed Pass</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Ticket Order Detail ID"
            name="ticketOrderDetailId"
            rules={[
              {
                required: true,
                message: "Please enter the ticket order detail ID",
              },
            ]}
          >
            <Input placeholder="Enter ticket order detail ID" />
          </Form.Item>

          <Form.Item
            label="Valid Until"
            name="validUntil"
            rules={[
              {
                required: true,
                message: "Please select the valid until date",
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="Select valid until date"
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
