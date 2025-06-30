import React, { useEffect } from "react";
import { Edit } from "@refinedev/antd";
import { Form, Input, InputNumber, Card } from "antd";
import { P2PJourneyUpdateRequest } from "../../data";
import { useP2PJourney, useUpdateP2PJourney } from "../../hooks";
import { useParams, useNavigate } from "react-router";

export const P2PJourneyEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const { data: journey, isLoading } = useP2PJourney(id!);
  const updateMutation = useUpdateP2PJourney();
  const navigate = useNavigate();

  useEffect(() => {
    if (journey) {
      form.setFieldsValue({
        startStationId: journey.startStationId,
        endStationId: journey.endStationId,
        basePrice: journey.basePrice,
        distance: journey.distance,
        travelTime: journey.travelTime,
      });
    }
  }, [journey, form]);

  const onFinish = async (values: P2PJourneyUpdateRequest) => {
    updateMutation.mutate(
      { id: id!, data: values },
      {
        onSuccess: () => {
          navigate("/p2p-journeys");
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
        <Card title="Edit P2P Journey">
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
    </Edit>
  );
};
