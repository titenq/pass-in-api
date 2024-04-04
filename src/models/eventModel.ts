import { RouteGenericInterface } from 'fastify';

interface EventModel extends RouteGenericInterface {
  id: string;
  title: string;
  details: string | null;
  maximumAttendees: number | null;
  slug: string;
  isActive: boolean;
  createdAt: Date;
}

export default EventModel;
