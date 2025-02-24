import { Form, Input, InputNumber, Button, message, Select } from 'antd';
import type { Rule } from 'antd/es/form';
import { InfoCircleOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useProcessingStack } from '../../contexts/ProcessingStackContext';
import { TradeErrorBoundary } from '../ErrorBoundary/TradeErrorBoundary';
import { TradeStatusEnum } from '../../types/trade';
import './styles.scss';

import { FieldConfig, FormValues, StrategyFormProps, PrefixType } from '../../types/form';

export function StrategyForm({ 
  config, 
  onSubmit, 
  strategyType,
  tradeType 
}: StrategyFormProps) {
  const [form] = Form.useForm<FormValues>();
  const { addProcess } = useProcessingStack();
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      setIsRunning(true);

      const sessionId = Math.random().toString(36).substring(7).toUpperCase();

      // Add to processing stack
      addProcess({
        sessionId,
        symbol: values.asset as string,
        strategy: strategyType,
        status: TradeStatusEnum.PENDING,
        is_completed: false,
        tradeInfo: {
          session_id: sessionId,
          contracts: [],
          start_time: new Date().toISOString(),
          end_time: '',
          total_profit: 0,
          win_profit: 0,
          loss_profit: 0,
          strategy: strategyType,
          initial: values.initial_stake as number,
          ...values
        }
      });

      // Call the provided onSubmit handler
      await onSubmit(values);

      message.success('Trading session started successfully');
    } catch (error) {
      console.error('Failed to start trading session:', error);
      
      // Add error process to stack
      addProcess({
        sessionId: Math.random().toString(36).substring(7).toUpperCase(),
        symbol: values.asset as string,
        strategy: strategyType,
        status: TradeStatusEnum.ERROR,
        is_completed: true,
        error: error instanceof Error ? error.message : 'Failed to start trading session',
        tradeInfo: {
          session_id: '',
          contracts: [],
          start_time: new Date().toISOString(),
          end_time: new Date().toISOString(),
          total_profit: 0,
          win_profit: 0,
          loss_profit: 0,
          strategy: strategyType,
          initial: values.initial_stake as number,
          ...values
        }
      });
      
      setIsRunning(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIncrement = (field: string) => {
    const currentValue = (form.getFieldValue(field) as number) || 0;
    form.setFieldValue(field, currentValue + 1);
  };

  const handleDecrement = (field: string) => {
    const currentValue = (form.getFieldValue(field) as number) || 0;
    if (currentValue > 0) {
      form.setFieldValue(field, currentValue - 1);
    }
  };

  const renderField = (field: FieldConfig) => {
    const { name, label, type, options, prefixType } = field;

    const isNumberField = type === 'number' || type === 'number-prefix';

    const numberRules: Rule[] = [
      { required: true, message: `Please enter ${label.toLowerCase()}` },
      { type: 'number', min: 0, message: 'Must be a positive number' }
    ];

    const textRules: Rule[] = [
      { required: true, message: `Please enter ${label.toLowerCase()}` }
    ];

    const getPrefix = (prefixType?: PrefixType) => {
      switch (prefixType) {
        case 'currency':
          return 'USD';
        case 'percentage':
          return '%';
        default:
          return '';
      }
    };

    return (
      <div className="form-section">
        <div className="section-title">
          <span className="title">{label}</span>
          <InfoCircleOutlined className="info-icon" />
        </div>
        {type === 'select' ? (
          <div className="select-container">
            <Form.Item 
              name={name}
              noStyle
              rules={textRules}
            >
              <Select
                showSearch
                placeholder={`Select ${label.toLowerCase()}`}
                optionFilterProp="label"
                options={options}
                getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
              />
            </Form.Item>
          </div>
        ) : (
          <div className="input-field">
            {isNumberField && (
              <button 
                type="button" 
                className="minus-btn"
                onClick={() => handleDecrement(name)}
              >
                <MinusOutlined />
              </button>
            )}
            {type === 'number-prefix' && prefixType && (
              <span className="currency">{getPrefix(prefixType)}</span>
            )}
            <Form.Item 
              name={name}
              noStyle
              rules={isNumberField ? numberRules : textRules}
            >
              {isNumberField ? (
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                />
              ) : (
                <Input />
              )}
            </Form.Item>
            {isNumberField && (
              <button 
                type="button" 
                className="plus-btn"
                onClick={() => handleIncrement(name)}
              >
                <PlusOutlined />
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleReset = () => {
    form.resetFields();
    setIsRunning(false);
    setIsSubmitting(false);
  };

  return (
    <TradeErrorBoundary onReset={handleReset}>
      <div className="strategy-form-container">
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          className="strategy-form"
        >
          <div className="section-header">
            <span className="label">Trade type</span>
            <span className="value">{tradeType}</span>
          </div>

          <div className="section-header">
            <span className="label">Strategy</span>
            <span className="value">{strategyType}</span>
          </div>

          {config.fields.map((field, index) => (
            <div key={index}>
              {renderField(field)}
            </div>
          ))}
        </Form>

        <div className="form-footer">
          <Button className="load-button">
            Save 
          </Button>
          <Button 
            className="run-button"
            onClick={() => form.submit()}
            disabled={isRunning || isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Starting...' : 'Run'}
          </Button>
        </div>
      </div>
    </TradeErrorBoundary>
  );
}
