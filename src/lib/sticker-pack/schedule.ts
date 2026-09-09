// Serial pack scheduler. SenseNova enforces one in-flight request per API key
// (verified 2026-09-08: 2nd concurrent call 429s instantly, back-to-back serial
// calls succeed), so the pack runs strictly one sticker at a time with retry
// for transient 429/5xx. Progress is real: completed sticker count.

export interface QueueTask<T> {
  id: string;
  run: () => Promise<T>;
}

export interface QueueOptions<T> {
  /** Retries for transient failures (429 / network / 5xx). */
  retries?: number;
  retryDelayMs?: number;
  isRetryable?: (error: unknown) => boolean;
  /** Abort check between tasks. */
  shouldStop?: () => boolean;
  onTaskStart?: (id: string, index: number) => void;
  onTaskSettled?: (id: string, index: number, result: T | null, error: unknown) => void;
  /** Fired when an attempt fails — `willRetry` tells whether it gets another go. */
  onTaskError?: (id: string, error: unknown, attempt: number, willRetry: boolean) => void;
}

export interface QueueResult<T> {
  succeeded: { id: string; value: T }[];
  failed: { id: string; error: unknown }[];
}

export function isRetryablePackError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  // HTTP layer marks transient statuses in the message; see api client.
  return /\(429\)|\(500\)|\(502\)|\(503\)|\(504\)|network/i.test(error.message);
}

export async function runSerialQueue<T>(
  tasks: QueueTask<T>[],
  options: QueueOptions<T> = {},
): Promise<QueueResult<T>> {
  const retries = options.retries ?? 1;
  const retryDelayMs = options.retryDelayMs ?? 4000;

  const result: QueueResult<T> = { succeeded: [], failed: [] };

  for (let index = 0; index < tasks.length; index++) {
    const task = tasks[index];
    if (options.shouldStop?.()) break;

    options.onTaskStart?.(task.id, index);

    let value: T | null = null;
    let error: unknown = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        value = await task.run();
        error = null;
        break;
      } catch (caught) {
        error = caught;
        const retryable = options.isRetryable?.(error) ?? isRetryablePackError(error);
        const willRetry = retryable && attempt < retries;
        options.onTaskError?.(task.id, caught, attempt + 1, willRetry);
        if (willRetry) {
          await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
          continue;
        }
        break;
      }
    }

    if (error === null && value !== null) {
      result.succeeded.push({ id: task.id, value });
      options.onTaskSettled?.(task.id, index, value, null);
    } else {
      result.failed.push({ id: task.id, error });
      options.onTaskSettled?.(task.id, index, null, error);
    }
  }

  return result;
}
