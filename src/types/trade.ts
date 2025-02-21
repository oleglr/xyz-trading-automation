// Trade request types
export interface RepeatTradeRequest {
  number_of_trades: number;
  proposal: number;
  amount: number;
  basis: 'stake' | 'payout';
  contract_type: string;
  currency: string;
  symbol: string;
  growth_rate: number;
  limit_order?: {
    take_profit: number;
  };
}

// Trade response types
export interface RepeatTradeResponse {
  session_id: string;
  status: string;
  symbol: string;
  trades: number;
}

// Trade status types
export interface TradeContract {
  buy_id: string;
  contract_id: string;
  profit: number;
}

export interface TradeInfo {
  contracts: TradeContract[];
  duration: number;
  end_time: string;
  initial: number;
  loss_profit: number;
  loss_threshold: number;
  number_of_trade: number;
  profit_threshold: number;
  session_id: string;
  start_time: string;
  strategy: string;
  total_profit: number;
  win_profit: number;
}

export interface TradeStatus {
  is_completed: boolean;
  login_id: string;
  session_id: string;
  strategy: string;
  symbol: string;
  trade_info: TradeInfo;
}

// Error types
export interface TradeError {
  error: string;
}

// Trade form types
export interface RepeatTradeFormValues {
  trade_type: string;
  strategy: string;
  asset: string;
  initial_stake: number;
  growth_rate: number;
  profit_threshold: number;
  loss_threshold: number;
}

// Trade status enums
export enum TradeStatusEnum {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ERROR = 'error'
}

// Contract types
export enum ContractType {
  ACCUMULATOR = 'ACCU',
  CALL = 'CALL',
  PUT = 'PUT'
}

// Trade strategy types
export enum TradeStrategy {
  REPEAT = 'repeat-trade',
  MARTINGALE = 'martingale-trade',
  THRESHOLD = 'threshold-trade'
}