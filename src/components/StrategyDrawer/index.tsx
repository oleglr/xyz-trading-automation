import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { StrategyForm, FormConfig, FieldType, FormValues, PrefixType } from '../StrategyForm';
import './styles.scss';

interface Strategy {
  id: string;
  title: string;
  description: string;
}

interface StrategyDrawerProps {
  strategy: Strategy | null;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
}

// Static symbol field that's common to all strategies
const SYMBOL_FIELD = {
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
const STRATEGY_PARAMS: Record<string, FormConfig> = {
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

export function StrategyDrawer({ strategy, onClose, onSubmit }: StrategyDrawerProps) {
  if (!strategy) return null;

  const strategyParams = STRATEGY_PARAMS[strategy.id];
  if (!strategyParams) return null;

  // Combine the static symbol field with strategy-specific fields
  const config: FormConfig = {
    fields: [SYMBOL_FIELD, ...strategyParams.fields]
  };

  return (
    <>
      <div className="strategy-drawer__backdrop" onClick={onClose} />
      <div className="strategy-drawer strategy-drawer--open">
        <div className="strategy-drawer__header">
          <h2 className="strategy-drawer__title">Execute Strategy</h2>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
            className="strategy-drawer__close"
          />
        </div>
        <div className="strategy-drawer__body">
          <StrategyForm
            config={config}
            onSubmit={onSubmit}
            strategyType={strategy.title}
            tradeType="Accumulators"
          />
        </div>
      </div>
    </>
  );
}
