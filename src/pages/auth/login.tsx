import React, { useState } from "react";
import { Button, Form, Input, Typography, Card, message, Divider } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { useLogin } from "@refinedev/core";
import { useNavigate } from "react-router";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../utils/firebase";

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

export const FirebaseLoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { mutate: login } = useLogin<LoginFormValues>();
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);

    login(values, {
      onSuccess: () => {
        message.success("Login successful!");
        navigate("/");
      },
      onError: (error: any) => {
        message.error(error?.message || "Login failed. Please try again.");
        setLoading(false);
      },
    });
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Use the same login mutation but with Google user data
      login(
        {
          email: result.user.email || "",
          password: "google_auth", // This will be handled differently in the auth provider
        },
        {
          onSuccess: () => {
            message.success("Google login successful!");
            navigate("/");
          },
          onError: (error: any) => {
            message.error(
              error?.message || "Google login failed. Please try again."
            );
            setGoogleLoading(false);
          },
        }
      );
    } catch (error: any) {
      message.error(error?.message || "Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Card
        style={{
          width: 400,
          padding: "24px",
          borderRadius: "12px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Title level={2} style={{ color: "#1890ff", marginBottom: "8px" }}>
            Metroll CMS
          </Title>
          <Text type="secondary">Sign in to your account to continue</Text>
        </div>

        <Form
          name="login"
          initialValues={{
            email: "admin@metroll.com",
            password: "password123",
          }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Enter your email"
              size="large"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Enter your password"
              size="large"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: "16px" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
              style={{
                borderRadius: "8px",
                fontWeight: 600,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
              }}
            >
              Sign In with Email
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: "24px 0" }}>
          <Text type="secondary">or</Text>
        </Divider>

        <Button
          icon={<GoogleOutlined />}
          onClick={handleGoogleLogin}
          loading={googleLoading}
          size="large"
          block
          style={{
            borderRadius: "8px",
            fontWeight: 600,
            background: "#ffffff",
            border: "1px solid #dadce0",
            color: "#3c4043",
            marginBottom: "24px",
          }}
        >
          Continue with Google
        </Button>

        <div style={{ textAlign: "center" }}>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Powered by Firebase Authentication
          </Text>
        </div>
      </Card>
    </div>
  );
};
