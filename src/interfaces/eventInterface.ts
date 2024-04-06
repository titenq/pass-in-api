export interface EventRequestBody {
  title: string;
  details?: string | null;
  maximumAttendees?: number | null;
  isActive: boolean;
  eventDate: string;
}

export interface EventRequestParams {
  eventId: string;
}

export interface EventRequestQuery {
  page: number;
  limit: number;
  query?: string;
}
