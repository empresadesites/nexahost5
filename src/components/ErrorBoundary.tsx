import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Nexa Host Uncaught Error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '';
    window.location.reload();
  };

  public handleClearCache = () => {
    localStorage.clear();
    window.location.hash = '';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-cyan-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Recuperação Automática Nexa Host
              </h2>
              <p className="text-sm text-slate-400">
                Ocorreu uma oscilação na interface. Clique abaixo para restabelecer a plataforma imediatamente.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:from-cyan-300 hover:to-blue-400 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recarregar Plataforma</span>
              </button>

              <button
                onClick={this.handleClearCache}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
              >
                Restaurar Configurações Padrão
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
