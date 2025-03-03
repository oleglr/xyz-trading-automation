import React from 'react';
import { Button } from 'antd';
import { MoreOutlined, CaretRightOutlined } from '@ant-design/icons';
import './styles.scss';

interface BotParam {
  key: string;
  label: string;
  value: string | number;
}

interface Bot {
  id: string;
  name: string;
  market: string;
  tradeType: string;
  strategy: string;
  params: BotParam[];
}

interface BotCardProps {
  bot: Bot;
  onRun: () => void;
  onMoreOptions: () => void;
}

export function BotCard({ bot, onRun, onMoreOptions }: BotCardProps) {
  return (
    <div className="bot-card">
      <div className="bot-card__header">
        <h3 className="bot-card__title">{bot.name}</h3>
        <Button
          type="text"
          icon={<MoreOutlined />}
          className="bot-card__more-btn"
          onClick={onMoreOptions}
        />
      </div>
      
      <div className="bot-card__market">
        {bot.market} | {bot.tradeType}
      </div>
      
      <div className="bot-card__footer">
        <div className="bot-card__params-scroll">
          <div className="bot-card__strategy-tag">
            {bot.strategy}
          </div>
          
          {bot.params.map((param) => (
            <div key={param.key} className="bot-card__param-value">
              {param.label}: {param.value}
            </div>
          ))}
        </div>
        
        <Button
          type="primary"
          icon={<CaretRightOutlined />}
          className="bot-card__run-btn"
          onClick={onRun}
        >
          Run
        </Button>
      </div>
    </div>
  );
}
