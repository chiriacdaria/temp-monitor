import { Alert } from "../components/AlertsTable";

export interface Temperature {
  value: number;
  timestamp: string;
  alertId?: Alert | null;  // Using string or number for alertId
}
