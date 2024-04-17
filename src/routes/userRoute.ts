import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { randomUUID } from 'crypto';

import { UserRequestBody } from '../interfaces/userInterface';
import { userRegisterSchema } from '../schemas/userSchema';
import errorHandler from '../helpers/errorHandler';
import userService from '../services/userService';

const UserRoute = async (fastify: FastifyInstance, options: any) => {
  /* fastify.withTypeProvider<ZodTypeProvider>()
    .get('/users',
      { schema: getUsersSchema },
      async (
        request: FastifyRequest<{ Params: AttendeeBadgeRequestParams }>,
        reply: FastifyReply,
      ) => {
        try {
          const { attendeeId, checkInId } = request.params;
          const attendee = await attendeeService.getAttendeeBadge({
            attendeeId,
            checkInId,
          });

          if (!attendee) {
            return reply.status(404).send({
              error: 'Participante não encontrado.'
            });
          }

          const protocol = request.protocol;
          const hostname = request.hostname;
          const baseURL = `${protocol}://${hostname}`;
          const checkInURL = new URL(
            `attendees/${attendeeId}/check-in/${checkInId}`,
            baseURL,
          ).toString();

          const { event, ...rest } = attendee;

          const attendeeReply = {
            ...rest,
            eventTitle: event.title,
            eventDate: event.eventDate,
            checkInURL,
          };

          return reply.status(200).send(attendeeReply);
        } catch (error) {
          console.error(error);

          errorHandler(error, request, reply);
        }
      },
    ); */

  /* fastify.withTypeProvider<ZodTypeProvider>()
    .get('/users/:id',
      { schema: getAttendeeCheckInSchema },
      async (
        request: FastifyRequest<{ Params: AttendeeBadgeRequestParams }>,
        reply: FastifyReply,
      ) => {
        try {
          const { attendeeId, checkInId } = request.params;
          const attendee = await attendeeService.getAttendeeCheckIn({
            attendeeId,
            checkInId,
          });

          if (!attendee) {
            return reply.status(409).send({
              error: 'Id e checkInId do participante não conferem.'
            });
          }

          const attendeeCheckIn = await checkInService.getCheckIn(attendeeId);

          if (attendeeCheckIn) {
            return reply.status(409).send({
              error: 'Check In já realizado com o ID do participante.',
            });
          }

          const checkIn = await checkInService.createCheckIn({
            attendeeId,
            checkInId,
          });

          return reply.status(201).send(checkIn);
        } catch (error) {
          console.error(error);

          errorHandler(error, request, reply);
        }
      },
    ); */

  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/users/register',
      {
        schema: userRegisterSchema
      },
      async (
        request: FastifyRequest<{ Body: UserRequestBody }>,
        reply: FastifyReply,
      ) => {
        try {
          const { name, email, password } = request.body;

          const userExists = await userService.getUserByEmail(email);
          
          if (userExists) {
            return reply.status(409).send({
              error: 'E-mail já cadastrado',
            });
          }
          
          const userId = await userService.createUser({
            id: randomUUID(),
            name,
            email,
            password
          });

          return reply.status(201).send(userId);
        } catch (error) {
          console.error(error);

          errorHandler(error, request, reply);
        }
      },
  );
  
  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/users/login',
      {
        schema: userRegisterSchema
      },
      async (
        request: FastifyRequest<{ Body: UserRequestBody }>,
        reply: FastifyReply,
      ) => {
        try {
          const { name, email, password } = request.body;

          const userExists = await userService.getUserByEmail(email);
          
          if (userExists) {
            return reply.status(409).send({
              error: 'E-mail já cadastrado',
            });
          }
          
          const userId = await userService.createUser({
            id: randomUUID(),
            name,
            email,
            password
          });

          return reply.status(201).send(userId);
        } catch (error) {
          console.error(error);

          errorHandler(error, request, reply);
        }
      },
    );
};

export default UserRoute;
