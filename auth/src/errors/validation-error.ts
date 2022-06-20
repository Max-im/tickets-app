import { ValidationError } from 'express-validator';
import { CustomError } from './CustomError';

export class ReqValidationError extends CustomError {
    statusCode = 422;

    constructor(public errors: ValidationError[]) {
        super('Invalid Input Data');

        // because extends built in class
        Object.setPrototypeOf(this, ReqValidationError.prototype);
    }
    
    serializeErrors() {
        return this.errors.map(({param, msg}) => ({message: msg, field: param }));
    }
} 