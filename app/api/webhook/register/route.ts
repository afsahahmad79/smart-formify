import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // You can change this shape as needed for your specific webhook
    const body = await req.json();

    // TODO: Process the webhook event as needed
    console.log('Received webhook payload:', body);

    // Respond to acknowledge receipt
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json({ error: 'Webhook handling failed' }, { status: 500 });
  }
}
