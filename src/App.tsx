import { GitHubBanner, Refine, WelcomePage } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  AuthPage,
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

import "./App.css";

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
                        icon: <TagOutlined />,
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
                        canDelete: true,
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
                        <Route
                          path="edit/:id"
                          element={<div>Ticket Edit</div>}
                        />
                        <Route
                          path="show/:id"
                          element={<div>Ticket Show</div>}
                        />
                      </Route>

                      {/* Voucher Routes */}
                      <Route path="/vouchers">
                        <Route index element={<VoucherList />} />
                        <Route path="create" element={<VoucherCreate />} />
                        <Route path="edit/:id" element={<VoucherEdit />} />
                        <Route path="show/:id" element={<VoucherShow />} />
                      </Route>

                      {/* P2P Journey Routes */}
                      <Route path="/p2p-journeys">
                        <Route index element={<P2PJourneyList />} />
                        <Route path="create" element={<P2PJourneyCreate />} />
                        <Route
                          path="edit/:id"
                          element={<div>P2P Journey Edit</div>}
                        />
                        <Route
                          path="show/:id"
                          element={<div>P2P Journey Show</div>}
                        />
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
                          element={<div>Timed Ticket Plan Edit</div>}
                        />
                        <Route
                          path="show/:id"
                          element={<div>Timed Ticket Plan Show</div>}
                        />
                      </Route>

                      <Route path="*" element={<ErrorComponent />} />
                    </Route>

                    <Route
                      element={
                        <AuthPage
                          type="login"
                          title="Metroll CMS"
                          formProps={{
                            initialValues: {
                              email: "admin@metroll.com",
                              password: "password123",
                            },
                          }}
                        />
                      }
                      path="/login"
                    />
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
