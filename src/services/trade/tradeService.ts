import { apiService } from '../api/apiService';
import { API_CONFIG, API_ENDPOINTS } from '../../config/api.config';
import {
  TradeStatus,
  TradeStrategy
} from '../../types/trade';
import { authStore } from '../../stores/authStore';

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
   * Executes a trading session with the specified strategy
   * @param request The trade request parameters
   * @param strategy The trading strategy to use
   * @returns Promise with the trade response
   * @throws TradeError if the request fails
   */
  public async executeTrade<TRequest extends object, TResponse>(
    request: TRequest,
    strategy: TradeStrategy
  ): Promise<TResponse> {
    const headers = authStore.getHeaders();

    // Get the appropriate endpoint based on the strategy
    const endpoint = this.getStrategyEndpoint(strategy);

    return await this.retryOperation(() => 
      apiService.post<TResponse>(
        endpoint,
        request,
        headers
      )
    );
  }

  /**
   * Gets the API endpoint for a given strategy
   * @param strategy The trading strategy
   * @returns The corresponding API endpoint
   */
  private getStrategyEndpoint(strategy: TradeStrategy): string {
    switch (strategy) {
      case TradeStrategy.REPEAT:
        return API_ENDPOINTS.REPEAT_TRADE;
      case TradeStrategy.MARTINGALE:
        return API_ENDPOINTS.Martingale_Trade;
      case TradeStrategy.THRESHOLD:
        return API_ENDPOINTS.Threshold_Trade;
      default:
        throw new Error(`Unsupported strategy: ${strategy}`);
    }
  }

  /**
   * Checks the status of all trading sessions
   * @returns Promise with the trade status
   * @throws TradeError if the request fails
   */
  public async checkTradeStatus(): Promise<TradeStatus> {
    const headers = authStore.getHeaders();

    return await this.retryOperation(() =>
      apiService.get<TradeStatus>(
        API_ENDPOINTS.IS_TRADING,
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
    const headers = authStore.getHeaders();

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
}

// Export singleton instance
export const tradeService = TradeService.getInstance();
