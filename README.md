<!-- <p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/6wj0hh6.jpg" alt="Project logo"></a>
</p> -->

<h3 align="center">Wallet Challenge</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/rafelis1997/bank-transfer-api)](https://github.com/rafelis1997/bank-transfer-api/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/rafelis1997/bank-transfer-api)](https://github.com/bank-transfer-api/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> Wallet api enabling transfers between clients and shops.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [TODO](../TODO.md)
- [Contributing](../CONTRIBUTING.md)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>

This project is a Node.js API of a digital wallet. It enables stable money transfers between users and shops, reverse tansfers and notify users by events.

This project is build following the best practices of clean architecture using Typescript, Nest.js and Prisma.

## ✅ Requirements <a name = "about"></a>

- [x] For both types of user, we need the Full Name, CPF, email and Password. CPF/CNPJ and emails must be unique in the system. Therefore, your system must only allow one registration with the same CPF or email address.

- [x] Users can send money (transfer) to merchants and between users.

- [x] Shopkeepers only receive transfers, they do not send money to anyone.

- [x] Validate that the user has a balance before the transfer.

- [x] Before finalizing the transfer, you must consult an external authorized service

- [x] The transfer operation must be a transaction (i.e. reversed in any case of inconsistency) and the money must return to the wallet of the sending user.

- [x] When collecting payment, the user or retailer needs to receive notification (e-mail, SMS) sent by a third-party service and this service may eventually be unavailable/unstable.

- [x] This service must be RESTFul.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them.

```
- Git
- Docker
- Docker compose
- Node.js >= 18.0
```

### Installing

A step by step series of examples that tell you how to get a development env running.

Clone o projeto para a pasta desejada

```
git clone https://github.com/rafelis1997/bank-transfer-api.git
```

You can start the whole application and dependencies with docker-compose. Access the cloned project folder, open the terminal and run the command 

```
docker compose up -d
```

You can check if the containers are running with

```
docker ps
```

Something similar to this should appear on your terminal

```
CONTAINER ID   IMAGE                         COMMAND                  CREATED        STATUS                    PORTS                                       NAMES
7e19ec7a72c0   wallet-challenge-wallet_api   "docker-entrypoint.s…"   37 hours ago   Up 4 seconds              0.0.0.0:3333->3333/tcp, :::3333->3333/tcp   wallet-challenge-wallet_api-1
f1f2ab73164c   postgres                      "docker-entrypoint.s…"   38 hours ago   Up 10 seconds (healthy)   0.0.0.0:5432->5432/tcp, :::5432->5432/tcp   wallet-challenge-postgres-1
```

To check the database, you should install the project dependencies with

```
npm install
```

Then run prisma studio with the following command

```
npx prisma studio
```

Something similar to this should appear on your terminal

```
Prisma Studio is up on http://localhost:5555
```

Access the link to see the database tables and data

If you want to run the app locally instead the container edit the docker-compose.yaml and comment the following lines

```
version: '3.0'

services:
  postgres:
    image: postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: wallet-challenge
      PGDATA: /data/postgres
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  # wallet_api:
  #   build:
  #     context: .
  #     dockerfile: Dockerfile
  #   environment:
  #     - PORT=3333
  #   ports:
  #     - "3333:3333"
  #   links:
  #     - postgres
  #   depends_on:
  #     postgres:
  #       condition: service_healthy
  #   command: "sh start.sh"
```

Install the project dependencies with

```
npm install
```

Run the project migrations with

```
npx prisma migrate deploy
```

Run the project with 

```
npm run start:dev
```

## 🔧 Running the tests <a name = "tests"></a>

This unit tests every use-case or business logic that is core to the application 

```
npm run test
```

## 🎈 Usage <a name="usage"></a>

This API has the following endpoints:

- [POST] /clients
  - Register clients

```
baseUrl = http://localhost:3333
POST {{baseUrl}}/clients
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "document": "string",
  "password": "string"
  "type": "COMPANY" | "INDIVIDUAL" ## optional
}
```

- [POST] /transfers
  - Create transfer

```
baseUrl = http://localhost:3333
POST {{baseUrl}}/transfers
Content-Type: application/json

{
  "senderId": "string", ## clientId
  "recipientId": "string", ## clientId
  "amount": number, ## amount in cents
  "description": "string" ## optional
}
```

- [POST] /transfers/reverse
  - Create transfer

```
baseUrl = http://localhost:3333
POST {{baseUrl}}/transfers/reverse
Content-Type: application/json

{
  "id": "string", ## transferId
}
```

## ⛏️ Built Using <a name = "built_using"></a>

- [PostgreSQL](https://www.postgresql.org/) - Database
- [Prisma](https://www.prisma.io/) - ORM
- [Nest.js](https://docs.nestjs.com/) - Server Framework

## ✍️ Authors <a name = "authors"></a>

- [@rafelis1997](https://github.com/rafelis1997) - All the project work
