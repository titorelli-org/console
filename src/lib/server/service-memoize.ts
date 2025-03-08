export const memoize = <T>(fn: () => T) => {
  let cache: T | null = null

  return () => cache = cache ?? fn()
}
