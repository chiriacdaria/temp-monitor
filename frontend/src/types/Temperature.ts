export interface Temperature {
  value: number;
  timestamp: string;
  alertId?: string | number | null;  // Using string or number for alertId
}
