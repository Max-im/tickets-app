import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  function signin(): string[];
}

jest.mock('../nats-wrapper');

let mongo: any;
jest.setTimeout(1000 * 100);

beforeAll(async () => {
  process.env.JWT_KEY = 'test_string';
  mongo = await MongoMemoryServer.create();

  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  const JWT = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: JWT };

  const jsonCookie = JSON.stringify(session);

  const base64 = Buffer.from(jsonCookie).toString('base64');

  const prefix = 'session=';

  return [`${prefix}${base64}`];
};
