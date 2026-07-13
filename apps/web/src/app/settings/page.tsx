import { AccountManager } from '@/components/account-manager';
import { getAccountOverview } from '@/lib/accounts';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const overview = getAccountOverview();

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-5xl space-y-7">
        <div>
          <p className="eyebrow">Your banks</p>
          <h1 className="page-heading">Accounts</h1>
          <p className="page-description">
            Add your bank accounts, keep their balances current, and track spending for
            each bank separately.
          </p>
        </div>

        <AccountManager overview={overview} />
      </div>
    </div>
  );
}
