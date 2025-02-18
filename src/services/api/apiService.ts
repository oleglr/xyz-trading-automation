import axios, { AxiosInstance, AxiosError, AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import { API_CONFIG } from '../../config/api.config';

class ApiService {
  private static instance: ApiService;
  private api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'authorize': 'your-auth-token',
        'loginid': 'your-login-id',
        'deriv-url': 'your-deriv-url',
        'auth-url': 'your-auth-url',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
        }
        return Promise.reject(error);
      }
    );
  }

  private mergeHeaders(customHeaders?: RawAxiosRequestHeaders): RawAxiosRequestHeaders {
    return {
      ...this.api.defaults.headers.common,
      ...customHeaders,
    };
  }

  public async get<T>(url: string, params?: object, headers?: RawAxiosRequestHeaders): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, { 
      params,
      headers: this.mergeHeaders(headers)
    });
    return response.data;
  }

  public async post<T>(url: string, data?: object, headers?: RawAxiosRequestHeaders): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, {
      headers: this.mergeHeaders(headers)
    });
    return response.data;
  }

  public async put<T>(url: string, data?: object, headers?: RawAxiosRequestHeaders): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, {
      headers: this.mergeHeaders(headers)
    });
    return response.data;
  }

  public async delete<T>(url: string, headers?: RawAxiosRequestHeaders): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, {
      headers: this.mergeHeaders(headers)
    });
    return response.data;
  }

  public async patch<T>(url: string, data?: object, headers?: RawAxiosRequestHeaders): Promise<T> {
    const response: AxiosResponse<T> = await this.api.patch(url, data, {
      headers: this.mergeHeaders(headers)
    });
    return response.data;
  }
}

export const apiService = ApiService.getInstance();
