import { customAlphabet } from 'nanoid';

const generateCheckInId = () => {
  const letters = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVXWYZ', 3);
  const numbers = customAlphabet('0123456789', 4);

  const nanoId = `${letters()}-${numbers()}`

  return nanoId;
};

export default generateCheckInId;
