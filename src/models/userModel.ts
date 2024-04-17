import { RouteGenericInterface } from 'fastify';

interface UserModel extends RouteGenericInterface {
  id: string;
  name: string;
  email: string;
  roles: string;
  password: string;
  createdAt: Date;
}

export default UserModel;
