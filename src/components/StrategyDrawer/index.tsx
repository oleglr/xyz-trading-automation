import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { StrategyForm } from '../StrategyForm';
import { FormConfig } from '../../types/form';
import './styles.scss';

import { StrategyDrawerProps, SYMBOL_FIELD, STRATEGY_PARAMS } from '../../types/strategy';

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
