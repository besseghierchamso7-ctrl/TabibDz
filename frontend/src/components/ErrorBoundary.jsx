import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }

    // Could also log to an error reporting service here
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-6">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M6.63 6.63a9 9 0 1112.74 0m0 0L12 3m0 18v.01" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Oops! Something went wrong
            </h1>

            <p className="text-gray-600 text-center mb-6">
              We're sorry for the inconvenience. The application encountered an unexpected error.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs font-mono text-red-600 break-all">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2 cursor-pointer">
                    <summary className="text-xs font-semibold text-gray-700 hover:text-gray-900">
                      Error Details
                    </summary>
                    <pre className="mt-2 text-xs text-gray-600 overflow-auto max-h-40 bg-white p-2 rounded">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Try Again
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Go to Home
              </button>
            </div>

            {this.state.errorCount > 3 && (
              <p className="text-xs text-gray-500 text-center mt-4">
                Multiple errors detected. Please refresh the page or contact support.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
