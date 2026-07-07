import { describe, expect, it } from 'vitest';
import { PathManager } from './PathManager';

describe('PathManager', () => {
  it('sanitizes scenario names for filesystem-safe folders', () => {
    expect(PathManager.sanitize('Login exitoso con credenciales validas!')).toBe(
      'login-exitoso-con-credenciales-validas'
    );
  });

  it('generates ISO date folder names', () => {
    expect(PathManager.dateStamp(new Date('2026-07-07T10:20:30.000Z'))).toBe('2026-07-07');
  });
});
