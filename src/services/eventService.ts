import prisma from '../lib/prisma';
import EventModel from '../models/eventModel';

const eventService = {
  getEventById: async (eventId: string) => {
    const event = await prisma.event.findUnique({
      select: {
        id: true,
        title: true,
        details: true,
        maximumAttendees: true,
        isActive: true,
        slug: true,
        createdAt: true,
        eventDate: true,
        _count: {
          select: {
            attendees: true,
          },
        },
      },
      where: {
        id: eventId,
      },
    });

    return event;
  },

  getAttendeesByEvent: async (eventId: string, page: number, limit: number, query?: string) => {
    const [attendees, count] = await prisma.$transaction([
      prisma.attendee.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          eventId: true,
          checkIn: {
            select: {
              createdAt: true,
            },
          },
        },
        where: query
          ? {
            eventId,
            name: {
              contains: query,
            },
          }
          : {
            eventId,
          },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.attendee.count({
        where: query ?
          {
            eventId,
            name: {
              contains: query,
            },
          }
          : {
            eventId,
          },
      }),
    ]);

    return { attendees, count };
  },

  getIsSlug: async (slug: string) => {
    const isSlug = await prisma.event.findUnique({ where: { slug } });

    return isSlug;
  },

  createEvent: async (title: string, slug: string, isActive: boolean, eventDate: string, details?: string, maximumAttendees?: number) => {
    const event: EventModel = await prisma.event.create({
      data: {
        title,
        details,
        maximumAttendees,
        slug,
        isActive,
        eventDate: new Date(eventDate),
      },
    });

    return event;
  },
};

export default eventService;
