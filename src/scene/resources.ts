/** LIFO ownership also covers construction failures and repeat disposal. */
export function createDisposalScope() {
  const callbacks: (() => void)[] = [];
  let disposed = false;
  return {
    defer(callback: () => void) {
      if (disposed) callback();
      else callbacks.push(callback);
    },
    dispose() {
      if (disposed) return [];
      disposed = true;
      const errors: unknown[] = [];
      for (const callback of callbacks.reverse()) {
        try {
          callback();
        } catch (error) {
          errors.push(error);
        }
      }
      callbacks.length = 0;
      return errors;
    },
  };
}
