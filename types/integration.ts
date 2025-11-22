export interface Integration {
  id: string
  name: string
  type: "webhook" | "email" | "zapier" | "slack" | "discord" | "custom" | "sheets"
  enabled: boolean
  config: {
    url?: string
    apiKey?: string
    email?: string
    template?: string
    headers?: Record<string, string>
    method?: "POST" | "PUT" | "PATCH"
    spreadsheetId?: string
    sheetName?: string
  }
  lastTriggered?: string
  status: "active" | "error" | "pending"
}