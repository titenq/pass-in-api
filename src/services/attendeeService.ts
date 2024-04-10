import prisma from '../lib/prisma';

import { AttendeeBadgeRequestParams } from '../interfaces/attendeeInterface';
import AttendeeModel from '../models/attendeeModel';
import generateCheckInId from '../helpers/generateCheckInId';

const attendeeService = {
  getAttendeeBadge: async ({
    attendeeId,
    checkInId,
  }: AttendeeBadgeRequestParams) => {
    const attendee = await prisma.attendee.findUnique({
      select: {
        checkInId: true,
        name: true,
        email: true,
        event: {
          select: {
            title: true,
            eventDate: true,
          },
        },
      },
      where: {
        id: attendeeId,
        checkInId,
      },
    });

    return attendee;
  },

  getAttendeeCheckIn: async ({ attendeeId, checkInId }: AttendeeBadgeRequestParams) => {
    const attendee = await prisma.attendee.findUnique({
      where: {
        id: attendeeId,
        checkInId,
      },
    });

    return attendee;
  },

  getAttendeeByEmail: async (email: string, eventId: string) => {
    const attendeeByEmail = await prisma.attendee.findUnique({
      where: {
        eventId_email: {
          email,
          eventId,
        },
      },
    });

    return attendeeByEmail;
  },

  getEventAndAttendees: async (eventId: string) => {
    const [event, countAttendeesInEvent] = await Promise.all([
      prisma.event.findUnique({
        where: {
          id: eventId,
        },
      }),
      prisma.attendee.count({
        where: {
          eventId: eventId,
        },
      }),
    ]);

    return { event, countAttendeesInEvent };
  },

  createAttendee: async (name: string, email: string, eventId: string) => {
    const attendee: AttendeeModel = await prisma.attendee.create({
      data: {
        checkInId: generateCheckInId(),
        name,
        email,
        eventId,
      },
    });

    return attendee;
  },
};

export default attendeeService;
