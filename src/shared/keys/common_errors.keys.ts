import { HttpStatus } from '@nestjs/common';

export class ErrorObject {
  message: string;
  statusCode: HttpStatus;
  possibleFixes: Array<string>;
}

export const COMMON_ERRORS = {
  INVALID_CREDENTIAL: {
    message: 'Invalid Credential.',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  BAD_REQUEST: {
    message: 'Bad request.',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  UNAUTHORIZED: {
    message: 'Unauthorized.',
    statusCode: HttpStatus.UNAUTHORIZED,
  },
  NOT_FOUND: 'Not Found',
  DELETED: 'Is Deleted',
};
