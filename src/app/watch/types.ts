export enum WatchType {
    ADDED, MODIFIED, DELETED
}

export interface WatchEvent<T> {
    type: string,
    object: T,
}
