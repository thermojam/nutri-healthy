/**
 * GET /api/payment/providers
 * Получение списка доступных платежных провайдеров
 */

import { NextResponse } from "next/server";
import { PaymentProviderManager } from "@/lib/payments/payment-provider-factory";
import type { PaymentProviderType } from "@/lib/payments/providers/abstract-payment-provider";

export async function GET() {
    try {
        const manager = PaymentProviderManager.getInstance();
        const status = await manager.getProvidersStatus();
        const activeProvider = manager.getActiveProviderType();

        return NextResponse.json({
            success: true,
            data: {
                providers: status,
                activeProvider,
            },
        });
    } catch (error) {
        console.error("Failed to get payment providers:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to get payment providers",
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/payment/providers
 * Переключение активного платежного провайдера
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { provider } = body as { provider: string };

        if (!provider || !["yookassa", "paykeeper"].includes(provider)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid provider",
                },
                { status: 400 }
            );
        }

        const manager = PaymentProviderManager.getInstance();
        const success = await manager.setActiveProvider(provider as PaymentProviderType);

        if (!success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Failed to switch provider",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Switched to ${provider}`,
            activeProvider: provider,
        });
    } catch (error) {
        console.error("Failed to switch payment provider:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to switch payment provider",
            },
            { status: 500 }
        );
    }
}
