import React, { useState } from 'react';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { PageTitle } from '../PageTitle';
import { BotCard } from './components/BotCard/index';
import './styles.scss';

// Mock data for demonstration
const mockBots = [
  {
    id: '1',
    name: 'Martingale acc test',
    market: 'Volatility 100 (1s) Index',
    tradeType: 'Rise/Fall',
    strategy: 'Repeat',
    params: [
      { key: 'repeat_trade', label: 'Repeat trade', value: 2 },
      { key: 'initial_stake', label: 'Initial stake', value: '10.00' },
      { key: 'take_profit', label: 'Take profit', value: '100.00' },
      { key: 'stop_loss', label: 'Stop loss', value: '50.00' }
    ]
  },
  {
    id: '2',
    name: 'Martingale acc test',
    market: 'Volatility 100 (1s) Index',
    tradeType: 'Rise/Fall',
    strategy: 'Repeat',
    params: [
      { key: 'repeat_trade', label: 'Repeat trade', value: 3 },
      { key: 'initial_stake', label: 'Initial stake', value: '15.00' }
    ]
  },
  {
    id: '3',
    name: 'Martingale acc test',
    market: 'Volatility 100 (1s) Index',
    tradeType: 'Rise/Fall',
    strategy: 'Martingale',
    params: [
      { key: 'repeat_trade', label: 'Repeat trade', value: 2 },
      { key: 'initial_stake', label: 'Initial stake', value: '10.00' },
      { key: 'multiplier', label: 'Multiplier', value: 2.5 }
    ]
  },
  {
    id: '4',
    name: 'Martingale acc test',
    market: 'Volatility 100 (1s) Index',
    tradeType: 'Rise/Fall',
    strategy: "D'Alembert",
    params: [
      { key: 'repeat_trade', label: 'Repeat trade', value: 2 },
      { key: 'initial_stake', label: 'Initial stake', value: '10.00' },
      { key: 'step_size', label: 'Step size', value: '5.00' }
    ]
  },
  {
    id: '5',
    name: 'Martingale acc test',
    market: 'Volatility 100 (1s) Index',
    tradeType: 'Rise/Fall',
    strategy: "Oscar's Grind",
    params: [
      { key: 'repeat_trade', label: 'Repeat trade', value: 2 },
      { key: 'initial_stake', label: 'Initial stake', value: '10.00' },
      { key: 'step_size', label: 'Step size', value: '1.00' },
      { key: 'target_profit', label: 'Target profit', value: '20.00' }
    ]
  },
  {
    id: '6',
    name: 'Martingale acc test',
    market: 'Volatility 100 (1s) Index',
    tradeType: 'Rise/Fall',
    strategy: 'Fibonacci',
    params: [
      { key: 'repeat_trade', label: 'Repeat trade', value: 2 },
      { key: 'initial_stake', label: 'Initial stake', value: '10.00' },
      { key: 'max_level', label: 'Max level', value: 5 }
    ]
  }
];

export function Bots() {
  const [bots] = useState(mockBots);

  const handleRunBot = (botId: string) => {
    console.log(`Running bot ${botId}`);
    // Implement bot running logic here
  };

  const handleAddBot = () => {
    console.log('Add new bot');
    // Implement adding new bot logic here
  };

  const handleSearchBot = () => {
    console.log('Search bots');
    // Implement search functionality here
  };

  const handleMoreOptions = (botId: string) => {
    console.log(`More options for bot ${botId}`);
    // Implement more options logic here
  };

  return (
    <div className="bots-container">
      <div className="bots-header">
        <PageTitle title="Bots list" />
        <div className="bots-actions">
          <Button
            type="text"
            shape="circle"
            icon={<SearchOutlined />}
            className="bots-action-btn"
            onClick={handleSearchBot}
          />
          <Button
            type="text"
            shape="circle"
            icon={<PlusOutlined />}
            className="bots-action-btn"
            onClick={handleAddBot}
          />
        </div>
      </div>

      <div className="bots-list">
        {bots.map(bot => (
          <BotCard
            key={bot.id}
            bot={bot}
            onRun={() => handleRunBot(bot.id)}
            onMoreOptions={() => handleMoreOptions(bot.id)}
          />
        ))}
      </div>
    </div>
  );
}
