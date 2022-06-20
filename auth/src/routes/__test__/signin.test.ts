import request from 'supertest';
import { app } from '../../app';

it ('fails when an email that does not exists is supplied', async () => {
    return request(app)
        .post('/api/users/signin')
        .send({email: 'test@test.com', password: 'password'})
        .expect(400);
});

it ('fails when incorect password is supplied', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({email: 'test@test.com', password: 'password'})
        .expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({email: 'test@test.com', password: 'incorect'})
        .expect(400);
});

it ('return 200 and cookie when corect data is supplied', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({email: 'test@test.com', password: 'password'})
        .expect(201);

    const response = await request(app)
        .post('/api/users/signin')
        .send({email: 'test@test.com', password: 'password'})
        .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
});
