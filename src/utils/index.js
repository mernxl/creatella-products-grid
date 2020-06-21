
export const formatCurrency = (valueInCents: number) => {
  return `$${(valueInCents / 100).toFixed(2)}`
}

export * from './date.utils'
export * from './fetch.utils'
