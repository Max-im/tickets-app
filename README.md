# Application for tickets booking

## Microservice approach to application building

![example workflow](https://github.com/max-im/multi_docker_app_deploy_flow/actions/workflows/deploy-aws.yml/badge.svg)

## Features

- Kubernetes
- Docker
- Nginx
- Next.js
- Node
- TypeScript
- MongoDB
- Jest
- NATS streaming
- NPM module for sharing common code

## auth service

| method | url                    | body                              | description           |
| ------ | ---------------------- | --------------------------------- | --------------------- |
| POST   | /api/users/signup      | {email: string, password: string} | create user           |
| POST   | /api/users/signin      | {email: string, password: string} | login user            |
| POST   | /api/users/signout     | -                                 | logout user           |
| GET    | /api/users/currentuser | -                                 | get current user data |

## tickets service

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

## payments service

## expiration service

## Using

- clone the repo
- kubectl create secret generic jwt-secret --from-literal=jwt=<secretString>
