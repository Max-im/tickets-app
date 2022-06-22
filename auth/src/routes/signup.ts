import express, {NextFunction, Request, Response} from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequest, validateBody } from "@mpozhydaiev-tickets/common"

import { User } from '../models/User'; 

const router = express.Router();

router.post('/api/users/signup', 
    [ 
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().isLength({min: 4, max: 20}).withMessage('Password must be between 4 and 20 characters')
    ], 
    validateBody,
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({email}).catch(next);

        if (existingUser) {
            throw new BadRequest('Email in use');
        }

        const user = new User({email, password});
        await user.save();

        const jwtUser = jwt.sign({id: user.id, email: user.email}, process.env.JWT_KEY!);

        req.session = {
            jwt: jwtUser
        };

        return res.status(201).send(user);
});

export {router as signupUserRouter};