# Daily Finance Pipeline

A financial automation system built with NestJS and PostgreSQL, designed to manage users, bank accounts, transactions, and compute financial metrics like balances, net worth, and borrowing capacity.

---

## Overview

This project provides:

- **Person Management**: Create/delete users, manage relationships
- **Bank Accounts**: IBAN-based system with balance tracking
- **Transactions**: Record and process bank transactions (single or bulk)
- **Friend Network**: Track who can borrow from whom
- **Financial Processes**: Automate balance, net worth, and borrowing calculations

> **Note:** Although the application uses PostgreSQL with TypeORM for core data management, some relationships—especially bidirectional, recursive, or network-based ones like friendships—are far more efficient and expressive when modeled as graphs.  
> _TODO(GremlinService): Consider a graph DB for these relationships._

---

## Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with TypeORM
- **Containerization**: Docker & Docker Compose
- **Mock Data**: Faker.js
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

---

## Architecture

### Key Entities

- **Person**: UUID, name/email, has accounts & friends
- **BankAccount**: IBAN, balance, linked to person
- **BankTransaction**: UUID, amount, counterparty IBAN, linked to account
- **Friend**: Links two persons, prevents self-friendship
- **ProcessRun**: Logs nightly runs for balances, net worth, borrowing, etc.

---

## Getting Started

### Prerequisites

- Node.js v18+
- Yarn
- Docker & Docker Compose

### Setup Instructions

```bash
git clone https://github.com/RezaBG/daily-finance-pipeline
cd daily-finance-pipeline
yarn install
```

Create `.env.development` with the following variables:

```bash
NODE_ENV=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
PG_EMAIL=
PG_PASSWORD=
```

Start database services:

```bash
docker-compose up -d
```

Seed mock data:

```bash
yarn run seed
```

---

## Running the App

- **Development:**  
  `yarn start:dev`
- **Production:**  
  `yarn start:prod`
- **Debug:**  
  `yarn start:debug`

App runs at: [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

### Person

- `GET /person` – List all persons
- `POST /person` – Create a person
- `GET /person/:id` – Get person by ID
- `DELETE /person/:id` – Delete person
- `GET /person/borrowings/:personId` – Get borrowing capacity

### Bank Accounts

- `GET /bank-account`
- `POST /bank-account`
- `GET /bank-account/:iban`
- `DELETE /bank-account/:iban`

### Transactions

- `GET /bank-transaction`
- `POST /bank-transaction`
- `POST /bank-transaction/bulk`

### Friends

- `GET /friend`
- `POST /friend`
- `DELETE /friend`

### Processes

- `POST /process` – Run all processes
- `POST /process/:processId` – Run specific process (IDs 1–3)

---

## Financial Processes

1. **Balance:** Sums all transactions and updates `current_balance`
2. **Net Worth:** Adds all account balances per person
3. **Borrowing Capacity:** Based on friend balances above current balance

> _Webhook support for batch transactions via `POST /process`_

---

## Testing

- `yarn test` – Unit tests
- `yarn test:e2e` – End-to-end tests
- `yarn test:cov` – Coverage

> **Note:** For test database creation, you need a `.env.test` file with the same variables as `.env.development`.

---

## Project Structure

```bash
src/
├── person/            # Person module
├── bank-account/      # Account logic
├── bank-transaction/  # Transactions
├── friend/            # Friend relations
├── process/           # Financial processes
├── seed/              # Data generators
└── data/              # Sample JSON
```

---

## Scripts

- `yarn build` – Compile project
- `yarn lint` – Lint with ESLint
- `yarn format` – Format with Prettier
- `yarn seed` – Populate DB

PgAdmin available at [http://localhost:5050](http://localhost:5050)

---

## Development Workflow

### Key Branches

1. `main` – Initial setup
2. `feature/define-modules-and-entities`
3. `feature/define-dtos`
4. `feature/mock-data`

---

## Usage Examples

**POSTMAN ENV LINK:** [Postman Team Invite Link](https://www.postman.com/volleymate-team-fastapi/daily-finance)
