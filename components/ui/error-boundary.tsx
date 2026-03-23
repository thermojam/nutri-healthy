"use client";

import {Component, ErrorInfo, ReactNode} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {AlertTriangle, RefreshCcw} from "lucide-react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return {hasError: true, error};
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <Card className="max-w-md w-full">
                        <CardContent className="pt-6 text-center space-y-4">
                            <AlertTriangle className="h-12 w-12 text-error mx-auto"/>
                            <h2 className="text-xl font-bold">Что-то пошло не так</h2>
                            <p className="text-muted text-sm">
                                {this.state.error?.message || "Произошла непредвиденная ошибка"}
                            </p>
                            <Button
                                onClick={() => {
                                    this.setState({hasError: false, error: null});
                                    window.location.reload();
                                }}
                            >
                                <RefreshCcw className="h-4 w-4 mr-2"/>
                                Попробовать снова
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
