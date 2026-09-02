import { describe, it, expect } from 'vitest';
import {
  authService,
  accountService,
  transactionService,
  transferService,
  beneficiaryService,
  cardService,
} from '../services/bankingServices';

describe('Banking Services & Business Rules Integration', () => {
  it('authenticates valid credentials and generates auth token', async () => {
    const res = await authService.login('durai@edkart.com', 'Password@123');
    expect(res.success).toBe(true);
    expect(res.token).toBeDefined();
    expect(res.user.fullName).toBe('Esakki Durai');
  });

  it('rejects invalid password credentials with 401 error', async () => {
    await expect(authService.login('durai@edkart.com', 'WrongPass')).rejects.toMatchObject({
      status: 401,
    });
  });

  it('loads accounts and computes valid positive balances', async () => {
    const accounts = await accountService.getAccounts();
    expect(accounts.length).toBeGreaterThanOrEqual(1);
    expect(accounts[0].balance).toBeGreaterThan(0);
  });

  it('executes fund transfer, creates transaction record, and deducts balance', async () => {
    const initialAccounts = await accountService.getAccounts();
    const source = initialAccounts[0];
    const initialBal = source.balance;

    const res = await transferService.executeTransfer({
      sourceAccountId: source.id,
      beneficiaryId: 'ben_01',
      amount: 1000,
      transferMode: 'IMPS',
      note: 'Test Automated Transfer',
    });

    expect(res.success).toBe(true);
    expect(res.transaction.amount).toBe(1000);
    expect(res.transaction.referenceId).toMatch(/^TXN/);
    expect(res.updatedBalance).toBe(initialBal - 1000);
  });

  it('toggles card freeze and unfreeze status', async () => {
    const cards = await cardService.getCards();
    const targetCard = cards[0];

    const freezeRes = await cardService.toggleFreeze(targetCard.id, 'FROZEN');
    expect(freezeRes.success).toBe(true);
    expect(freezeRes.card.status).toBe('FROZEN');

    const unfreezeRes = await cardService.toggleFreeze(targetCard.id, 'ACTIVE');
    expect(unfreezeRes.success).toBe(true);
    expect(unfreezeRes.card.status).toBe('ACTIVE');
  });
});
