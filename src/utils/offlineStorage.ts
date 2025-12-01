// IndexedDB utilities for offline photo storage
const DB_NAME = 'CropAnalyzerOffline';
const STORE_NAME = 'pendingAnalysis';
const MAX_PHOTOS = 5;

export interface PendingAnalysis {
  id: string;
  image: string;
  language: string;
  location?: { lat: number; lng: number; name?: string };
  timestamp: number;
}

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const savePendingAnalysis = async (analysis: PendingAnalysis): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  
  // Check count and remove oldest if at limit
  const count = await new Promise<number>((resolve) => {
    const countRequest = store.count();
    countRequest.onsuccess = () => resolve(countRequest.result);
  });
  
  if (count >= MAX_PHOTOS) {
    const allItems = await getAllPendingAnalyses();
    const oldest = allItems.sort((a, b) => a.timestamp - b.timestamp)[0];
    if (oldest) {
      await deletePendingAnalysis(oldest.id);
    }
  }
  
  store.add(analysis);
};

export const getAllPendingAnalyses = async (): Promise<PendingAnalysis[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deletePendingAnalysis = async (id: string): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  store.delete(id);
};

export const clearAllPendingAnalyses = async (): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  store.clear();
};
