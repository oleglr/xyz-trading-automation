import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Alert, Spin, Typography } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { TradeInfo } from '../../types/trade';
import { PositionsFilters } from '../../types/positions';
import { tradeService } from '../../services/trade/tradeService';
import TradeFilters from './components/TradeFilters';
import TradeGrid from './components/TradeGrid';
import './styles.scss';

const { Title } = Typography;

const DEFAULT_FILTERS: PositionsFilters = {
  strategy: null,
  profitStatus: 'all',
  sortBy: 'time',
  sortDirection: 'desc',
};

const Positions: React.FC = () => {
  // TODO: Future implementation will use WebSocket connection for real-time updates
  const hasFetched = useRef(false);
  const [trades, setTrades] = useState<TradeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PositionsFilters>(DEFAULT_FILTERS);

  const fetchTrades = useCallback(async () => {
    try {
      const response = await tradeService.checkTradeStatus('*');
      if (response && Array.isArray(response.tradeinfo_list)) {
        setTrades(response.tradeinfo_list);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch trading positions. Please try again later.');
      console.error('Error fetching trades:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchTrades();
      hasFetched.current = true;
    }
  }, [fetchTrades]);

  const handleFiltersChange = (newFilters: PositionsFilters) => {
    setFilters(newFilters);
  };

  const getFilteredTrades = () => {
    let filteredTrades = [...trades];

    // Apply strategy filter
    if (filters.strategy) {
      filteredTrades = filteredTrades.filter(
        trade => trade.strategy === filters.strategy
      );
    }

    // Apply profit status filter
    if (filters.profitStatus !== 'all') {
      filteredTrades = filteredTrades.filter(trade => {
        if (filters.profitStatus === 'profit') {
          return trade.total_profit > 0;
        }
        return trade.total_profit < 0;
      });
    }

    // Apply sorting
    filteredTrades.sort((a, b) => {
      const multiplier = filters.sortDirection === 'asc' ? 1 : -1;
      
      if (filters.sortBy === 'time') {
        return multiplier * (
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
      }
      
      return multiplier * (a.total_profit - b.total_profit);
    });

    return filteredTrades;
  };

  const filteredTrades = getFilteredTrades();

  return (
    <div className="positions">
      <div className="positions__header">
        <Title level={1}>Trading Positions</Title>
        <TradeFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          loading={loading}
        />
      </div>

      <div className="positions__content">
        {error ? (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className="positions__error"
          />
        ) : (
          <>
            <TradeGrid
              trades={filteredTrades}
              loading={loading}
              onClose={(sessionId) => {
                // TODO: Implement close position when API is ready
                console.log('Closing position:', sessionId);
              }}
            />
            {loading && (
              <div className="positions__loading">
                <Spin size="large" />
              </div>
            )}
            {!loading && filteredTrades.length === 0 && (
              <div className="positions__empty">
                <SwapOutlined />
                <Title level={3}>No Active Positions</Title>
                <p>There are currently no active trading positions to display.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Positions;