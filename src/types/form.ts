// Field types
export type FieldType = 'text' | 'number' | 'number-prefix' | 'select';
export type PrefixType = 'currency' | 'percentage';

// Basic field configuration
export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  prefixType?: PrefixType; // For number-prefix fields
  options?: { value: string; label: string }[]; // For select fields
}

export interface FormConfig {
  fields: FieldConfig[];
}

// Form values type
export interface StrategyFormProps {
  config: FormConfig;
  onSubmit: (values: FormValues) => Promise<void>;
  strategyType: string;
  tradeType: string;
}

export interface FormValues {
  [key: string]: string | number | undefined;
  asset?: string;
  initial_stake?: number;
}
