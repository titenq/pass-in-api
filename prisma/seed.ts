import { randomUUID } from 'crypto';
import prisma from '../src/lib/prisma';
import generateSlug from '../src/helpers/generateSlug';

const seed = async () => {
  const eventos = Array.from({ length: 25 }, (_, i) => i + 1);
  
  for (const evento of eventos) {
    await prisma.event.create({
      data: {
        id: randomUUID(),
        title: `Evento ${evento}`,
        slug: generateSlug(`Evento ${evento}`),
        details: `Detalhes do evento ${evento}.`,
        maximumAttendees: evento * 5,
        isActive: true,
        eventDate: new Date('2024-04-24 18:00:00')
      }
    });
  }
};

try {
  seed();

  console.log('Database seeded');
} catch (error) {
  console.error(error);
} finally {
  prisma.$disconnect();
}
