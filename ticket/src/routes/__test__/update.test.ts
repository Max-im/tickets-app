import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/Ticket';
import { createTicket } from './list.test';

const url = '/api/tickets';

it ('return 404 if the ticket is not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`${url}/${id}`)
        .set('Cookie', global.signin())
        .send({title: "title", price: 20})
        .expect(404);
});

it ('return 401 if user is not auth', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`${url}/${id}`)
        .send({title: "title", price: 20})
        .expect(401);
});

it ('return 401 if user not own the ticket', async () => {
    const response = await createTicket({title: 'old-title', price: 20});

    await request(app)
        .put(`${url}/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({title: "new-title", price: 100})
        .expect(401);
});

it ('return 422 if invalid title or price supplied', async () => {
    const cookie = global.signin()

    const response = await request(app)
        .post(url)
        .set('Cookie', cookie)
        .send({ title: "title", price: 20 })
        .expect(201);

    await request(app)
        .put(`${url}/${response.body.id}`)
        .set('Cookie', cookie)
        .send({title: "new-title", price: -100})
        .expect(422);
        
    await request(app)
        .put(`${url}/${response.body.id}`)
        .set('Cookie', cookie)
        .send({title: "", price: 100})
        .expect(422);

});

it ('updates ticket privided valid inputs', async () => {
    const cookie = global.signin()
    
    const response = await request(app)
        .post(url)
        .set('Cookie', cookie)
        .send({ title: "title", price: 20 })
        .expect(201);

    const updateResponse = await request(app)
        .put(`${url}/${response.body.id}`)
        .set('Cookie', cookie)
        .send({title: "new-title", price: 100})
        .expect(200);


    expect(updateResponse.body.title).toEqual('new-title');
    expect(updateResponse.body.price).toEqual(100);
});