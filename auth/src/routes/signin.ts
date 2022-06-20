import express, {NextFunction, Request, Response} from 'express';
import { body } from 'express-validator';
import { BadRequest } from '../errors/badRequest';
import jwt from 'jsonwebtoken';

import { validateBody } from '../middlewares/validate-body';
import { User } from '../models/User'; 
import { Password } from '../services/password';

const router = express.Router();


router.post('/api/users/signin', 
    [
        body('email').isEmail().withMessage('Invalid Email'),
        body('password').trim().notEmpty().withMessage('Invalid Password')
    ], 
    validateBody, 
    async (req: Request, res: Response, next: NextFunction) => {
        const {email, password} = req.body;

        const existingUser = await User.findOne({email}).catch(next);

        if (!existingUser) {
            throw new BadRequest('Email not found');
        }

        const passwordsMatch = await Password.compare(existingUser.password, password);
        
        if (!passwordsMatch) {
            throw new BadRequest('Invalid Credentials');
        }

        const jwtUser = jwt.sign({ id: existingUser.id, email: existingUser.email}, process.env.JWT_KEY!);

        req.session = {
            jwt: jwtUser
        };

        return res.status(200).send(existingUser);
    }
);


export {router as signinUserRouter};