import { describe, expect, it } from 'vitest';
import { DataManager } from './DataManager';

interface TestUser {
  username: string;
  password: string;
}

describe('DataManager', () => {
  it('returns named records from JSON data files', () => {
    const user = DataManager.getRecord<TestUser>('users.json', 'validUser');

    expect(user.username).toBe('standard_user');
    expect(user.password).toBe('secret_sauce');
  });
});
