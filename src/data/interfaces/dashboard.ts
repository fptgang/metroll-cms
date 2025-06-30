// Account Dashboard Response
export interface AccountDashboard {
  totalAccounts: number;
  accountsByRole: {
    ADMIN: number;
    STAFF: number;
    CUSTOMER: number;
  };
  activeAccounts: number;
  inactiveAccounts: number;
  staffWithAssignedStation: number;
  staffWithoutAssignedStation: number;
  totalDiscountPackages: number;
  activeDiscountPackages: number;
  totalVouchers: number;
  totalVoucherValue: string;
  lastUpdated: string;
}

// Ticket Dashboard Response
export interface TicketDashboard {
  totalTickets: number;
  ticketsByStatus: {
    VALID: number;
    USED: number;
    EXPIRED: number;
  };
  ticketsByType: {
    P2P: number;
    TIMED: number;
  };
  totalValidations: number;
  validationsByType: {
    ENTRY: number;
    EXIT: number;
  };
  todayValidations: number;
  totalP2PJourneys: number;
  validationsLast7Days: Record<string, number>;
  lastUpdated: string;
}

// Subway Dashboard Response
export interface SubwayDashboard {
  totalStations: number;
  totalMetroLines: number;
  totalTrains: number;
  stationsByMetroLine: Record<string, number>;
  trainsByMetroLine: Record<string, number>;
  averageStationsPerLine: number;
  averageTrainsPerLine: number;
  lastUpdated: string;
}

// Order Dashboard Response
export interface OrderDashboard {
  totalOrders: number;
  ordersByStatus: {
    COMPLETED: number;
    PENDING: number;
    FAILED: number;
  };
  totalRevenue: string;
  todayRevenue: string;
  weeklyRevenue: string;
  monthlyRevenue: string;
  totalOrderDetails: number;
  averageOrderValue: number;
  todayOrders: number;
  revenueLast7Days: Record<string, string>;
  lastUpdated: string;
}
