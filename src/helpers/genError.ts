export enum Type {
  STRING = 'deve ser um texto',
  NUMBER = 'deve ser um número',
  UUID = 'com UUID inválido',
  INT = 'deve ser um número'
}

export enum Required {
  TRUE,
  FALSE,
  NULL
}

interface ErrorMessage {
  required_error?: string;
  invalid_type_error?: string;
  message?: string;
}

const getRequiredError = (field: string, type: Type) => {
  return {
    required_error: `${field} é obrigatório`,
    invalid_type_error: `${field} ${type}`
  };
};

const getInvalidTypeError = (field: string, type: Type) => {
  return {
    invalid_type_error: `${field} ${type}`
  };
};

const getMessage = (field: string, type: Type) => {
  return {
    message: `${field} ${type}`
  };
};

const genError = (field: string, type: Type, required: Required): ErrorMessage => {
  if (required === Required.TRUE) {
    return getRequiredError(field, type);
  }

  if (required === Required.FALSE) {
    return getInvalidTypeError(field, type);
  }
  
  return getMessage(field, type);
};

export default genError;
