import express, {NextFunction, Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
import {User} from '../models/User'; 
import { ReqValidationError } from '../errors/validation-error';
import { BadRequest } from '../errors/badRequest';

const router = express.Router();

router.post('/api/users/signup', 
    [ 
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .isLength({min: 4, max: 20})
            .withMessage('Password must be between 4 and 20 characters')
    ], 
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw new ReqValidationError(errors.array());
        }

        const { email, password } = req.body;

        const existingUser = await User.findOne({email}).catch(next);

        if (existingUser) {
            throw new BadRequest('Email in use');
        }

        const user = new User({email, password});
        await user.save();

        return res.status(201).send(user);
});


export {router as signupUserRouter};