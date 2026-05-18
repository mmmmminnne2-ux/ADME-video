import { openDB } from 'idb';
import { FrameTemplate } from '@/types';

const dbPromise = openDB('dopamine-frame-db', 1, {
  upgrade(db) { if (!db.objectStoreNames.contains('templates')) db.createObjectStore('templates', { keyPath: 'id' }); }
});

export const templateDB = {
  async getAll(): Promise<FrameTemplate[]> { return (await dbPromise).getAll('templates'); },
  async save(item: FrameTemplate) { return (await dbPromise).put('templates', item); },
  async remove(id: string) { return (await dbPromise).delete('templates', id); }
};
