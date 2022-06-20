import { CustomError } from './CustomError';

export class BadRequest extends CustomError {
    statusCode = 400;

    constructor(public message: string) {
        super(message);

        // because extends built in class
        Object.setPrototypeOf(this, BadRequest.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
        
    }
} 