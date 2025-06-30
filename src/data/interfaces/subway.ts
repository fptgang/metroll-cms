// Subway Service Interface Definitions

// Station Enums and Types
export enum StationStatus {
  OPERATIONAL = "OPERATIONAL",
  UNDER_MAINTENANCE = "UNDER_MAINTENANCE",
  CLOSED = "CLOSED",
}

export enum LineStatus {
  OPERATIONAL = "OPERATIONAL",
  PLANNED = "PLANNED",
  UNDER_MAINTENANCE = "UNDER_MAINTENANCE",
  CLOSED = "CLOSED",
}

// Station Interfaces
export interface LineStationInfoDto {
  lineCode: string;
  code: string;
  sequence: number;
}

export interface StationDto {
  id?: string;
  code: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  status: StationStatus;
  description?: string;
  lineStationInfos: LineStationInfoDto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface StationQueryParam {
  name?: string;
  code?: string;
  status?: StationStatus;
  lineCode?: string;
}

// Metro Line Interfaces
export interface SegmentDto {
  sequence: number;
  distance: number;
  travelTime: number;
  description?: string;
  lineId: string;
  startStation: StationDto;
  startStationCode: string;
  startStationSequence: number;
  endStation: StationDto;
  endStationCode: string;
  endStationSequence: number;
}

export interface SegmentRequest {
  sequence: number;
  distance: number;
  travelTime: number;
  description?: string;
  startStationCode: string;
  endStationCode: string;
}

export interface MetroLineDto {
  id: string;
  code: string;
  name: string;
  color: string;
  operatingHours: string;
  status: LineStatus;
  description?: string;
  segments: SegmentDto[];
  createdAt: string;
  updatedAt: string;
}

export interface MetroLineRequest {
  id?: string;
  code: string;
  name: string;
  color: string;
  operatingHours: string;
  status?: LineStatus;
  description?: string;
  segments: SegmentRequest[];
}

export interface MetroLineQueryParam {
  name?: string;
  code?: string;
  status?: LineStatus;
}

// Filter interfaces for API requests
export interface StationFilter extends StationQueryParam {
  // Additional filter properties if needed
}

export interface MetroLineFilter extends MetroLineQueryParam {
  // Additional filter properties if needed
}
