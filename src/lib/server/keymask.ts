import { Keymask } from 'keymask'

const keymaskNumber = new Keymask({
  seed: new Uint8Array([13, 18]).buffer,
  type: 'number'
})

export const maskNumber = (value: number) => {
  return keymaskNumber.mask(value)
}

export function unmaskNumber(value: string): number
export function unmaskNumber(value: undefined | null): null
export function unmaskNumber (value: string | undefined | null) {
  if (value == null)
    return null

  return keymaskNumber.unmask(value)
}
