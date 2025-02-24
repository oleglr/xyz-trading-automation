import { FormConfig, FormValues, FieldType, PrefixType } from './form';

export const filterButtons = [
  { key: "all", label: "All Strategies" },
  { key: "long-calls", label: "Long Calls" },
  { key: "short-puts", label: "Short Puts" },
  { key: "iron-condors", label: "Iron Condors" },
  { key: "covered-calls", label: "Covered Calls" },
  { key: "bull-spreads", label: "Bull Spreads" },
] as const;

export type FilterKey = typeof filterButtons[number]['key'];

export interface StrategyFiltersProps {
  selectedFilter: FilterKey;
  onFilterChange: (filter: FilterKey) => void;
  searchText: string;
  onSearchChange: (text: string) => void;
}

export interface Strategy {
  id: string;
  title: string;
  description: string;
  risk: "low" | "medium" | "high";
  profit: "limited" | "unlimited";
  category:
    | "all"
    | "long-calls"
    | "short-puts"
    | "iron-condors"
    | "covered-calls"
    | "bull-spreads";
  isAvailable?: boolean;
}

export interface StrategyDrawerProps {
  strategy: Strategy | null;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
}

// Static symbol field that's common to all strategies
export const SYMBOL_FIELD = {
  name: 'asset',
  label: 'Symbol',
  type: 'select' as FieldType,
  options: [
    { value: "volatility_100_1s", label: "Volatility 100 (1s) Index" },
    { value: "volatility_75_1s", label: "Volatility 75 (1s) Index" },
    { value: "volatility_50_1s", label: "Volatility 50 (1s) Index" },
    { value: "volatility_25_1s", label: "Volatility 25 (1s) Index" },
    { value: "volatility_10_1s", label: "Volatility 10 (1s) Index" }
  ]
};

// Define input parameters for each strategy
export const STRATEGY_PARAMS: Record<string, FormConfig> = {
  'repeat-trade': {
    fields: [
      {
        name: 'initial_stake',
        label: 'Initial stake',
        type: 'number-prefix' as FieldType,
        prefixType: 'currency' as PrefixType
      },
      {
        name: 'growth_rate',
        label: 'Growth rate',
        type: 'number-prefix' as FieldType,
        prefixType: 'percentage' as PrefixType
      },
      {
        name: 'profit_threshold',
        label: 'Profit threshold',
        type: 'number-prefix' as FieldType,
        prefixType: 'currency' as PrefixType
      },
      {
        name: 'loss_threshold',
        label: 'Loss threshold',
        type: 'number-prefix' as FieldType,
        prefixType: 'currency' as PrefixType
      }
    ]
  },
  'martingale-trade': {
    fields: [
      {
        name: 'initial_stake',
        label: 'Initial stake',
        type: 'number-prefix' as FieldType,
        prefixType: 'currency' as PrefixType
      },
      {
        name: 'multiplier',
        label: 'Loss multiplier',
        type: 'number-prefix' as FieldType,
        prefixType: 'percentage' as PrefixType
      },
      {
        name: 'max_trades',
        label: 'Maximum trades',
        type: 'number' as FieldType
      },
      {
        name: 'profit_target',
        label: 'Profit target',
        type: 'number-prefix' as FieldType,
        prefixType: 'currency' as PrefixType
      },
      {
        name: 'stop_loss',
        label: 'Stop loss',
        type: 'number-prefix' as FieldType,
        prefixType: 'currency' as PrefixType
      },
      {
        name: 'reset_on_win',
        label: 'Reset on win',
        type: 'select' as FieldType,
        options: [
          { value: "yes", label: 'Yes' },
          { value: "no", label: 'No' }
        ]
      }
    ]
  }
};

export interface StrategyFormValues {
  number_of_trades?: number;
  proposal?: number;
  amount?: number;
  basis?: string;
  contract_type?: string;
  currency?: string;
  symbol?: string;
  growth_rate?: number;
  limit_order?: {
    take_profit: number;
  };
}
