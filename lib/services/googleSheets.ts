import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

export class GoogleSheetsService {
  private sheets;
  private auth;

  constructor() {
    this.auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async appendToSheet(spreadsheetId: string, range: string, values: any[][]) {
    try {
      // Memory optimization: limit batch size to prevent memory issues
      const maxBatchSize = 1000;
      const batches = [];

      for (let i = 0; i < values.length; i += maxBatchSize) {
        batches.push(values.slice(i, i + maxBatchSize));
      }

      const results = [];
      for (const batch of batches) {
        const response = await this.sheets.spreadsheets.values.append({
          spreadsheetId,
          range,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: batch,
          },
        });
        results.push(response.data);
      }

      return results;
    } catch (error) {
      console.error('Error appending to sheet:', error);
      throw error;
    }
  }

  async readFromSheet(spreadsheetId: string, range: string) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
      return response.data.values;
    } catch (error) {
      console.error('Error reading from sheet:', error);
      throw error;
    }
  }

  async updateSheet(spreadsheetId: string, range: string, values: any[][]) {
    try {
      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating sheet:', error);
      throw error;
    }
  }

  async createSheet(title: string) {
    try {
      const response = await this.sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title,
          },
        },
      });
      return response.data.spreadsheetId;
    } catch (error) {
      console.error('Error creating sheet:', error);
      throw error;
    }
  }
}
