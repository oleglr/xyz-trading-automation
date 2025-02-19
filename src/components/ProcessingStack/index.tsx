import { Card, Progress, Typography, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import './styles.scss';

const { Text } = Typography;

export interface ProcessInfo {
  id: string;
  sessionId: string;
  completedTrades: number;
  totalTrades: number;
  profit: number;
  tradeType: string;
  timestamp: number;
}

function ProcessingCard({ process }: { process: ProcessInfo }) {
  const [fadeOut, setFadeOut] = useState(false);
  const progress = Math.round((process.completedTrades / process.totalTrades) * 100);
  const profitColor = process.profit >= 0 ? 'var(--success-color)' : 'var(--error-color)';

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 6700); // Start fade out before removal

    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className={`processing-card ${fadeOut ? 'fade-out' : ''}`}>
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <div className="processing-card-header">
          <Text className="session-id">Session: {process.sessionId}</Text>
          <LoadingOutlined className="processing-icon" />
        </div>
        
        <div className="processing-card-content">
          <div className="trade-info">
            <Text>Trades: {process.completedTrades}/{process.totalTrades}</Text>
            <Text style={{ color: profitColor }}>
              {process.profit >= 0 ? '+' : ''}{process.profit.toFixed(2)} USD
            </Text>
          </div>
          
          <Text className="trade-type">{process.tradeType}</Text>
          
          <Progress 
            percent={progress}
            status="active"
            strokeColor="var(--accent-color)"
            trailColor="var(--slider-rail-color)"
          />
        </div>
      </Space>
    </Card>
  );
}

interface ProcessingStackProps {
  processes: ProcessInfo[];
}

export default function ProcessingStack({ processes }: ProcessingStackProps) {
  if (processes.length === 0) return null;

  return (
    <div className="processing-stack">
      {processes.map(process => (
        <ProcessingCard key={process.id} process={process} />
      ))}
    </div>
  );
}
