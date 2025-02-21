import { Form, InputNumber, Button, Input, Select } from "antd";
import {
  InfoCircleOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useProcessingStack } from "../../contexts/ProcessingStackContext";
import "./styles.scss";

interface RepeatTradeFormValues {
  trade_type: string;
  strategy: string;
  asset: string;
  initial_stake: number;
  growth_rate: number;
  profit_threshold: number;
  loss_threshold: number;
}

interface RepeatTradeFormProps {
  onSubmit: (values: RepeatTradeFormValues) => void;
}

type FormField = keyof RepeatTradeFormValues;

export function RepeatTradeForm({ onSubmit }: RepeatTradeFormProps) {
  const [form] = Form.useForm<RepeatTradeFormValues>();
  const { addProcess } = useProcessingStack();
  const [isRunning, setIsRunning] = useState(false);

  const handleSubmit = (values: RepeatTradeFormValues) => {
    setIsRunning(true);

    addProcess({
      sessionId: Math.random().toString(36).substring(7).toUpperCase(),
      completedTrades: 0,
      totalTrades: 10,
      profit: 0,
      tradeType: "Repeat Trade",
    });

    onSubmit(values);

    // Enable the Run button after all trades complete
    setTimeout(() => setIsRunning(false), 11000);
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

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  
  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  return (
    <div className="repeat-trade-form-container">
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          trade_type: "Accumulators",
          strategy: "Martingale",
          asset: "Volatility 100 (1s) Index",
          initial_stake: 1,
          growth_rate: 1,
          profit_threshold: 0,
          loss_threshold: 0,
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
            <span className="title">Symbol</span>
            <InfoCircleOutlined className="info-icon" />
          </div>
          <div className="select-container">
            <Form.Item name="asset" noStyle>
              <Select
                showSearch
                placeholder="Select a symbol"
                optionFilterProp="label"
                onChange={onChange}
                onSearch={onSearch}
                getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
                options={[
                  {
                    value: "volatility_100_1s",
                    label: "Volatility 100 (1s) Index",
                  },
                  {
                    value: "volatility_75_1s",
                    label: "Volatility 75 (1s) Index",
                  },
                  {
                    value: "volatility_50_1s",
                    label: "Volatility 50 (1s) Index",
                  },
                  {
                    value: "volatility_25_1s",
                    label: "Volatility 25 (1s) Index",
                  },
                  {
                    value: "volatility_10_1s",
                    label: "Volatility 10 (1s) Index",
                  }
                ]}
              />
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
              onClick={() => handleDecrement("initial_stake")}
            >
              <MinusOutlined />
            </button>
            <span className="currency">USD</span>
            <Form.Item name="initial_stake" noStyle>
              <InputNumber min={0} precision={2} />
            </Form.Item>
            <button
              type="button"
              className="plus-btn"
              onClick={() => handleIncrement("initial_stake")}
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
            <Form.Item name="growth_rate" noStyle>
              <Input />
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
              onClick={() => handleDecrement("profit_threshold")}
            >
              <MinusOutlined />
            </button>
            <span className="currency">USD</span>
            <Form.Item name="profit_threshold" noStyle>
              <InputNumber min={0} precision={2} />
            </Form.Item>
            <button
              type="button"
              className="plus-btn"
              onClick={() => handleIncrement("profit_threshold")}
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
              onClick={() => handleDecrement("loss_threshold")}
            >
              <MinusOutlined />
            </button>
            <span className="currency">USD</span>
            <Form.Item name="loss_threshold" noStyle>
              <InputNumber min={0} precision={2} />
            </Form.Item>
            <button
              type="button"
              className="plus-btn"
              onClick={() => handleIncrement("loss_threshold")}
            >
              <PlusOutlined />
            </button>
          </div>
        </div>
      </Form>

      <div className="form-footer">
        <Button className="load-button">Save</Button>
        <Button
          className="run-button"
          onClick={form.submit}
          disabled={isRunning}
        >
          Run
        </Button>
      </div>
    </div>
  );
}
