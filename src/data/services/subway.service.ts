import { BaseService } from "./base.service";
import {
  StationDto,
  StationQueryParam,
  StationFilter,
  MetroLineDto,
  MetroLineRequest,
  MetroLineQueryParam,
  MetroLineFilter,
  PageDto,
  PageableDto,
  SubwayDashboard,
} from "../interfaces";

export class SubwayService extends BaseService {
  private readonly stationPath = "/stations";
  private readonly linePath = "/lines";

  constructor() {
    super();
  }

  // Station Management APIs

  /**
   * Get paginated list of stations
   */
  async getStations(
    pageable?: PageableDto,
    filters?: StationFilter
  ): Promise<PageDto<StationDto>> {
    return this.getPage<StationDto>(
      `${this.stationPath}`,
      pageable || { page: 0, size: 10 },
      {
        status: filters?.status || "", // Default to operational stations
        code: filters?.code || "",
        name: filters?.name || "", // Use empty string if no filter provided
        lineCode: filters?.lineCode || "", // Optional filter for line code
      } as StationQueryParam
    );
  }

  /**
   * Get station by code
   */
  async getStationByCode(code: string): Promise<StationDto> {
    return this.get<StationDto>(`${this.stationPath}/${code}`);
  }

  /**
   * Create or update station
   */
  async saveStation(station: StationDto): Promise<StationDto> {
    return this.post<StationDto>(`${this.stationPath}`, station);
  }

  /**
   * Bulk create stations
   */
  async bulkCreateStations(stations: StationDto[]): Promise<StationDto[]> {
    return this.post<StationDto[]>(`${this.stationPath}/create-list`, stations);
  }

  // Metro Line Management APIs

  /**
   * Get paginated list of metro lines
   */
  async getMetroLines(
    pageable?: PageableDto,
    filters?: MetroLineFilter
  ): Promise<PageDto<MetroLineDto>> {
    return this.getPage<MetroLineDto>(
      `${this.linePath}`,
      pageable || { page: 0, size: 10 },
      {
        status: filters?.status || "", // Default to operational stations
        code: filters?.code || "",
        name: filters?.name || "", // Use empty string if no filter provided
      } as MetroLineQueryParam
    );
  }

  /**
   * Get metro line by code
   */
  async getMetroLineByCode(code: string): Promise<MetroLineDto> {
    return this.get<MetroLineDto>(`${this.linePath}/${code}`);
  }

  /**
   * Create metro line
   */
  async createMetroLine(line: MetroLineRequest): Promise<MetroLineDto> {
    return this.post<MetroLineDto>(`${this.linePath}`, line);
  }

  /**
   * Update metro line
   */
  async updateMetroLine(
    code: string,
    line: MetroLineRequest
  ): Promise<MetroLineDto> {
    return this.put<MetroLineDto>(`${this.linePath}/${code}`, line);
  }

  // Utility methods for the CMS

  /**
   * Search stations by name or code
   */
  async searchStations(
    query: string,
    pageable?: PageableDto
  ): Promise<PageDto<StationDto>> {
    const filters: StationFilter = {};

    // Try to determine if query is a code or name
    if (query.length <= 10 && query.toUpperCase() === query) {
      filters.code = query;
    } else {
      filters.name = query;
    }

    return this.getStations(pageable, filters);
  }

  /**
   * Search metro lines by name or code
   */
  async searchMetroLines(
    query: string,
    pageable?: PageableDto
  ): Promise<PageDto<MetroLineDto>> {
    const filters: MetroLineFilter = {};

    // Try to determine if query is a code or name
    if (query.length <= 10 && query.toUpperCase() === query) {
      filters.code = query;
    } else {
      filters.name = query;
    }

    return this.getMetroLines(pageable, filters);
  }

  /**
   * Get all operational stations for line creation
   */
  async getOperationalStations(): Promise<StationDto[]> {
    const result = await this.getStations(
      { page: 0, size: 1000 }, // Get a large number to fetch all operational stations
      { status: "OPERATIONAL" as any }
    );
    return result.content;
  }

  /**
   * Get subway dashboard metrics
   */
  async getSubwayDashboard(): Promise<SubwayDashboard> {
    return this.get<SubwayDashboard>(`${this.linePath}/dashboard`);
  }
}

// Export singleton instance
export const subwayService = new SubwayService();
