const DB = "snacc"
const STORE = "kv"

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE))
        request.result.createObjectStore(STORE)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function run<T>(
  mode: IDBTransactionMode,
  act: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(STORE, mode)
        const request = act(transaction.objectStore(STORE))
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
        transaction.oncomplete = () => db.close()
      })
  )
}

export function idbGet<T>(key: string): Promise<T | undefined> {
  return run<T | undefined>(
    "readonly",
    (store) => store.get(key) as IDBRequest<T | undefined>
  )
}

export function idbSet<T>(key: string, value: T): Promise<void> {
  return run("readwrite", (store) => store.put(value, key)).then(
    () => undefined
  )
}

export function idbDelete(key: string): Promise<void> {
  return run("readwrite", (store) => store.delete(key)).then(() => undefined)
}
