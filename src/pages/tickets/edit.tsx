import React, { useEffect } from "react";
import { Edit } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, Card } from "antd";
import { TicketStatus, TicketType } from "../../data";
import { useTicket, useUpdateTicketStatus } from "../../hooks";
import { useParams, useNavigate } from "react-router";
import dayjs from "dayjs";

export const TicketEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const { data: ticket, isLoading } = useTicket(id!);
  const updateMutation = useUpdateTicketStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (ticket) {
      form.setFieldsValue({
        ...ticket,
        validUntil: dayjs(ticket.validUntil),
      });
    }
  }, [ticket, form]);

  const onFinish = async (values: any) => {
    updateMutation.mutate(
      { id: id!, status: values.status },
      {
        onSuccess: () => {
          navigate("/tickets");
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
        <Card title="Edit Ticket">
          <Form.Item label="Ticket Number" name="ticketNumber">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Ticket Type" name="ticketType">
            <Select disabled>
              <Select.Option value={TicketType.P2P}>P2P Journey</Select.Option>
              <Select.Option value={TicketType.TIMED}>Timed Pass</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Order Detail ID" name="ticketOrderDetailId">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Valid Until" name="validUntil">
            <DatePicker
              style={{ width: "100%" }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              disabled
            />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[
              {
                required: true,
                message: "Please select the ticket status",
              },
            ]}
          >
            <Select placeholder="Select status">
              <Select.Option value={TicketStatus.VALID}>Valid</Select.Option>
              <Select.Option value={TicketStatus.USED}>Used</Select.Option>
              <Select.Option value={TicketStatus.EXPIRED}>
                Expired
              </Select.Option>
              <Select.Option value={TicketStatus.CANCELLED}>
                Cancelled
              </Select.Option>
            </Select>
          </Form.Item>
        </Card>
      </Form>
    </Edit>
  );
};
