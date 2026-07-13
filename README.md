# Expense Tracker

A simple and efficient expense tracking application to manage personal finances and categorize spending.

## Features

- Track daily expenses
- Categorize spending
- View expense summaries and analytics
- Export expense reports

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Running the Application

```bash
pnpm dev
```

### Resetting the Database

To remove all bank accounts, transactions, and categories and start with an
empty database:

```bash
pnpm db:reset
```

This keeps the SQLite database and schema in place. Run `pnpm seed` afterward
if you want to restore the sample transactions.

## Project Structure

- `/src` - Source code
- `/public` - Public assets
- `/tests` - Test files

## License

MIT License
