import { NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/services/googleSheets';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title } = body;

    const googleSheetsService = new GoogleSheetsService();
    const spreadsheetId = await googleSheetsService.createSheet(title);

    return NextResponse.json({ success: true, spreadsheetId });
  } catch (error) {
    console.error('Error creating Google Sheet:', error);
    return NextResponse.json(
      { error: 'Failed to create Google Sheet' },
      { status: 500 }
    );
  }
}
