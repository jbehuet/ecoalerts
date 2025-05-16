import { Component, ReactNode } from 'react';
import { logError } from '@/lib/logger';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        logError('React rendering error', {
            message: error.message,
            stack: error.stack,
            info: errorInfo.componentStack,
        });
    }

    render() {
        if (this.state.hasError) {
            return <p>Une erreur est survenue. Veuillez recharger la page.</p>;
        }

        return this.props.children;
    }
}
