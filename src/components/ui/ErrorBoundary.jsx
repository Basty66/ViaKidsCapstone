import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md w-full text-center space-y-6">
                        <div className="bg-red-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                            <AlertTriangle size={40} className="text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">Algo salió mal</h2>
                            <p className="text-slate-400 text-sm">Ha ocurrido un error inesperado. Por favor intenta recargar la página.</p>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 mx-auto transition-all"
                        >
                            <RefreshCw size={18} /> Recargar Página
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
