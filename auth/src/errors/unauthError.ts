import { CustomError } from './CustomError';

export class UnauthError extends CustomError {
    statusCode = 401;

    constructor() {
        super('Not Authorized')

        Object.setPrototypeOf(this, UnauthError.prototype);
    }

    serializeErrors() {
        return [{message: 'Not Authorized'}];
    }
}