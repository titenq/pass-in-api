export interface AttendeeRequestBody {
  name: string;
  email: string;
  eventId: string;
}

export interface AttendeeRequestParams {
  eventId: string;
}

export interface AttendeeBadgeRequestParams {
  attendeeId: number;
}
