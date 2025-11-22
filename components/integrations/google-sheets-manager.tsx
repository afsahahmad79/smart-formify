import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

import { Integration } from '@/types/integration';

interface GoogleSheetsManagerProps {
  integration: Integration;
  onUpdate: (updates: Partial<Integration>) => void;
}

export function GoogleSheetsManager({ integration, onUpdate }: GoogleSheetsManagerProps) {
  const [sheetName, setSheetName] = useState(integration.config.sheetName || '');

  const handleCreateSheet = async () => {
    try {
      const response = await fetch('/api/sheets/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: sheetName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create sheet');
      }

      const data = await response.json();
      onUpdate({
        config: {
          ...integration.config,
          spreadsheetId: data.spreadsheetId,
        },
        status: 'active',
      });
      
      toast({
        title: 'Success',
        description: 'New Google Sheet created successfully',
      });
    } catch (error) {
      console.error('Sheet creation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create Google Sheet',
        variant: 'destructive',
      });
    }
  };

  const handleSheetNameChange = (value: string) => {
    setSheetName(value);
    onUpdate({
      config: {
        ...integration.config,
        sheetName: value,
      },
    });
  };

  const handleSpreadsheetIdChange = (value: string) => {
    onUpdate({
      config: {
        ...integration.config,
        spreadsheetId: value,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Sheets Integration</CardTitle>
        <CardDescription>
          Configure your Google Sheets integration settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="spreadsheetId">Spreadsheet ID</Label>
          <Input
            id="spreadsheetId"
            value={integration.config.spreadsheetId || ''}
            onChange={(e) => handleSpreadsheetIdChange(e.target.value)}
            placeholder="Enter existing spreadsheet ID"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sheetName">New Sheet Name</Label>
          <div className="flex gap-2">
            <Input
              id="sheetName"
              value={sheetName}
              onChange={(e) => handleSheetNameChange(e.target.value)}
              placeholder="Enter name for new sheet"
            />
            <Button onClick={handleCreateSheet}>Create Sheet</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
