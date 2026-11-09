type CopyOperation = (isCurrent: () => boolean) => unknown;
type CopyErrorHandler = (error: unknown) => void;
/**
 * Runs a copy operation and keeps its success feedback visible from the most
 * recent successful attempt. Older asynchronous attempts cannot overwrite it.
 */
export declare function useCopyFeedback(duration?: number): {
    copied: boolean;
    runCopy: (operation: CopyOperation, onError?: CopyErrorHandler) => Promise<boolean>;
    reset: () => void;
};
export {};
