import {Request, Response, NextFunction} from 'express';
import { UnauthError } from '../errors/unauthError';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
        throw new UnauthError();
    }
    
    next();
}