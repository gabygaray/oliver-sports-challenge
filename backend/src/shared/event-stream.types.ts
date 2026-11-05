export interface EventStream {
    /** Aborts when the client disconnects, so in-flight model calls can be cancelled. */
    readonly signal: AbortSignal;
    send(event: string, data: unknown): void;
    close(): void;
}
