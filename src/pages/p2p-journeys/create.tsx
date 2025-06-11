import React from "react";
import { Create } from "@refinedev/antd";
import { Form, Input, InputNumber, Card } from "antd";
import { P2PJourneyCreateRequest } from "../../data";
import { useCreateP2PJourney } from "../../hooks";
import { useNavigate } from "react-router";

export const P2PJourneyCreate: React.FC = () => {
  const [form] = Form.useForm();
  const createMutation = useCreateP2PJourney();
  const navigate = useNavigate();

  const onFinish = async (values: P2PJourneyCreateRequest) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        navigate("/p2p-journeys");
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
        <Card title="Create New P2P Journey">
          <Form.Item
            label="Start Station ID"
            name="startStationId"
            rules={[
              {
                required: true,
                message: "Please enter the start station ID",
              },
            ]}
          >
            <Input placeholder="Enter start station ID" />
          </Form.Item>

          <Form.Item
            label="End Station ID"
            name="endStationId"
            rules={[
              {
                required: true,
                message: "Please enter the end station ID",
              },
            ]}
          >
            <Input placeholder="Enter end station ID" />
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

          <Form.Item
            label="Distance (km)"
            name="distance"
            rules={[
              {
                required: true,
                message: "Please enter the distance",
              },
              {
                type: "number",
                min: 0,
                message: "Distance must be greater than 0",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter distance in kilometers"
              min={0}
              step={0.1}
            />
          </Form.Item>

          <Form.Item
            label="Travel Time (minutes)"
            name="travelTime"
            rules={[
              {
                required: true,
                message: "Please enter the travel time",
              },
              {
                type: "number",
                min: 0,
                message: "Travel time must be greater than 0",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter travel time in minutes"
              min={0}
            />
          </Form.Item>
        </Card>
      </Form>
    </Create>
  );
};
