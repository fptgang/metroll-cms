import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Select,
  Spin,
  Upload,
  message,
  Modal,
} from "antd";
import {
  SaveOutlined,
  ArrowLeftOutlined,
  InboxOutlined,
  EyeOutlined,
  DeleteOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import {
  AccountDiscountAssignRequest,
  AccountRole,
  SortDirection,
} from "../../data/interfaces";
import {
  useAssignDiscountPackage,
  useDiscountPackages,
  useAccounts,
} from "../../hooks";
import { CameraCapture } from "../../components/camera";

const { Option } = Select;

export const AccountDiscountPackageAssign: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<any[]>([]);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const assignMutation = useAssignDiscountPackage();
  const location = useLocation();
  let account = location.state;
  // Get active discount packages for selection
  const { data: discountPackagesData, isLoading: loadingPackages } =
    useDiscountPackages(0, 100, {}, { status: "ACTIVE" });
  const { data: accountsData, isLoading: loadingAccounts } = useAccounts(
    0,
    100,
    {},
    { role: AccountRole.CUSTOMER, active: true }
  );

  const onFinish = async (values: any) => {
    try {
      const request: AccountDiscountAssignRequest = {
        accountId: values.accountId,
        discountPackageId: values.discountPackageId,
        document: uploadedFile || undefined,
      };

      await assignMutation.mutateAsync(request);
      navigate("/account-discount-packages");
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  // Helper function to get base64 for image preview
  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // Handle preview functionality
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  // Handle file list changes
  const handleChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);

    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj || newFileList[0];
      setUploadedFile(file);
    } else {
      setUploadedFile(null);
    }
  };

  // Handle camera capture from the CameraCapture component
  const handleCameraCapture = (file: File) => {
    // Validate the captured image
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Captured image must be smaller than 5MB!");
      return;
    }

    // Create file object for the file list
    const fileObj = {
      uid: Date.now().toString(),
      name: file.name,
      status: "done" as const,
      originFileObj: file,
    };

    setFileList([fileObj]);
    setUploadedFile(file);
    setCameraModalOpen(false);
    message.success("Photo captured successfully!");
  };

  const uploadProps = {
    name: "document",
    listType: "picture-card" as const,
    fileList: fileList,
    onPreview: handlePreview,
    onChange: handleChange,
    beforeUpload: (file: File) => {
      const isValidType = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type);
      if (!isValidType) {
        message.error("You can only upload JPG/PNG/PDF/DOC files!");
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("File must be smaller than 5MB!");
        return false;
      }
      return false; // Prevent auto upload
    },
    maxCount: 1,
  };

  const discountPackages = discountPackagesData?.content || [];
  const accounts = accountsData?.content || [];

  if (loadingPackages || loadingAccounts) {
    return (
      <Card style={{ margin: "16px" }}>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Assign Discount Package to Account"
      extra={
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/account-discount-packages")}
        >
          Back to List
        </Button>
      }
      style={{ margin: "16px" }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="accountId"
          label="Customer Account"
          rules={[
            { required: true, message: "Please select a customer account" },
          ]}
          initialValue={account?.accountId} // Use accountId from state or empty string
        >
          <Select
            placeholder="Select customer account"
            showSearch
            allowClear
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={
              accountsData?.content
                ?.filter(
                  (account) => account.role === "CUSTOMER" && account.active
                )
                .map((account) => ({
                  label: `${account.fullName} (${account.email})`,
                  value: account.id,
                })) || []
            }
          />
        </Form.Item>

        <Form.Item
          name="discountPackageId"
          label="Discount Package"
          rules={[
            { required: true, message: "Please select a discount package" },
          ]}
        >
          <Select
            placeholder="Select discount package"
            showSearch
            allowClear
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={discountPackages
              ?.filter((pkg) => pkg.status === "ACTIVE")
              .map((pkg) => ({
                label: `${pkg.name} (${(pkg.discountPercentage * 100).toFixed(
                  0
                )}% off, ${pkg.duration} days)`,
                value: pkg.id,
              }))}
          >
            {discountPackages
              .filter((pkg) => pkg.status === "ACTIVE")
              .map((pkg) => (
                <Option key={pkg.id} value={pkg.id}>
                  {pkg.name} ({(pkg.discountPercentage * 100).toFixed(0)}% off,{" "}
                  {pkg.duration} days)
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Proof Document"
          required
          rules={[
            {
              validator: (_, value) => {
                if (!uploadedFile) {
                  return Promise.reject(
                    new Error("Please upload a proof document")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Upload Component */}
            <Upload {...uploadProps}>
              {fileList.length >= 1 ? null : (
                <div>
                  <InboxOutlined />
                  <div style={{ marginTop: 8 }}>Upload Document</div>
                </div>
              )}
            </Upload>

            {/* Camera Capture Option */}
            {fileList.length === 0 && (
              <div style={{ textAlign: "center" }}>
                <div style={{ margin: "8px 0", color: "#999" }}>— OR —</div>
                <Button
                  type="dashed"
                  icon={<CameraOutlined />}
                  onClick={() => setCameraModalOpen(true)}
                  size="large"
                  style={{
                    width: "100%",
                    height: "50px",
                    borderStyle: "dashed",
                    borderColor: "#d9d9d9",
                  }}
                >
                  Take Photo with Camera
                </Button>
              </div>
            )}
          </div>

          <div style={{ marginTop: 8, color: "#666", fontSize: "12px" }}>
            Upload: JPG, PNG, PDF, DOC, DOCX (max 5MB) | Camera: Live preview
            with capture
          </div>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={assignMutation.isPending}
              disabled={!uploadedFile}
            >
              Assign Package
            </Button>
            <Button onClick={() => navigate("/account-discount-packages")}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* Preview Modal for images */}
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>

      {/* Camera Capture Modal */}
      <CameraCapture
        visible={cameraModalOpen}
        onCapture={handleCameraCapture}
        onCancel={() => setCameraModalOpen(false)}
      />
    </Card>
  );
};
