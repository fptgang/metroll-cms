import React, { useState } from "react";
import { Create } from "@refinedev/antd";
import { Form, Input, InputNumber, Card, Select, Checkbox, Space, message } from "antd";
import { P2PJourneyCreateRequest } from "../../data";
import { useCreateP2PJourney } from "../../hooks";
import { useOperationalStations } from "../../hooks/useStations";
import { useNavigate } from "react-router";

export const P2PJourneyCreate: React.FC = () => {
  const [form] = Form.useForm();
  const [createReverse, setCreateReverse] = useState(false);
  const createMutation = useCreateP2PJourney();
  const navigate = useNavigate();
  
  // Get operational stations for the dropdowns
  const { data: stations, isLoading: stationsLoading } = useOperationalStations();

  const onFinish = async (values: P2PJourneyCreateRequest) => {
    try {
      // Create the main journey
      await createMutation.mutateAsync(values);
      
      // Create reverse journey if checkbox is checked
      if (createReverse) {
        const reverseJourney: P2PJourneyCreateRequest = {
          startStationId: values.endStationId,
          endStationId: values.startStationId,
          basePrice: values.basePrice,
          distance: values.distance,
          travelTime: values.travelTime,
        };
        
        await createMutation.mutateAsync(reverseJourney);
        message.success("Both journeys created successfully!");
      }
      
      navigate("/p2p-journeys");
    } catch (error) {
      // Error handling is done by the mutation
    }
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
            label="Start Station"
            name="startStationId"
            rules={[
              {
                required: true,
                message: "Please select the start station",
              },
            ]}
          >
            <Select
              placeholder="Select start station"
              loading={stationsLoading}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {stations?.map((station) => (
                <Select.Option key={station.id} value={station.code}>
                  {station.name} ({station.code})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="End Station"
            name="endStationId"
            rules={[
              {
                required: true,
                message: "Please select the end station",
              },
            ]}
          >
            <Select
              placeholder="Select end station"
              loading={stationsLoading}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {stations?.map((station) => (
                <Select.Option key={station.id} value={station.code}>
                  {station.name} ({station.code})
                </Select.Option>
              ))}
            </Select>
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

          <Form.Item>
            <Checkbox 
              checked={createReverse}
              onChange={(e) => setCreateReverse(e.target.checked)}
            >
              Create reverse journey (with same properties)
            </Checkbox>
          </Form.Item>
        </Card>
      </Form>
    </Create>
  );
};
