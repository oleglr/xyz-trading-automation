import React from 'react';
import { PageTitle } from '../PageTitle';
import { StrategyCard } from '../StrategyCard';
import './styles.scss';

// Sample strategy data - in a real app, this would come from an API or context
const strategies = [
  {
    id: 'repeat',
    title: 'Repeat',
    description: 'Automate and run multiple trades for each instrument.'
  },
  {
    id: 'martingale',
    title: 'Martingale',
    description: 'Increase stake after each loss to recoup prior losses with a single successful trade.'
  },
  {
    id: 'dalembert',
    title: 'D\'Alembert',
    description: 'Increase stake after a losing trade and reduce it after a successful trade by a predetermined number of units.'
  },
  {
    id: '1-3-2-6',
    title: '1-3-2-6',
    description: 'Maximizes profits through four consecutive wins, adjusting stakes from 1 to 3, 2, and 6 units, resetting after a loss or cycle completion.'
  }
];

export function StrategyList() {
  const handleStrategyClick = (strategyId: string) => {
    // Handle strategy selection
    console.log(`Strategy selected: ${strategyId}`);
  };
  
  return (
    <div className="strategy-list-page">
      <PageTitle 
        title="Create bot"
        subtitle="Start by selecting a strategy to build your bot."
      />
      
      <div className="strategy-list">
        {strategies.map(strategy => (
          <StrategyCard 
            key={strategy.id}
            title={strategy.title}
            description={strategy.description}
            onClick={() => handleStrategyClick(strategy.id)}
          />
        ))}
      </div>
    </div>
  );
}
