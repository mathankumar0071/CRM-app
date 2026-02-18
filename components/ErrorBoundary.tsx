import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-50 min-h-screen flex flex-col items-center justify-center text-red-900 absolute top-0 left-0 w-full z-50">
                    <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
                    <pre className="bg-red-100 p-4 rounded overflow-auto max-w-2xl w-full border border-red-200 text-sm whitespace-pre-wrap">
                        {this.state.error && this.state.error.toString()}
                    </pre>
                    <button
                        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => window.location.reload()}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
