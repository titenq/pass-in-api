import { AttendeeBadgeRequestParams } from '../interfaces/attendeeInterface';
import prisma from '../lib/prisma';

const checkInService = {
  getCheckIn: async (attendeeId: number) => {
    const attendeeCheckIn = await prisma.checkIn.findUnique({
      where: {
        attendeeId,
      },
    });

    return attendeeCheckIn;
  },

  createCheckIn: async ({
    attendeeId,
    checkInId,
  }: AttendeeBadgeRequestParams) => {
    const checkIn = await prisma.checkIn.create({
      data: {
        attendeeId,
        checkInId,
      },
    });

    return checkIn;
  },
};

export default checkInService;
