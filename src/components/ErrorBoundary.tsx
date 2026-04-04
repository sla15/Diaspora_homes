import * as React from 'react';

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border border-surface-variant/20 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <h1 className="text-3xl font-black text-primary tracking-tighter mb-4">Something went wrong</h1>
            <p className="text-on-surface-variant font-medium mb-8 leading-relaxed">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>
            {this.state.error && (
              <div className="bg-red-50 p-4 rounded-2xl mb-8 text-left overflow-auto max-h-40">
                <code className="text-xs text-red-600 font-mono">
                  {this.state.error.toString()}
                </code>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:scale-[1.02] transition-transform shadow-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
