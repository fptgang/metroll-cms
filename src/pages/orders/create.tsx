import React from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Select, Card, Space, Button, InputNumber, Alert, Typography, message } from "antd";
import { ShoppingCartOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import {
  CheckoutRequest,
  CheckoutItemRequest,
  PaymentMethod,
  TicketType,
  SortDirection,
} from "../../data/interfaces";
import { useOrderCheckout } from "../../hooks/useOrders";
import { useP2PJourneys } from "../../hooks/useP2PJourneys";
import { useOperationalStations } from "../../hooks/useStations";

const { Title, Text } = Typography;

export const OrderCreate: React.FC = () => {
  const navigate = useNavigate();
  const checkoutMutation = useOrderCheckout();
  const { data: p2pJourneysData, isLoading: isLoadingJourneys } = useP2PJourneys(
    0, 
    1000,
    { createdAt: SortDirection.DESC }
  );
  const { data: stations, isLoading: isLoadingStations } = useOperationalStations();
  
  const p2pJourneys = p2pJourneysData?.content || [];

  // Add form instance for useWatch
  const [form] = Form.useForm();

  // Watch items field for live updates
  const items = Form.useWatch("items", form) || [];

  // Calculate total based on selected journeys and quantities
  const total = React.useMemo(() => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((sum: number, item: any) => {
      if (!item || !item.p2pJourneyId) return sum;
      const journey = p2pJourneys.find((j: any) => j.id === item.p2pJourneyId);
      if (!journey) return sum;
      const quantity = item.quantity || 1;
      return sum + journey.basePrice * quantity;
    }, 0);
  }, [items, p2pJourneys]);

  const handleFinish = async (values: any) => {
    try {
      // Validate that we have at least one item
      if (!values.items || values.items.length === 0) {
        message.error("Please add at least one ticket to the order");
        return;
      }

      // Validate that all items have journey IDs
      const invalidItems = values.items.filter((item: any) => !item?.p2pJourneyId);
      if (invalidItems.length > 0) {
        message.error("Please select a journey route for all tickets");
        return;
      }

      // Transform UI data to backend format
      const transformedItems: CheckoutItemRequest[] = [];
      
      values.items.forEach((item: any) => {
        const quantity = item.quantity || 1;
        
        // Create multiple items with quantity 1 for each unit
        for (let i = 0; i < quantity; i++) {
          transformedItems.push({
            ticketType: TicketType.P2P,
            p2pJourneyId: item.p2pJourneyId,
            quantity: 1,
          });
        }
      });

      const checkoutRequest: CheckoutRequest = {
        items: transformedItems,
        paymentMethod: PaymentMethod.CASH,
      };

      await checkoutMutation.mutateAsync(checkoutRequest);
      message.success("Order processed successfully!");
      
      // Reset form after successful submission
      form.resetFields();
      
      // Navigate back to orders list
      navigate("/orders");
    } catch (error) {
      console.error("Order processing failed:", error);
      message.error("Failed to process order. Please try again.");
    }
  };

  // Create stations lookup for displaying journey names
  const stationsMap = React.useMemo(() => {
    if (!stations) return {};
    return stations.reduce((acc: Record<string, any>, station) => {
      if (station.id) {
        acc[station.id] = station;
      }
      return acc;
    }, {});
  }, [stations]);

  // Create journey options for dropdown
  const journeyOptions = React.useMemo(() => {
    if (!p2pJourneys || p2pJourneys.length === 0) return [];
    
    return p2pJourneys.map((journey: any) => {
      const startStation = journey.startStationId ? stationsMap[journey.startStationId] : null;
      const endStation = journey.endStationId ? stationsMap[journey.endStationId] : null;
      const startName = startStation?.name || journey.startStationId;
      const endName = endStation?.name || journey.endStationId;
      
      return {
        value: journey.id,
        label: `${startName} → ${endName} (${journey.basePrice.toLocaleString()} VND)`,
        journey,
      };
    });
  }, [p2pJourneys, stationsMap]);

  return (
    <Create 
      saveButtonProps={{
        loading: checkoutMutation.isPending,
        icon: <ShoppingCartOutlined />,
        children: "Process Order",
        onClick: () => form.submit(),
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {/* Cash Warning */}
        <Alert
          message="Important Notice for Staff"
          description="Please ensure you have received the cash payment from the customer before processing this order. This is an offline cash transaction."
          type="warning"
          icon={<ShoppingCartOutlined />}
          showIcon
          closable
          style={{ marginBottom: 24 }}
        />

        <Card title="Order Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Text strong>Payment Method:</Text>
              <br />
              <Text>Cash Payment</Text>
            </div>
            <div>
              <Text strong>Ticket Type:</Text>
              <br />
              <Text>Point-to-Point (P2P) Tickets</Text>
            </div>
          </div>
        </Card>

        <Card title="Ticket Selection" className="mt-4">
          <Form.List name="items" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    type="inner"
                    size="small"
                    title={`Ticket ${name + 1}`}
                    extra={
                      fields.length > 1 ? (
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                        >
                          Remove
                        </Button>
                      ) : null
                    }
                    style={{ marginBottom: 16 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        {...restField}
                        name={[name, "p2pJourneyId"]}
                        label="Journey Route"
                        rules={[
                          { required: true, message: "Please select a journey route" },
                        ]}
                      >
                        <Select
                          placeholder="Select journey route"
                          loading={isLoadingJourneys || isLoadingStations}
                          options={journeyOptions}
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label?.toLowerCase().includes(input.toLowerCase()) ?? false)
                          }
                        />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "quantity"]}
                        label="Quantity"
                        rules={[{ required: true, message: "Please enter quantity" }]}
                        initialValue={1}
                      >
                        <InputNumber
                          min={1}
                          max={10}
                          placeholder="Enter quantity"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </div>
                  </Card>
                ))}
                
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Another Ticket
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        <Card title="Order Summary" className="mt-4">
          <div className="bg-gray-50 p-4 rounded">
            <div className="flex justify-between items-center mb-2">
              <Text>Payment Method:</Text>
              <Text strong>Cash</Text>
            </div>
            <div className="flex justify-between items-center mb-2">
              <Text>Processing Mode:</Text>
              <Text strong>Offline (Staff)</Text>
            </div>
            <div className="flex justify-between items-center">
              <Text>Total:</Text>
              <Text strong>{total.toLocaleString()} VND</Text>
            </div>
          </div>
        </Card>
      </Form>
    </Create>
  );
};