# Daily Finance Pipeline

A financial automation system built with NestJS and PostgreSQL, designed to manage users, bank accounts, transactions, and compute financial metrics like balances, net worth, and borrowing capacity.

⸻

Overview

This project provides:
• Person Management – Create/delete users, manage relationships
• Bank Accounts – IBAN-based account system with balance tracking
• Transactions – Record and process bank transactions (single/bulk)
• Friend Network – Track who can borrow from whom
• Financial Processes – Automate balance, net worth & borrowing calculations
• TODO(GremlinService): Although the application uses PostgreSQL with TypeORM for core data management, some relationships—especially bidirectional, recursive, or network-based ones like friendships—are far more efficient and expressive when modeled as graphs.

⸻

Tech Stack
• Framework: NestJS (TypeScript)
• Database: PostgreSQL with TypeORM
• Containerized: Docker + Docker Compose
• Mock Data: Faker.js
• Testing: Jest
• Code Quality: ESLint, Prettier

⸻

Architecture

Key Entities
• Person: UUID, name/email, has accounts & friends
• BankAccount: IBAN, balance, linked to person
• BankTransaction: UUID, amount, counterparty IBAN, linked to account
• Friend: Links two persons, prevents self-friendship
• ProcessRun: Logs nightly runs for balances, net worth, borrowing

⸻

Getting Started

1. Prerequisites
   • Node.js v18+
   • Yarn
   • Docker + Docker Compose

2. Setup Instructions

git clone <https://github.com/RezaBG/daily-finance-pipeline>
cd daily-finance-pipeline
yarn install

Create .env.development:

NODE_ENV=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
PG_EMAIL=
PG_PASSWORD=

Start DB services:

docker-compose up -d

Seed mock data:

yarn run seed

⸻

Running the App

## Dev mode

yarn start:dev

## Prod

yarn start:prod

## Debug

yarn start:debug

App runs on: <http://localhost:3000>

⸻

📡 API Endpoints

Person
• GET /person – List all
• POST /person – Create
• GET /person/:id – Get by ID
• DELETE /person/:id – Delete
• GET /person/borrowings/:personId – Borrowing capacity

Bank Accounts
• GET /bank-account
• POST /bank-account
• GET /bank-account/:iban
• DELETE /bank-account/:iban

Transactions
• GET /bank-transaction
• POST /bank-transaction
• POST /bank-transaction/bulk

Friends
• GET /friend
• POST /friend
• DELETE /friend

Processes
• POST /process – Run all processes
• POST /process/:processId – Run specific one (1–3)

⸻

Processes Explained 1. Balance – Sums all transactions → updates current_balance 2. Net Worth – Adds all account balances per person 3. Borrowing Capacity – Based on friend balances above current balance

Webhook support for batch transactions via POST /process

⸻

Testing

yarn test # Unit tests  
yarn test:e2e # End-to-end  
yarn test:cov # Coverage

⸻

Project Structure

src/
├── person/ # Person module
├── bank-account/ # Account logic
├── bank-transaction/ # Transactions
├── friend/ # Friend relations
├── process/ # Financial processes
├── seed/ # Data generators
└── data/ # Sample JSON

⸻

Scripts
• yarn build – Compile
• yarn lint – Lint with ESLint
• yarn format – Format with Prettier
• yarn seed – Populate DB

PgAdmin available at <http://localhost:5050>

⸻

Development Workflow

Key Branches 1. main – Initial setup 2. feature/define-modules-and-entities 3. feature/define-dtos 4. feature/mock-data

⸻

Usage Examples

POSTMAN ENV LINK:
https://app.getpostman.com/join-team?invite_code=b068277d63bee57eeaf1e49a37eacb6c1654d9fdb0417243f22f5bf2eeaac743&target_code=2019140d609ff7ab01e0e8424e986872
