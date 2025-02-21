import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { StrategyForm } from '../StrategyForm';
import { RepeatTradeForm } from '../RepeatTradeForm';
import './styles.scss';

interface Strategy {
  id: string;
  title: string;
  description: string;
}

interface FormValues {
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

interface StrategyDrawerProps {
  strategy: Strategy | null;
  onClose: () => void;
  onSubmit: (values: FormValues) => void;
}

export function StrategyDrawer({ strategy, onClose, onSubmit }: StrategyDrawerProps) {
  if (!strategy) return null;

  const renderForm = () => {
    switch (strategy.id) {
      case 'repeat-trade':
        return <RepeatTradeForm onSubmit={onSubmit} />;
      default:
        return <StrategyForm onSubmit={(values) => onSubmit({
          amount: values.delta * 100,
          basis: 'payout',
          contract_type: 'CALL',
          currency: 'USD',
          symbol: 'R_100',
          proposal: values.dte
        })} />;
    }
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
          {renderForm()}
        </div>
      </div>
    </>
  );
}
