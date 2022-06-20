import request from 'supertest';
import { app } from '../../app';

it ('Returns 201 code on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({email: 'test@test.com', password: 'password'})
        .expect(201);
});

it ('Returns 422 code on invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({email: 'test.com', password: 'password'})
        .expect(422);
});

it ('Returns 422 code on invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({email: 'test@test.com', password: 'p'})
        .expect(422);
});

it ('Returns 422 code with missing email and password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({email: 'test@test.com'})
        .expect(422);

    await request(app)
        .post('/api/users/signup')
        .send({password: 'password'})
        .expect(422);

    await request(app)
        .post('/api/users/signup')
        .send({})
        .expect(422);
});

it ('Returns 400 code when try to signup on existing email', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({email: 'test@test.com', password: 'password'})
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({email: 'test@test.com', password: 'password'})
        .expect(400);
});

it ('Sets cookie after successful signup', async () => {
    const response  = await request(app)
        .post('/api/users/signup')
        .send({email: 'test@test.com', password: 'password'})
        .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});