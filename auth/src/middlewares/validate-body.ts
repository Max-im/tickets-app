import {Request, Response, NextFunction} from 'express';
import { validationResult } from 'express-validator';
import { ReqValidationError } from '../errors/validation-error';

export const validateBody = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    
    console.log(req.body, errors.array())
    if (!errors.isEmpty()) {
        throw new ReqValidationError(errors.array());
    }

    next();
}