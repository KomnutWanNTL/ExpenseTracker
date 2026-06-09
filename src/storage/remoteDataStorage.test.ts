import { describe, expect, it } from 'vitest';

import type { AppData } from './remoteDataStorage';
import { mergeData } from './remoteDataStorage';

function createData(noteCategoryMap: AppData['noteCategoryMap']): AppData {
  return {
    expenses: [],
    budgets: [],
    noteCategoryMap,
  };
}

describe('remoteDataStorage.mergeData noteCategoryMap conflicts', () => {
  it('keeps remote specific category when local value is other', () => {
    const remote = createData({ uniqlo: 'shopping' });
    const local = createData({ uniqlo: 'other' });

    const merged = mergeData(local, remote);

    expect(merged.noteCategoryMap.uniqlo).toBe('shopping');
  });

  it('still allows local specific category to override remote', () => {
    const remote = createData({ uniqlo: 'shopping' });
    const local = createData({ uniqlo: 'food' });

    const merged = mergeData(local, remote);

    expect(merged.noteCategoryMap.uniqlo).toBe('food');
  });
});