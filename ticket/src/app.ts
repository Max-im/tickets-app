import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import coockieSession from 'cookie-session';


const app = express();

app.set('trust proxy', true);
app.use(coockieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));
app.use(cors());
app.use(express.json());



export {app};


