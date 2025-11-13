import { config } from '@/lib/config';
import { StorageAdapter } from '../adapters/StorageAdapter';
import InMemoryAdapter from '../adapters/InMemoryAdapter';

declare global {
  var dbAdapter: StorageAdapter | undefined;
}

function initializeAdapter(): StorageAdapter {
  const adapterType = config.DATABASE_ADAPTER;
  console.log(`Initializing database adapter: ${adapterType}`);

  switch (adapterType) {
    case 'in-memory':
      return new InMemoryAdapter();

    default:
      console.warn(`Unknown DATABASE_ADAPTER: "${adapterType}". Defaulting to in-memory.`);
      return new InMemoryAdapter();
  }
}

export function getDb(): StorageAdapter {
  if (process.env.NODE_ENV === 'production') {
    return initializeAdapter();
  } else {
    if (!global.dbAdapter) {
      global.dbAdapter = initializeAdapter();
    }
    return global.dbAdapter;
  }
}
