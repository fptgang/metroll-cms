import { BaseService } from "./base.service";
import {
  TicketDto,
  TicketUpsertRequest,
  TicketFilter,
  TicketSummary,
  TicketValidationDto,
  TicketValidationCreateRequest,
  TicketValidationFilter,
  P2PJourneyDto,
  P2PJourneyCreateRequest,
  P2PJourneyUpdateRequest,
  TimedTicketPlanDto,
  TimedTicketPlanCreateRequest,
  TimedTicketPlanUpdateRequest,
  PageDto,
  PageableDto,
  TicketStatus,
  TicketDashboard,
} from "../interfaces";

export class TicketService extends BaseService {
  private readonly endpoint = "/tickets";
  private readonly validationEndpoint = "/ticket-validations";
  private readonly journeyEndpoint = "/p2p-journeys";
  private readonly planEndpoint = "/timed-ticket-plans";

  constructor() {
    super();
  }

  // Ticket CRUD Operations
  async getTickets(
    pageable?: PageableDto,
    filters?: TicketFilter
  ): Promise<PageDto<TicketDto>> {
    try {
      return await this.getPage<TicketDto>(this.endpoint, pageable, filters);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTicketById(id: string): Promise<TicketDto> {
    try {
      return await this.get<TicketDto>(`${this.endpoint}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTicketByNumber(ticketNumber: string): Promise<TicketDto> {
    try {
      return await this.get<TicketDto>(
        `${this.endpoint}/number/${ticketNumber}`
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTicketsByOrderDetailId(orderDetailId: string): Promise<TicketDto[]> {
    try {
      return await this.get<TicketDto[]>(
        `${this.endpoint}/order-detail/${orderDetailId}`
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTicketsByStatus(status: TicketStatus): Promise<TicketDto[]> {
    try {
      return await this.get<TicketDto[]>(`${this.endpoint}/status/${status}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createTicket(ticket: TicketUpsertRequest): Promise<TicketDto> {
    try {
      return await this.post<TicketDto>(this.endpoint, ticket);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateTicketStatus(id: string, status: TicketStatus): Promise<void> {
    try {
      await this.put<void>(`${this.endpoint}/${id}/status`, null, {
        params: { status },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTicketQRCode(id: string): Promise<string> {
    try {
      return await this.get<string>(`${this.endpoint}/${id}/qrcode`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Ticket Validation Operations
  async getTicketValidations(
    pageable?: PageableDto,
    filters?: TicketValidationFilter
  ): Promise<PageDto<TicketValidationDto>> {
    try {
      return await this.getPage<TicketValidationDto>(
        this.validationEndpoint,
        pageable,
        filters
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTicketValidationById(id: string): Promise<TicketValidationDto> {
    try {
      return await this.get<TicketValidationDto>(
        `${this.validationEndpoint}/${id}`
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTicketValidationsByTicketId(
    ticketId: string
  ): Promise<TicketValidationDto[]> {
    try {
      return await this.get<TicketValidationDto[]>(
        `${this.validationEndpoint}/ticket/${ticketId}`
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTicketValidationsByStationCode(
    stationCode: string,
    pageable?: PageableDto,
    filters?: Pick<TicketValidationFilter, "search" | "startDate" | "endDate">
  ): Promise<PageDto<TicketValidationDto>> {
    try {
      return await this.getPage<TicketValidationDto>(
        `${this.validationEndpoint}/station/${stationCode}`,
        pageable,
        filters
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTicketValidationsByStationId(
    stationId: string
  ): Promise<TicketValidationDto[]> {
    try {
      return await this.get<TicketValidationDto[]>(
        `${this.validationEndpoint}/station/${stationId}`
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async validateTicket(
    validation: TicketValidationCreateRequest
  ): Promise<TicketValidationDto> {
    try {
      return await this.post<TicketValidationDto>(
        `${this.validationEndpoint}/validate`,
        validation
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // P2P Journey Operations
  async getP2PJourneys(
    pageable?: PageableDto,
    filters?: Record<string, any>
  ): Promise<PageDto<P2PJourneyDto>> {
    try {
      return await this.getPage<P2PJourneyDto>(
        this.journeyEndpoint,
        pageable,
        filters
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getP2PJourneyById(id: string): Promise<P2PJourneyDto> {
    try {
      return await this.get<P2PJourneyDto>(`${this.journeyEndpoint}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getP2PJourneyByStations(
    startStationId: string,
    endStationId: string
  ): Promise<P2PJourneyDto | null> {
    try {
      return await this.get<P2PJourneyDto>(`${this.journeyEndpoint}/stations`, {
        params: { startStationId, endStationId },
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw this.handleError(error);
    }
  }

  async createP2PJourney(
    journey: P2PJourneyCreateRequest
  ): Promise<P2PJourneyDto> {
    try {
      return await this.post<P2PJourneyDto>(this.journeyEndpoint, journey);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateP2PJourney(
    id: string,
    journey: P2PJourneyUpdateRequest
  ): Promise<P2PJourneyDto> {
    try {
      return await this.put<P2PJourneyDto>(
        `${this.journeyEndpoint}/${id}`,
        journey
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteP2PJourney(id: string): Promise<void> {
    try {
      await this.delete<void>(`${this.journeyEndpoint}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }



  // Timed Ticket Plan Operations
  async getTimedTicketPlans(
    pageable?: PageableDto,
    filters?: Record<string, any>
  ): Promise<PageDto<TimedTicketPlanDto>> {
    try {
      return await this.getPage<TimedTicketPlanDto>(
        this.planEndpoint,
        pageable,
        filters
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTimedTicketPlanById(id: string): Promise<TimedTicketPlanDto> {
    try {
      return await this.get<TimedTicketPlanDto>(`${this.planEndpoint}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createTimedTicketPlan(
    plan: TimedTicketPlanCreateRequest
  ): Promise<TimedTicketPlanDto> {
    try {
      return await this.post<TimedTicketPlanDto>(this.planEndpoint, plan);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateTimedTicketPlan(
    id: string,
    plan: TimedTicketPlanUpdateRequest
  ): Promise<TimedTicketPlanDto> {
    try {
      return await this.put<TimedTicketPlanDto>(
        `${this.planEndpoint}/${id}`,
        plan
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteTimedTicketPlan(id: string): Promise<void> {
    try {
      await this.delete<void>(`${this.planEndpoint}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Dashboard and Analytics
  async getTicketSummary(): Promise<TicketSummary> {
    try {
      // This endpoint might need to be implemented on the backend
      return await this.get<TicketSummary>(`${this.endpoint}/summary`);
    } catch (error) {
      // Fallback: calculate from paginated data
      const tickets = await this.getTickets({ page: 0, size: 1000 });
      return this.calculateSummaryFromTickets(tickets.content);
    }
  }

  // Helper method to calculate summary from ticket data
  private calculateSummaryFromTickets(tickets: TicketDto[]): TicketSummary {
    const summary = {
      totalTickets: tickets.length,
      validTickets: 0,
      usedTickets: 0,
      expiredTickets: 0,
      cancelledTickets: 0,
      p2pTickets: 0,
      timedTickets: 0,
    };

    tickets.forEach((ticket) => {
      // Count by status
      switch (ticket.status) {
        case "VALID":
          summary.validTickets++;
          break;
        case "USED":
          summary.usedTickets++;
          break;
        case "EXPIRED":
          summary.expiredTickets++;
          break;
        case "CANCELLED":
          summary.cancelledTickets++;
          break;
      }

      // Count by type
      switch (ticket.ticketType) {
        case "P2P":
          summary.p2pTickets++;
          break;
        case "TIMED":
          summary.timedTickets++;
          break;
      }
    });

    return summary;
  }

  // Search tickets
  async searchTickets(
    query: string,
    pageable?: PageableDto
  ): Promise<PageDto<TicketDto>> {
    try {
      return await this.getTickets(pageable, { search: query });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Bulk operations
  async bulkUpdateStatus(ids: string[], status: TicketStatus): Promise<void> {
    try {
      await Promise.all(ids.map((id) => this.updateTicketStatus(id, status)));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get ticket dashboard metrics
   */
  async getTicketDashboard(): Promise<TicketDashboard> {
    try {
      return await this.get<TicketDashboard>(`${this.endpoint}/dashboard`);
    } catch (error) {
      throw this.handleError(error);
    }
  }
}
