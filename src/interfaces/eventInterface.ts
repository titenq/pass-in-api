export interface EventRequestBody {
  title: string;
  details?: string | null;
  maximumAttendees?: number | null;
  isActive: boolean;
}
