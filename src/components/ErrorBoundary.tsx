import { Component, ReactNode, ErrorInfo } from 'react';
import { Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="text-center max-w-lg">
            <div className="w-24 h-24 bg-gradient-to-br from-accent/10 to-red-100 rounded-full mx-auto mb-8 flex items-center justify-center">
              <span className="text-5xl">⚠️</span>
            </div>
            
            <h1 className="text-4xl font-serif font-bold text-text-primary mb-4">
              出错了
            </h1>
            <p className="text-text-secondary mb-8">
              页面加载时发生了错误，请尝试刷新或返回首页。
            </p>
            
            {this.state.error && (
              <div className="bg-red-50 rounded-lg p-4 mb-8 text-left">
                <p className="text-sm text-red-600 font-medium mb-2">错误信息:</p>
                <p className="text-xs text-red-500 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.resetError}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-sand-dark transition-colors"
              >
                重试
              </button>
              
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-secondary text-white rounded-lg font-medium hover:bg-oasis transition-colors"
              >
                <Home className="w-5 h-5" />
                返回首页
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
