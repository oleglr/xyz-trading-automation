import React from 'react';
import { Button, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './styles.scss';

interface AccountHeaderProps {
  accountType: 'Real' | 'Demo';
  balance: string;
  currency: string;
  onAccountTypeChange: (type: 'Real' | 'Demo') => void;
  onDepositClick: () => void;
}

export function AccountHeader({
  accountType,
  balance,
  currency,
  onAccountTypeChange,
  onDepositClick
}: AccountHeaderProps) {
  const accountTypeItems = [
    {
      key: 'Real',
      label: 'Real',
      onClick: () => onAccountTypeChange('Real')
    },
    {
      key: 'Demo',
      label: 'Demo',
      onClick: () => onAccountTypeChange('Demo')
    }
  ];

  return (
    <div className="account-header">
      <div className="account-header__info">
        <Dropdown menu={{ items: accountTypeItems }} trigger={['click']}>
          <Space className="account-header__type">
            {accountType}
            <DownOutlined />
          </Space>
        </Dropdown>
        <div className="account-header__balance">
          {balance} {currency}
        </div>
      </div>
      <Button 
        type="default" 
        className="account-header__deposit-btn"
        onClick={onDepositClick}
      >
        Deposit
      </Button>
    </div>
  );
}
