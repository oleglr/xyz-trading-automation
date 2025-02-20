import { Form, InputNumber, Button } from 'antd';
import './styles.scss';

export interface StrategyFormValues {
  dte: number;
  delta: number;
}

interface StrategyFormProps {
  onSubmit: (values: StrategyFormValues) => void;
}

export function StrategyForm({ onSubmit }: StrategyFormProps) {
  const [form] = Form.useForm<StrategyFormValues>();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  return (
    <div className="strategy-form">
      <Form
        form={form}
        layout="vertical"
        className="strategy-form__form"
      >
        <Form.Item
          label="DTE (Days to Expiry)"
          name="dte"
          rules={[{ required: true, message: 'Please enter DTE' }]}
        >
          <InputNumber min={1} max={365} className="strategy-form__input" />
        </Form.Item>

        <Form.Item
          label="Delta"
          name="delta"
          rules={[{ required: true, message: 'Please enter Delta' }]}
        >
          <InputNumber 
            min={0.1} 
            max={1} 
            step={0.1} 
            precision={2}
            className="strategy-form__input" 
          />
        </Form.Item>

        <Form.Item className="strategy-form__submit">
          <Button 
            type="primary" 
            onClick={handleSubmit}
            className="strategy-form__button"
          >
            Run Strategy
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
