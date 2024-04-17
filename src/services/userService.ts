import prisma from '../lib/prisma';

import UserModel from '../models/userModel';
import { UserRequest } from '../interfaces/userInterface';

const userService = {
  /* getAttendeeBadge: async ({
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
  }, */

  createUser: async (data: UserRequest) => {
    const user: UserModel = await prisma.user.create({ data });

    return { userId: user.id };
  },

  getUserByEmail: async (email: string) => {
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        roles: true,
        createdAt: true
      },
      where: {
        email
      }
    });

    return user;
  },
};

export default userService;
