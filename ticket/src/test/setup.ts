import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
    function signin(): Promise<string[]>;
}

let mongo: any;

beforeAll(async() => {
    jest.setTimeout(1000 * 100);
    process.env.JWT_KEY = 'test_string';
    mongo = await MongoMemoryServer.create();

    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    jest.setTimeout(1000 * 100);
    await mongo.stop();
    await mongoose.connection.close();
});


global.signin = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/users/signup')
        .send({email, password})
        .expect(201);

    const cookie = response.get('Set-Cookie');

    return cookie;
}