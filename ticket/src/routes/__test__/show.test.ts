import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/Ticket';

const url = '/api/tickets';

it ('returns 404 is ticket not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app).get(`${url}/${id}`).send().expect(404);
});

it ('returns ticket if ticket is found', async () => {
    const title = 'testTitle'
    const price = 20;

    const response = await request(app)
        .post(url)
        .set('Cookie', global.signin())
        .send({ title, price })
        .expect(201);

    const ticketResponse = await request(app)
        .get(`${url}/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.price).toEqual(price);
    expect(ticketResponse.body.title ).toEqual(title);
});