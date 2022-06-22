import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/Ticket';

const url = '/api/tickets';

interface ITicketAttr {
    price: number;
    title: string;
}

const createTicket = async ({price, title}: ITicketAttr) => {
    await request(app)
    .post(url)
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(201);
}

it ('return list of tickets', async () => {
    const seed = [
        {price: 20, title: 'ticket-1'},
        {price: 25, title: 'ticket-2'},
        {price: 30, title: 'ticket-3'}
    ];

    for (const item of seed) {
        await createTicket(item);
    }
    
    const response = await request(app)
    .get(url)
    .send()
    .expect(200);

    expect(response.body.length).toEqual(seed.length);
});

