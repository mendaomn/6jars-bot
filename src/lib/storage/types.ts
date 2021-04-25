export interface StorageObj<T> {
    id: string;
    data: T
}
export type StorageError = string;
export type TaskEither<L, R> = L | R;