import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Home, RotateCcw, TriangleAlert } from 'lucide-react';

interface Props { children: ReactNode }
interface State { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State { return { hasError: true }; }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error('页面渲染失败', error, info);
  }

  render() {
    if (this.state.hasError) return (
      <main className="full-state" role="alert">
        <TriangleAlert aria-hidden="true" />
        <h1>页面暂时没有打开</h1>
        <p>这通常是一次临时加载问题。你可以重试当前页面，或返回首页继续浏览。</p>
        <div className="state-actions">
          <button type="button" className="btn-primary" onClick={() => window.location.reload()}><RotateCcw aria-hidden="true" />重新加载</button>
          <a className="btn-quiet" href={import.meta.env.BASE_URL}><Home aria-hidden="true" />返回首页</a>
        </div>
      </main>
    );
    return this.props.children;
  }
}
