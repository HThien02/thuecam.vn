import { NextRequest, NextResponse } from 'next/server';

interface SePayWebhookBody {
  id: number | string;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  code?: string;
  content: string;
  transferType: string;
  transferAmount: number;
  referenceCode: string;
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const webhookToken = process.env.SEPAY_WEBHOOK_TOKEN;

    // 1. Verify token if configured
    if (webhookToken && authHeader) {
      const providedToken = authHeader.replace('Apikey ', '').trim();
      if (providedToken !== webhookToken) {
        return NextResponse.json({ error: 'Unauthorized webhook request' }, { status: 401 });
      }
    }

    const payload: SePayWebhookBody = await request.json();

    // 2. Validate transfer type
    if (payload.transferType !== 'in' && payload.transferType !== 'IN') {
      return NextResponse.json({ message: 'Ignored non-incoming transaction' });
    }

    // 3. Extract Booking Code (e.g. TC123456) from transfer content
    const match = payload.content.match(/TC\d{6}/i);
    const bookingCode = match ? match[0].toUpperCase() : null;

    if (!bookingCode) {
      return NextResponse.json({
        success: false,
        message: 'No matching TC booking code found in transfer content',
      });
    }

    // 4. Log or update Supabase database in production
    console.log(`[SePay Webhook Processed]: Booking ${bookingCode} paid ${payload.transferAmount} VND.`);

    return NextResponse.json({
      success: true,
      bookingCode,
      amount: payload.transferAmount,
      status: 'PAID',
    });
  } catch (error) {
    console.error('[SePay Webhook Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
