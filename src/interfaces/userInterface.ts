export interface UserRequestBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserRequest {
  id: string;
  name: string;
  email: string;
  password: string;
}
