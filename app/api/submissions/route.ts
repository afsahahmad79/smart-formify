import { NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/services/googleSheets';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { formData, spreadsheetId } = body;

    // Convert form data to array format for Google Sheets
    const values = [Object.values(formData)];

    const googleSheetsService = new GoogleSheetsService();
    
    // Append data to the first sheet, A1 range
    const result = await googleSheetsService.appendToSheet(
      spreadsheetId,
      'Sheet1!A1',
      values
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    return NextResponse.json(
      { error: 'Failed to save to Google Sheets' },
      { status: 500 }
    );
  }
}
