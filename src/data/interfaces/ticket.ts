import { BaseEntity } from "./common";
import { TicketStatus, TicketType, ValidationType } from "../types/enums";

// Ticket DTO - mirrors TicketDto.java
export interface TicketDto extends BaseEntity {
  ticketType: TicketType;
  ticketNumber: string;
  ticketOrderDetailId: string;
  purchaseDate: string;
  validUntil: string;
  status: TicketStatus;
}

// Ticket Upsert Request - mirrors TicketUpsertRequest.java
export interface TicketUpsertRequest {
  ticketType: TicketType;
  ticketNumber: string;
  ticketOrderDetailId: string;
  validUntil: string;
}

// P2P Journey DTO - mirrors P2PJourneyDto.java
export interface P2PJourneyDto extends BaseEntity {
  startStationId: string;
  endStationId: string;
  basePrice: number;
  distance: number;
  travelTime: number;
}

// P2P Journey Create Request
export interface P2PJourneyCreateRequest {
  startStationId: string;
  endStationId: string;
  basePrice: number;
  distance: number;
  travelTime: number;
}

// P2P Journey Update Request
export interface P2PJourneyUpdateRequest {
  startStationId?: string;
  endStationId?: string;
  basePrice?: number;
  distance?: number;
  travelTime?: number;
}

// Timed Ticket Plan DTO - mirrors TimedTicketPlanDto.java
export interface TimedTicketPlanDto extends BaseEntity {
  name: string;
  validDuration: number;
  basePrice: number;
}

// Timed Ticket Plan Create Request
export interface TimedTicketPlanCreateRequest {
  name: string;
  validDuration: number;
  basePrice: number;
}

// Timed Ticket Plan Update Request
export interface TimedTicketPlanUpdateRequest {
  name?: string;
  validDuration?: number;
  basePrice?: number;
}

// Ticket Validation DTO - mirrors TicketValidationDto.java
export interface TicketValidationDto extends BaseEntity {
  stationId: string;
  ticketId: string;
  validationType: ValidationType;
  validationTime: string;
  validatorId: string; // Changed from deviceId to validatorId to match API docs
}

// Ticket Validation Create Request - simplified to match API docs
export interface TicketValidationCreateRequest {
  ticketId: string;
  validationType: ValidationType;
}

// Ticket Validation Filter Options
export interface TicketValidationFilter {
  search?: string; // Search term for ticketId, stationId, or validatorId
  stationCode?: string; // Filter by station code
  startDate?: string; // Filter validations from this date/time (ISO string)
  endDate?: string; // Filter validations until this date/time (ISO string)
  validationType?: ValidationType; // Filter by validation type
}

// Ticket Summary for Dashboard
export interface TicketSummary {
  totalTickets: number;
  validTickets: number;
  usedTickets: number;
  expiredTickets: number;
  cancelledTickets: number;
  p2pTickets: number;
  timedTickets: number;
}

// Ticket Filter Options
export interface TicketFilter {
  search?: string;
  ticketType?: TicketType;
  status?: TicketStatus;
  validAfter?: string;
  validBefore?: string;
  purchaseAfter?: string;
  purchaseBefore?: string;
}
