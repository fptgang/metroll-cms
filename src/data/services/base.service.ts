import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { auth } from "../../utils/firebase";
import { PageDto, PageableDto, ErrorResponse } from "../interfaces";

export class BaseService {
  protected client: AxiosInstance;
  protected baseUrl: string;

  constructor(
    baseUrl: string = import.meta.env.VITE_API_URL || "http://localhost:8080"
  ) {
    this.baseUrl = baseUrl;
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use(
      async (config) => {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          auth.signOut();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic GET method
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  // Generic POST method
  protected async post<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  // Generic PUT method
  protected async put<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  // Generic DELETE method
  protected async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Generic paginated GET method
  protected async getPage<T>(
    url: string,
    pageable?: PageableDto,
    filters?: Record<string, any>
  ): Promise<PageDto<T>> {
    const params: Record<string, any> = {};

    if (pageable) {
      params.page = pageable.page;
      params.size = pageable.size;
      if (pageable.sort) {
        Object.entries(pageable.sort).forEach(([field, direction]) => {
          params.sort = `${field},${direction.toLowerCase()}`;
        });
      }
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params[key] = value;
        }
      });
    }

    return this.get<PageDto<T>>(url, { params });
  }

  // Handle API errors
  protected handleError(error: any): ErrorResponse {
    if (error.response?.data?.error) {
      return { error: error.response.data.error };
    }
    if (error.response?.data?.message) {
      return { error: error.response.data.message };
    }
    if (error.message) {
      return { error: error.message };
    }
    return { error: "An unknown error occurred" };
  }
}
