import request from 'supertest';
import { app } from '../../app';

const url = '/api/tickets';

interface ITicketAttr {
    price: number;
    title: string;
}

export const createTicket = async ({price, title}: ITicketAttr) => {
    const response = await request(app)
    .post(url)
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(201);

    return response;
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

