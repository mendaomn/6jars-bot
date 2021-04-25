import { StorageObj, TaskEither, StorageError } from "./types";

const inMemoryStorage: Record<string, StorageObj<any>> = {};

function makeId() {
    return Math.random().toString(36).substr(2, 9);
}

export function store<R>(query: string, data: R): TaskEither<StorageError, StorageObj<R>> {
    const storageObj = {
        id: makeId(),
        data
    }
    
    inMemoryStorage[query] = storageObj

    return storageObj;
}

export function load<R>(query: string): TaskEither<StorageError, StorageObj<R>> {
    const storedObj = inMemoryStorage[query];

    return storedObj 
        || 'loading failed'
}