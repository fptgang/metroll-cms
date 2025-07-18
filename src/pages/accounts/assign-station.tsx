import React, { useState, useEffect } from "react";
import { Form, Select, Card, Button, message } from "antd";
import { useParams, useNavigate } from "react-router";
import { StationAssignmentRequest } from "../../data";
import { useAssignStationToStaff, useAccount } from "../../hooks";
import { useStations } from "../../hooks";

export const AccountAssignStation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedStation, setSelectedStation] = useState<string>();

  // Get account details
  const { data: accountData, isLoading: accountLoading } = useAccount(id!);

  // Get stations with a high page size to get all stations
  const { data: stationsData, isLoading: stationsLoading } = useStations(
    0, // page
    1000, // size - high enough to get all stations
    {}, // sort
    {} // filters
  );

  const assignMutation = useAssignStationToStaff();

  // Set form initial values when account data is loaded
  useEffect(() => {
    if (accountData && accountData.assignedStation) {
      form.setFieldsValue({
        assignedStation: accountData.assignedStation,
      });
      setSelectedStation(accountData.assignedStation);
    }
  }, [accountData, form]);

  const onFinish = async (values: { assignedStation: string }) => {
    if (!id) {
      message.error("Staff ID is required");
      return;
    }

    const request: StationAssignmentRequest = {
      stationCode: values.assignedStation,
    };

    assignMutation.mutate(
      { staffId: id, request },
      {
        onSuccess: () => {
          navigate("/accounts");
        },
      }
    );
  };

  const stations = stationsData?.content || [];

  return (
    <Card title="Assign Station to Staff" style={{ margin: "16px" }}>
      {accountData && (
        <div style={{ marginBottom: 16, padding: 12, background: "#f5f5f5", borderRadius: 6 }}>
          <strong>Staff:</strong> {accountData.fullName} ({accountData.email})
          {accountData.assignedStation && (
            <div style={{ marginTop: 4, color: "#666" }}>
              <strong>Current Station:</strong> {accountData.assignedStation}
            </div>
          )}
        </div>
      )}
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Assigned Station"
          name="assignedStation"
          rules={[
            {
              required: true,
              message: "Please select a station",
            },
          ]}
        >
          <Select
            placeholder="Select a station"
            loading={stationsLoading || accountLoading}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                ?.toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            onChange={setSelectedStation}
          >
            {stations
                .filter(station => station.status === "OPERATIONAL")
                .map((station) => (
              <Select.Option key={station.code} value={station.code}>
                {station.name} ({station.code})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={assignMutation.isPending}
            style={{ marginRight: 8 }}
          >
            Assign Station
          </Button>
          <Button onClick={() => navigate("/accounts")}>Cancel</Button>
        </Form.Item>
      </Form>
    </Card>
  );
}; 