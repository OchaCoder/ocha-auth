export declare const ioredisOptions: () => {
    url: string;
    socketTimeout: number;
    connectTimeout: number;
    retryStrategy: (attempt: number) => number;
    enableOfflineQueue: boolean;
    maxRetriesPerRequest: number;
};
