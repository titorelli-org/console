export const isJson = (str: string) => {
  try {
    JSON.parse(str)

    return true
  } catch (_e: unknown) {
    return false
  }
}
