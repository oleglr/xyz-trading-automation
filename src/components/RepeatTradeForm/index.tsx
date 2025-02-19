import React from 'react';
import { Form, InputNumber, Button, Input, message } from 'antd';
import { InfoCircleOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useProcessingStack } from '../../contexts/ProcessingStackContext';
import { tradeService } from '../../services/trade/tradeService';
import { TradeErrorBoundary } from '../ErrorBoundary/TradeErrorBoundary';
import { 
  ContractType, 
  RepeatTradeRequest, 
  RepeatTradeFormValues,
  TradeStatusEnum 
} from '../../types/trade';
import './styles.scss';

interface RepeatTradeFormProps {
  onSubmit: (values: RepeatTradeFormValues) => void;
}

type FormField = keyof RepeatTradeFormValues;

const DEFAULT_NUMBER_OF_TRADES = 10;

/**
 * RepeatTradeForm Component
 * 
 * This component provides the interface for configuring and initiating repeat trades.
 * It integrates with:
 * - TradeService for API communication
 * - ProcessingStack for trade progress tracking
 * - TradeErrorBoundary for error handling
 * 
 * @param {RepeatTradeFormProps} props - Component props
 */
export function RepeatTradeForm({ onSubmit }: RepeatTradeFormProps) {
  const [form] = Form.useForm<RepeatTradeFormValues>();
  const { addProcess } = useProcessingStack();
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: RepeatTradeFormValues) => {
    try {
      setIsSubmitting(true);
      setIsRunning(true);

      // Generate a session ID for tracking
      const sessionId = Math.random().toString(36).substring(7).toUpperCase();

      // Add to processing stack immediately to show progress
      addProcess({
        sessionId,
        completedTrades: 0,
        totalTrades: DEFAULT_NUMBER_OF_TRADES,
        profit: 0,
        tradeType: 'Repeat Trade',
        status: TradeStatusEnum.PENDING
      });

      // Prepare the API request
      const request: RepeatTradeRequest = {
        number_of_trades: DEFAULT_NUMBER_OF_TRADES,
        proposal: 1,
        amount: values.initial_stake,
        basis: 'stake',
        contract_type: ContractType.ACCUMULATOR,
        currency: 'USD',
        symbol: values.asset,
        growth_rate: values.growth_rate,
        limit_order: {
          take_profit: values.profit_threshold
        }
      };

      // Start the trading session
      const response = await tradeService.startRepeatTrade(request);

      // Update the process with the actual session ID from the API
      addProcess({
        sessionId: response.session_id,
        completedTrades: 0,
        totalTrades: response.trades,
        profit: 0,
        tradeType: 'Repeat Trade',
        status: TradeStatusEnum.ACTIVE
      });

      message.success('Trading session started successfully');
      onSubmit(values);
    } catch (error) {
      console.error('Failed to start trading session:', error);
      
      // Add error process to stack
      addProcess({
        sessionId: Math.random().toString(36).substring(7).toUpperCase(),
        completedTrades: 0,
        totalTrades: DEFAULT_NUMBER_OF_TRADES,
        profit: 0,
        tradeType: 'Repeat Trade',
        status: TradeStatusEnum.ERROR,
        error: error instanceof Error ? error.message : 'Failed to start trading session'
      });
      
      throw error; // Let the error boundary handle it
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIncrement = (field: FormField) => {
    const currentValue = form.getFieldValue(field) || 0;
    form.setFieldValue(field, currentValue + 1);
  };

  const handleDecrement = (field: FormField) => {
    const currentValue = form.getFieldValue(field) || 0;
    if (currentValue > 0) {
      form.setFieldValue(field, currentValue - 1);
    }
  };

  const validateForm = async () => {
    try {
      await form.validateFields();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleRun = async () => {
    if (await validateForm()) {
      form.submit();
    }
  };

  const handleReset = () => {
    form.resetFields();
    setIsRunning(false);
    setIsSubmitting(false);
  };

  return (
    <TradeErrorBoundary onReset={handleReset}>
      <div className="repeat-trade-form-container">
        <Form
          form={form}
          onFinish={handleSubmit}
          initialValues={{
            trade_type: 'Accumulators',
            strategy: 'Repeat Trade',
            asset: 'Volatility 100 (1s) Index',
            initial_stake: 1,
            growth_rate: 1,
            profit_threshold: 0,
            loss_threshold: 0
          }}
          className="repeat-trade-form"
        >
          <div className="section-header">
            <span className="label">Trade type</span>
            <span className="value">Accumulators</span>
          </div>

          <div className="section-header">
            <span className="label">Strategy</span>
            <span className="value">Repeat Trade</span>
          </div>

          <div className="form-section">
            <div className="section-title">
              <span className="title">Asset</span>
              <InfoCircleOutlined className="info-icon" />
            </div>
            <div className="input-field">
              <Form.Item 
                name="asset" 
                noStyle
                rules={[{ required: true, message: 'Please select an asset' }]}
              >
                <Input />
              </Form.Item>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">
              <span className="title">Initial stake</span>
              <InfoCircleOutlined className="info-icon" />
            </div>
            <div className="input-field">
              <button 
                type="button" 
                className="minus-btn"
                onClick={() => handleDecrement('initial_stake')}
              >
                <MinusOutlined />
              </button>
              <span className="currency">USD</span>
              <Form.Item 
                name="initial_stake" 
                noStyle
                rules={[
                  { required: true, message: 'Please enter initial stake' },
                  { type: 'number', min: 0, message: 'Stake must be positive' }
                ]}
              >
                <InputNumber min={0} precision={2} />
              </Form.Item>
              <button 
                type="button" 
                className="plus-btn"
                onClick={() => handleIncrement('initial_stake')}
              >
                <PlusOutlined />
              </button>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">
              <span className="title">Growth rate</span>
              <InfoCircleOutlined className="info-icon" />
            </div>
            <div className="input-field">
              <Form.Item 
                name="growth_rate" 
                noStyle
                rules={[
                  { required: true, message: 'Please enter growth rate' },
                  { type: 'number', min: 0, message: 'Growth rate must be positive' }
                ]}
              >
                <InputNumber min={0} precision={2} />
              </Form.Item>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">
              <span className="title">Profit threshold</span>
              <InfoCircleOutlined className="info-icon" />
            </div>
            <div className="input-field">
              <button 
                type="button" 
                className="minus-btn"
                onClick={() => handleDecrement('profit_threshold')}
              >
                <MinusOutlined />
              </button>
              <span className="currency">USD</span>
              <Form.Item 
                name="profit_threshold" 
                noStyle
                rules={[
                  { required: true, message: 'Please enter profit threshold' },
                  { type: 'number', min: 0, message: 'Threshold must be positive' }
                ]}
              >
                <InputNumber min={0} precision={2} />
              </Form.Item>
              <button 
                type="button" 
                className="plus-btn"
                onClick={() => handleIncrement('profit_threshold')}
              >
                <PlusOutlined />
              </button>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">
              <span className="title">Loss threshold</span>
              <InfoCircleOutlined className="info-icon" />
            </div>
            <div className="input-field">
              <button 
                type="button" 
                className="minus-btn"
                onClick={() => handleDecrement('loss_threshold')}
              >
                <MinusOutlined />
              </button>
              <span className="currency">USD</span>
              <Form.Item 
                name="loss_threshold" 
                noStyle
                rules={[
                  { required: true, message: 'Please enter loss threshold' },
                  { type: 'number', min: 0, message: 'Threshold must be positive' }
                ]}
              >
                <InputNumber min={0} precision={2} />
              </Form.Item>
              <button 
                type="button" 
                className="plus-btn"
                onClick={() => handleIncrement('loss_threshold')}
              >
                <PlusOutlined />
              </button>
            </div>
          </div>
        </Form>

        <div className="form-footer">
          <Button className="load-button">
            Save 
          </Button>
          <Button 
            className="run-button"
            onClick={handleRun}
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
