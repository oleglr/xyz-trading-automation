import { useEffect, useState } from 'react';
import { useBalance } from '../../contexts/BalanceContext';
import { balanceService } from '../../services/balance/balanceService';
import './styles.scss';

interface BalanceUpdatesProps {
  showHistory?: boolean;
}

/**
 * BalanceUpdates: Component to display real-time balance updates
 * Inputs: { showHistory: boolean } - Whether to show balance update history
 * Output: JSX.Element - Balance updates display
 */
export function BalanceUpdates({ showHistory = false }: BalanceUpdatesProps) {
  const { balanceData, isLoading, error } = useBalance();
  const [updates, setUpdates] = useState<Array<{ timestamp: string; balance: string; change: string }>>([]);
  
  // Track balance updates
  useEffect(() => {
    if (balanceData && showHistory) {
      setUpdates(prev => [
        {
          timestamp: balanceData.timestamp,
          balance: balanceData.balance,
          change: balanceData.change
        },
        ...prev.slice(0, 9) // Keep last 10 updates
      ]);
    }
  }, [balanceData, showHistory]);

  if (isLoading && !balanceData) {
    return <div className="balance-updates balance-updates--loading">Loading balance data...</div>;
  }

  if (error) {
    return <div className="balance-updates balance-updates--error">Error: {error}</div>;
  }

  if (!balanceData) {
    return <div className="balance-updates balance-updates--empty">No balance data available</div>;
  }

  return (
    <div className="balance-updates">
      <div className="balance-updates__current">
        <div className="balance-updates__label">Current Balance:</div>
        <div className="balance-updates__value">
          {balanceService.formatBalance(balanceData.balance)} {balanceData.currency}
        </div>
        {balanceData.change !== "0.00" && (
          <div className={`balance-updates__change ${
            balanceService.getBalanceChangeType(balanceData.change) === 'positive'
              ? 'balance-updates__change--positive'
              : 'balance-updates__change--negative'
          }`}>
            {parseFloat(balanceData.change) > 0 ? '+' : ''}{balanceData.change}
          </div>
        )}
        <div className="balance-updates__timestamp">
          Last updated: {balanceService.formatTimestamp(balanceData.timestamp)}
        </div>
      </div>

      {showHistory && updates.length > 1 && (
        <div className="balance-updates__history">
          <h4 className="balance-updates__history-title">Recent Updates</h4>
          <ul className="balance-updates__history-list">
            {updates.slice(1).map((update, index) => (
              <li key={index} className="balance-updates__history-item">
                <span className="balance-updates__history-time">
                  {balanceService.formatTimestamp(update.timestamp)}
                </span>
                <span className="balance-updates__history-balance">
                  {balanceService.formatBalance(update.balance)}
                </span>
                {update.change !== "0.00" && (
                  <span className={`balance-updates__history-change ${
                    balanceService.getBalanceChangeType(update.change) === 'positive'
                      ? 'balance-updates__history-change--positive'
                      : 'balance-updates__history-change--negative'
                  }`}>
                    {parseFloat(update.change) > 0 ? '+' : ''}{update.change}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}