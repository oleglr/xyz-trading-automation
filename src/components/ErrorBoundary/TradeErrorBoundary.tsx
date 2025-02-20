import { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class TradeErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Trade error caught:', error);
    console.error('Error info:', errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  private getErrorMessage(error: Error | null): string {
    if (!error) return 'An unknown error occurred';

    // Handle specific error types
    if (error.message.includes('unauthorized')) {
      return 'Your session has expired. Please log in again.';
    }

    if (error.message.includes('network')) {
      return 'Network error occurred. Please check your connection and try again.';
    }

    if (error.message.includes('trading session already exists')) {
      return 'A trading session is already in progress. Please wait for it to complete.';
    }

    // Default error message
    return error.message || 'An error occurred while processing your trade';
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px' }}>
          <Alert
            message="Trading Error"
            description={this.getErrorMessage(this.state.error)}
            type="error"
            showIcon
            action={
              <Button
                icon={<ReloadOutlined />}
                onClick={this.handleReset}
                type="primary"
                danger
              >
                Try Again
              </Button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}