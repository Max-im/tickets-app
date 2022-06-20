import { CustomError } from './CustomError';

export class DbConnectionError extends CustomError {
    statusCode = 500;
    reason = 'Error db connection';

    constructor() {
        super('Error db connection');

        // because extends built in class
        Object.setPrototypeOf(this, DbConnectionError.prototype);
    }

    serializeErrors() {
        return [{ message: this.reason }];
        
    }
} 