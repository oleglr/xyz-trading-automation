import axios, { AxiosInstance, AxiosError, AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import { API_CONFIG } from '../../config/api.config';
// Import authStore if needed in the future
// import { authStore } from '../../stores/authStore';

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
        'Authorization': `Bearer ${API_CONFIG.CHAMPION_TOKEN}`
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
        // Add common query parameters to all requests
        if (!config.params) {
          config.params = {};
        }
        
        config.params = this.addCommonParams(config.params);
        
        // Log request for debugging
        console.log('Champion API Request:', {
          url: config.url,
          method: config.method,
          headers: config.headers,
          params: config.params,
          data: config.data
        });
        return config;
      },
      (error) => {
        console.error('Champion API Request error:', error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        console.log('Champion API Response:', {
          url: response.config.url,
          status: response.status,
          data: response.data
        });
        return response;
      },
      (error: AxiosError) => {
        console.error('Champion API Response error:', {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data
        });
        
        // Enhanced error handling for Champion API
        if (error.response?.status === 401) {
          console.error('Champion API: Unauthorized access - Invalid token');
        } else if (error.response?.status === 400) {
          console.error('Champion API: Bad request - Check request parameters');
        } else if (error.response?.status === 404) {
          console.error('Champion API: Resource not found');
        } else if (error.response?.status === 500) {
          console.error('Champion API: Server error');
        }
        
        // Implement retry logic for transient errors
        if (error.response?.status === 429 || error.response?.status === 503) {
          console.warn('Champion API: Rate limited or service unavailable, will retry');
          // Retry logic would be implemented here
        }
        
        return Promise.reject(error);
      }
    );
  }

  private mergeHeaders(customHeaders?: RawAxiosRequestHeaders): RawAxiosRequestHeaders {
    // Only include the required headers as per Postman collection
    const requiredHeaders: RawAxiosRequestHeaders = {
      'Authorization': `Bearer ${API_CONFIG.CHAMPION_TOKEN}`,
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    };
    
    // Add any custom headers, which will override the defaults if there are duplicates
    return {
      ...requiredHeaders,
      ...customHeaders,
    };
  }

  private addCommonParams(params?: object): object {
    return {
      account_uuid: API_CONFIG.ACCOUNT_UUID,
      champion_url: API_CONFIG.CHAMPION_API_URL,
      ...params,
    };
  }

  public async get<T>(url: string, params?: object, headers?: RawAxiosRequestHeaders): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, {
      params: this.addCommonParams(params),
      headers: this.mergeHeaders(headers)
    });
    return response.data;
  }

  public async post<T>(url: string, data?: object, headers?: RawAxiosRequestHeaders, params?: object): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, {
      params: this.addCommonParams(params),
      headers: this.mergeHeaders(headers)
    });
    return response.data;
  }

  public async put<T>(url: string, data?: object, headers?: RawAxiosRequestHeaders, params?: object): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, {
      params: this.addCommonParams(params),
      headers: this.mergeHeaders(headers)
    });
    return response.data;
  }

  public async delete<T>(url: string, headers?: RawAxiosRequestHeaders, params?: object): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, {
      params: this.addCommonParams(params),
      headers: this.mergeHeaders(headers)
    });
    return response.data;
  }

  public async patch<T>(url: string, data?: object, headers?: RawAxiosRequestHeaders, params?: object): Promise<T> {
    const response: AxiosResponse<T> = await this.api.patch(url, data, {
      params: this.addCommonParams(params),
      headers: this.mergeHeaders(headers)
    });
    return response.data;
  }

}

export const apiService = ApiService.getInstance();
