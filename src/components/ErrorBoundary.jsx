import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-2xl border border-rose-100 text-center">
                        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900 mb-4">Something went wrong</h1>
                        <p className="text-slate-500 mb-8 font-medium">
                            The application encountered an unexpected error. This is often caused by invalid credentials or connectivity issues.
                        </p>
                        <div className="p-4 bg-slate-50 rounded-2xl mb-8 text-left overflow-auto max-h-32">
                            <code className="text-xs text-rose-600 font-bold">{this.state.error?.message || "Unknown error"}</code>
                        </div>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full bg-slate-950 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
