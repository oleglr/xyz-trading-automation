import { apiService } from '../api/apiService';
import { API_CONFIG, API_ENDPOINTS } from '../../config/api.config';
import type { 
  RepeatTradeRequest, 
  RepeatTradeResponse, 
  TradeStatus,
  TradeError
} from '../../types/trade';

class TradeService {
  private static instance: TradeService;
  private retryAttempts: number = API_CONFIG.RETRY_ATTEMPTS;

  private constructor() {}

  public static getInstance(): TradeService {
    if (!TradeService.instance) {
      TradeService.instance = new TradeService();
    }
    return TradeService.instance;
  }

  /**
   * Starts a repeat trade session
   * @param request The trade request parameters
   * @returns Promise with the trade response
   * @throws TradeError if the request fails
   */
  public async startRepeatTrade(request: RepeatTradeRequest): Promise<RepeatTradeResponse> {
    const headers = {
      'authorize': import.meta.env.VITE_Authorize,
      'loginid': import.meta.env.VITE_Login_Id,
      'deriv-url': import.meta.env.VITE_Deriv_Url,
      'auth-url': import.meta.env.VITE_Auth_Url,
    };

    return await this.retryOperation(() => 
      apiService.post<RepeatTradeResponse>(
        API_ENDPOINTS.REPEAT_TRADE,
        request,
        headers
      )
    );
  }

  /**
   * Checks the status of a trading session
   * @param symbol The trading symbol to check
   * @returns Promise with the trade status
   * @throws TradeError if the request fails
   */
  public async checkTradeStatus(symbol: string): Promise<TradeStatus> {
    const headers = {
      'loginid': import.meta.env.VITE_Login_Id,
      'authorize': import.meta.env.VITE_Authorize,
      'auth-url': import.meta.env.VITE_Auth_Url,
    };

    return await this.retryOperation(() =>
      apiService.get<TradeStatus>(
        `${API_ENDPOINTS.IS_TRADING}/${symbol}`,
        undefined,
        headers
      )
    );
  }

  /**
   * Stops an active trading session
   * @param symbol The trading symbol to stop
   * @returns Promise that resolves when trading is stopped
   * @throws TradeError if the request fails
   */
  public async stopTrading(symbol: string): Promise<void> {
    const headers = {
      'loginid': import.meta.env.VITE_Login_Id,
      'authorize': import.meta.env.VITE_Authorize,
      'deriv-url': import.meta.env.VITE_Deriv_Url,
      'auth-url': import.meta.env.VITE_Auth_Url,
    };

    await this.retryOperation(() =>
      apiService.post<void>(
        `${API_ENDPOINTS.STOP_TRADING}/${symbol}`,
        undefined,
        headers
      )
    );
  }

  /**
   * Generic retry operation for API calls
   * @param operation The async operation to retry
   * @returns Promise with the operation result
   * @throws The last error encountered after all retry attempts
   */
  private async retryOperation<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        console.error(`Attempt ${attempt} failed:`, error);
        
        // Don't wait on the last attempt
        if (attempt === this.retryAttempts) break;
        
        // Exponential backoff: wait longer between each retry
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // If we get here, all retries failed
    throw new Error(
      `Operation failed after ${this.retryAttempts} attempts. Last error: ${lastError?.message}`
    );
  }

  /**
   * Validates the required environment variables are present
   * @throws Error if any required variables are missing
   */
  private validateEnvironmentVariables(): void {
    const required = [
      'VITE_Authorize',
      'VITE_Login_Id',
      'VITE_Deriv_Url',
      'VITE_Auth_Url'
    ];

    const missing = required.filter(key => !import.meta.env[key]);
    
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`
      );
    }
  }
}

// Export singleton instance
export const tradeService = TradeService.getInstance();