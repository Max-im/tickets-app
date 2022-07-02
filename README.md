# Application for tickets booking

## Microservice approach to application building

![auth test](https://github.com/max-im/tickets-app/actions/workflows/auth-test.yaml/badge.svg)
![orders test](https://github.com/max-im/tickets-app/actions/workflows/orders-test.yaml/badge.svg)
![payment test](https://github.com/max-im/tickets-app/actions/workflows/payment-test.yaml/badge.svg)
![ticket test](https://github.com/max-im/tickets-app/actions/workflows/ticket-test.yaml/badge.svg)

## Features

- Kubernetes
- Docker
- Next.js
- Node
- TypeScript
- MongoDB
- Redis
- Jest
- NATS streaming
- NPM module for sharing common code

## client service

Next app to of the app

## auth service

| method | url                    | body                              | description           |
| ------ | ---------------------- | --------------------------------- | --------------------- |
| POST   | /api/users/signup      | {email: string, password: string} | create user           |
| POST   | /api/users/signin      | {email: string, password: string} | login user            |
| POST   | /api/users/signout     | -                                 | logout user           |
| GET    | /api/users/currentuser | -                                 | get current user data |

## ticket service

| method | url              | body                           | description      |
| ------ | ---------------- | ------------------------------ | ---------------- |
| POST   | /api/tickets     | {title: string, price: number} | create ticket    |
| GET    | /api/tickets     | -                              | get tickets list |
| GET    | /api/tickets/:id | -                              | get ticket       |
| PUT    | /api/tickets/:id | {title: string, price: number} | update ticket    |

## orders service

| method | url             | body               | description        |
| ------ | --------------- | ------------------ | ------------------ |
| GET    | /api/orders     | -                  | a user orders list |
| GET    | /api/orders/:id | -                  | get order by id    |
| POST   | /api/orders     | {ticketId: string} | create new order   |
| DELETE | /api/orders/:id | -                  | delete order by id |

## payment service

| method | url          | body                             | description    |
| ------ | ------------ | -------------------------------- | -------------- |
| POST   | /api/payment | {token: string, orderId: string} | handle payment |

## expiration service

internal service with no endpoints, listen and publish events to make orders expire

## Usage

- clone the repo
- install dependencies for every service
- make sure you wire up kubernetes minikube and skaffold
- set host `tickets.net` on your local machine equal to ingress-nginx ip (run `minikube ip` to see your minikube ip address)
- set up jwt-secret value on kubernetes env `kubectl create secret generic jwt-secret --from-literal=jwt=<secretString>`
- set up stripe-secret value on kubernetes env `kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=<secretString>`
- run `skaffold dev` for run on your local machine
- open https://tickets.net
