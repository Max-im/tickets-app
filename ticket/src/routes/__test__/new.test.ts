import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Ticket';

const url = '/api/tickets'

it ('has POST route for /api/tickets', async () => {
    const response = await request(app)
        .post(url)
        .send({});

    expect(response.status).not.toEqual(404);
});

it ('accessable for authed users only', async () => {
    await request(app)
        .post(url)
        .send({})
        .expect(401);
});

it ('return NOT 401 status if user signed in', async () => {
    const response = await request(app)
        .post(url)
        .set('Cookie', global.signin())
        .send({});

    expect(response.status).not.toEqual(401);
});

it ('return error if invalid title supplied', async () => {
    await request(app)
        .post(url)
        .set('Cookie', global.signin())
        .send({title: '', price: '10'})
        .expect(422);

    await request(app)
        .post(url)
        .set('Cookie', global.signin())
        .send({ price: 10})
        .expect(422)
});

it ('return error if invalid price supplied', async () => {
    await request(app)
        .post(url)
        .set('Cookie', global.signin())
        .send({title: 'title'})
        .expect(422);

    await request(app)
        .post(url)
        .set('Cookie', global.signin())
        .send({ title: 'title', price: -10})
        .expect(422)
});

it ('create ticket with valid input data', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const title = 'testTitle'
    const price = 20;

    await request(app)
        .post(url)
        .set('Cookie', global.signin())
        .send({ title, price})
        .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(price);
    expect(tickets[0].title).toEqual(title);
});