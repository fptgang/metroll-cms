import { GitHubBanner, Refine, WelcomePage } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from "@refinedev/antd";
import { App as AntdApp, ConfigProvider } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  TagOutlined,
  MergeOutlined,
  EnvironmentOutlined,
  ContactsOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
  CatchAllNavigate,
  NavigateToResource,
} from "@refinedev/react-router";
import { BrowserRouter, Route, Routes, Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { authProvider } from "./providers/authProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Import pages
import { AccountList } from "./pages/accounts/list";
import { AccountCreate } from "./pages/accounts/create";
import { AccountEdit } from "./pages/accounts/edit";
import { AccountShow } from "./pages/accounts/show";
import { TicketList } from "./pages/tickets/list";
import { TicketCreate } from "./pages/tickets/create";
import { VoucherList } from "./pages/vouchers/list";
import { VoucherCreate } from "./pages/vouchers/create";
import { VoucherEdit } from "./pages/vouchers/edit";
import { VoucherShow } from "./pages/vouchers/show";
import { P2PJourneyList } from "./pages/p2p-journeys/list";
import { P2PJourneyCreate } from "./pages/p2p-journeys/create";
import { TimedTicketPlanList } from "./pages/timed-ticket-plans/list";
import { TimedTicketPlanCreate } from "./pages/timed-ticket-plans/create";
import {
  StationList,
  StationCreate,
  StationEdit,
  StationShow,
} from "./pages/stations";
import {
  MetroLineList,
  MetroLineCreate,
  MetroLineEdit,
  MetroLineShow,
} from "./pages/metro-lines";
import { OrderList, OrderShow, OrderCreate, OrderEdit } from "./pages/orders";
import { StaffList } from "./pages/staff";
import { FirebaseLoginPage } from "./pages/auth/login";

import "./App.css";
import {
  TimedTicketPlanEdit,
  TimedTicketPlanShow,
} from "./pages/timed-ticket-plans";
import { P2PJourneyEdit, P2PJourneyShow } from "./pages/p2p-journeys";
import { TicketEdit, TicketShow } from "./pages/tickets";

function App() {
  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1890ff",
            },
          }}
        >
          <AntdApp>
            <QueryClientProvider client={queryClient}>
              <DevtoolsProvider>
                <Refine
                  authProvider={authProvider}
                  routerProvider={routerBindings}
                  notificationProvider={useNotificationProvider}
                  resources={[
                    {
                      name: "dashboard",
                      list: "/",
                      meta: {
                        label: "Dashboard",
                        icon: <DashboardOutlined />,
                      },
                    },
                    {
                      name: "account",
                      list: "/accounts",
                      create: "/accounts/create",
                      edit: "/accounts/edit/:id",
                      show: "/accounts/show/:id",
                      meta: {
                        label: "Accounts",
                        icon: <UserOutlined />,
                        parent: "Account Management",
                        canDelete: true,
                      },
                    },
                    {
                      name: "ticket",
                      list: "/tickets",
                      create: "/tickets/create",
                      edit: "/tickets/edit/:id",
                      show: "/tickets/show/:id",
                      meta: {
                        label: "Tickets",
                        icon: <ContactsOutlined />,
                        parent: "Ticket Management",
                        canDelete: true,
                      },
                    },
                    {
                      name: "voucher",
                      list: "/vouchers",
                      create: "/vouchers/create",
                      edit: "/vouchers/edit/:id",
                      show: "/vouchers/show/:id",
                      meta: {
                        label: "Vouchers",
                        icon: <TagOutlined />,
                        parent: "Account Management",
                        canDelete: true,
                      },
                    },
                    {
                      name: "staff",
                      list: "/staff",
                      meta: {
                        label: "Staff",
                        icon: <TeamOutlined />,
                        parent: "Account Management",
                      },
                    },
                    {
                      name: "p2p-journey",
                      list: "/p2p-journeys",
                      create: "/p2p-journeys/create",
                      edit: "/p2p-journeys/edit/:id",
                      show: "/p2p-journeys/show/:id",
                      meta: {
                        label: "P2P Journeys",
                        icon: <TagOutlined />,
                        parent: "Ticket Management",
                        canDelete: true,
                      },
                    },
                    {
                      name: "timed-ticket-plan",
                      list: "/timed-ticket-plans",
                      create: "/timed-ticket-plans/create",
                      edit: "/timed-ticket-plans/edit/:id",
                      show: "/timed-ticket-plans/show/:id",
                      meta: {
                        label: "Timed Ticket Plans",
                        icon: <TagOutlined />,
                        parent: "Ticket Management",
                        canDelete: true,
                      },
                    },
                    {
                      name: "station",
                      list: "/stations",
                      create: "/stations/create",
                      edit: "/stations/edit/:id",
                      show: "/stations/show/:id",
                      meta: {
                        label: "Stations",
                        icon: <EnvironmentOutlined />,
                        parent: "Subway Management",
                        canDelete: true,
                      },
                    },
                    {
                      name: "metro-line",
                      list: "/metro-lines",
                      create: "/metro-lines/create",
                      edit: "/metro-lines/edit/:id",
                      show: "/metro-lines/show/:id",
                      meta: {
                        label: "Metro Lines",
                        icon: <MergeOutlined />,
                        parent: "Subway Management",
                        canDelete: true,
                      },
                    },
                    {
                      name: "orders",
                      list: "/orders",
                      create: "/orders/create",
                      edit: "/orders/edit/:orderNumber",
                      show: "/orders/show/:orderNumber",
                      meta: {
                        label: "Orders",
                        icon: <ShoppingCartOutlined />,
                        parent: "Order Management",
                        canDelete: true,
                      },
                    },
                  ]}
                  options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
                    useNewQueryKeys: true,
                    projectId: "BS4brD-dWcDtG-ry1qOK",
                  }}
                >
                  <Routes>
                    <Route
                      element={
                        <ThemedLayoutV2
                          Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      }
                    >
                      <Route
                        index
                        element={<NavigateToResource resource="dashboard" />}
                      />
                      <Route path="/dashboard" element={<WelcomePage />} />

                      {/* Account Routes */}
                      <Route path="/accounts">
                        <Route index element={<AccountList />} />
                        <Route path="create" element={<AccountCreate />} />
                        <Route path="edit/:id" element={<AccountEdit />} />
                        <Route path="show/:id" element={<AccountShow />} />
                      </Route>

                      {/* Ticket Routes */}
                      <Route path="/tickets">
                        <Route index element={<TicketList />} />
                        <Route path="create" element={<TicketCreate />} />
                        <Route path="edit/:id" element={<TicketEdit />} />
                        <Route path="show/:id" element={<TicketShow />} />
                      </Route>

                      {/* Voucher Routes */}
                      <Route path="/vouchers">
                        <Route index element={<VoucherList />} />
                        <Route path="create" element={<VoucherCreate />} />
                        <Route path="edit/:id" element={<VoucherEdit />} />
                        <Route path="show/:id" element={<VoucherShow />} />
                      </Route>

                      {/* Staff Routes */}
                      <Route path="/staff">
                        <Route index element={<StaffList />} />
                      </Route>

                      {/* P2P Journey Routes */}
                      <Route path="/p2p-journeys">
                        <Route index element={<P2PJourneyList />} />
                        <Route path="create" element={<P2PJourneyCreate />} />
                        <Route path="edit/:id" element={<P2PJourneyEdit />} />
                        <Route path="show/:id" element={<P2PJourneyShow />} />
                      </Route>

                      {/* Timed Ticket Plan Routes */}
                      <Route path="/timed-ticket-plans">
                        <Route index element={<TimedTicketPlanList />} />
                        <Route
                          path="create"
                          element={<TimedTicketPlanCreate />}
                        />
                        <Route
                          path="edit/:id"
                          element={<TimedTicketPlanEdit />}
                        />
                        <Route
                          path="show/:id"
                          element={<TimedTicketPlanShow />}
                        />
                      </Route>

                      {/* Station Routes */}
                      <Route path="/stations">
                        <Route index element={<StationList />} />
                        <Route path="create" element={<StationCreate />} />
                        <Route path="edit/:id" element={<StationEdit />} />
                        <Route path="show/:id" element={<StationShow />} />
                      </Route>

                      {/* Metro Line Routes */}
                      <Route path="/metro-lines">
                        <Route index element={<MetroLineList />} />
                        <Route path="create" element={<MetroLineCreate />} />
                        <Route path="edit/:id" element={<MetroLineEdit />} />
                        <Route path="show/:id" element={<MetroLineShow />} />
                      </Route>

                      {/* Order Routes */}
                      <Route path="/orders">
                        <Route index element={<OrderList />} />
                        <Route path="create" element={<OrderCreate />} />
                        <Route
                          path="edit/:orderNumber"
                          element={<OrderEdit />}
                        />
                        <Route
                          path="show/:orderNumber"
                          element={<OrderShow />}
                        />
                      </Route>

                      <Route path="*" element={<ErrorComponent />} />
                    </Route>

                    <Route element={<FirebaseLoginPage />} path="/login" />
                    <Route
                      element={<CatchAllNavigate to="/dashboard" />}
                      path="*"
                    />
                  </Routes>
                  <RefineKbar />
                  <UnsavedChangesNotifier />
                  <DocumentTitleHandler />
                </Refine>
                <DevtoolsPanel />
              </DevtoolsProvider>
            </QueryClientProvider>
          </AntdApp>
        </ConfigProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
