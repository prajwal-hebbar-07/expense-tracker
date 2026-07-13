import { sql } from 'drizzle-orm';

import { bankAccounts, categories, db, transactions } from './index';

db.transaction((tx) => {
  tx.delete(transactions).run();
  tx.delete(bankAccounts).run();
  tx.delete(categories).run();
  tx.run(
    sql.raw(
      "DELETE FROM sqlite_sequence WHERE name IN ('transactions', 'bank_accounts', 'categories')",
    ),
  );
});

console.log('Database reset complete. All accounts and transactions were removed.');
