import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import HttpException from '../exceptions/HttpException';
import * as express from 'express';

const validationMiddleware = <T>(type: any, skipMissingProperties = false): express.RequestHandle => {
  return (req, res, next) => {
    validate(plainToClass(type, req.body), { skipMissingProperties })
      .then((errors: ValidationError[]) => {
        if (errors.length >0) {
          const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
          next(new HttpException(400, message));
        }
        else {
          next();
        }
      })
  }
}

export default validationMiddleware;