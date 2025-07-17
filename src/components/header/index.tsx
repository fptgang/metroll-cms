import React from "react";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { Layout, Space, Avatar, Typography, Tag, Button, Dropdown, MenuProps } from "antd";
import { UserOutlined, LogoutOutlined, DownOutlined } from "@ant-design/icons";
import { AccountRole } from "../../data/types/enums";

const { Header } = Layout;
const { Text } = Typography;

interface UserIdentity {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: AccountRole;
}

export const ThemedHeader: React.FC = () => {
  const { data: user } = useGetIdentity<UserIdentity>();
  const { mutate: logout } = useLogout();

  const getRoleColor = (role: AccountRole) => {
    switch (role) {
      case AccountRole.ADMIN:
        return "red";
      case AccountRole.STAFF:
        return "blue";
      case AccountRole.CUSTOMER:
        return "green";
      default:
        return "default";
    }
  };

  const handleLogout = () => {
    logout();
  };

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'logout',
      label: (
        <span>
          <LogoutOutlined style={{ marginRight: 8 }} />
          Logout
        </span>
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div style={{ flex: 1 }} />
      
      <Space size="middle" align="center">
        {user && (
          <>
            <Avatar 
              size="small" 
              icon={<UserOutlined />} 
              src={user.avatar}
              style={{ backgroundColor: '#1890ff' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Text strong style={{ fontSize: '14px', lineHeight: '20px' }}>
                {user.name}
              </Text>
              <Tag 
                color={getRoleColor(user.role)} 
                style={{ fontSize: '11px', lineHeight: '16px', margin: 0 }}
              >
                {user.role}
              </Tag>
            </div>
            <Dropdown 
              menu={{ items: dropdownItems }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button 
                type="text" 
                icon={<DownOutlined />} 
                size="small"
                style={{ padding: '4px 8px' }}
              />
            </Dropdown>
          </>
        )}
      </Space>
    </Header>
  );
};

export default ThemedHeader; 