interface AttendeeModel {
  id: number;
  checkInId: string;
  name: string;
  email: string;
  eventId: string;
  createdAt: Date;
}

export default AttendeeModel;
