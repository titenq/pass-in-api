import { randomUUID } from 'crypto';
import prisma from '../src/lib/prisma';
import generateSlug from '../src/helpers/generateSlug';
import generateCheckInId from '../src/helpers/generateCheckInId';

const seedEvents = async () => {
  const events = Array.from({ length: 25 }, (_, i) => i + 1);
  
  for (const event of events) {
    await prisma.event.create({
      data: {
        id: randomUUID(),
        title: `Evento ${event}`,
        slug: generateSlug(`Evento ${event}`),
        details: `Detalhes do evento ${event}.`,
        maximumAttendees: event * 5,
        isActive: true,
        eventDate: new Date('2024-04-24 18:00:00')
      }
    });
  }
};

const seedAttendees = async () => {
  const attendees = Array.from({ length: 25 }, (_, i) => i + 1);
  
  for (const attendee of attendees) {
    await prisma.attendee.create({
      data: {
        checkInId: generateCheckInId(),
        name: `Leandro ${attendee}`,
        email: `leandro${attendee}@email.com`,
        eventId: 'e230894e-1ce0-47a1-abbe-967687e35043',
      },
    });
  }
};

try {
  // seedEvents();
  seedAttendees();

  console.log('Database seeded');
} catch (error) {
  console.error(error);
} finally {
  prisma.$disconnect();
}
