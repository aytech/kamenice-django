interface INumberHelper {
  formatCurrency: (amount?: number | string | null) => string | null | undefined
  decodeCurrency: (amount: string) => number
}

export const NumberHelper: INumberHelper = {
  formatCurrency: function (amount?: number | string | null): string | null | undefined {
    if (amount !== undefined && amount !== null) {
      return Intl.NumberFormat("en-US", { style: "decimal", minimumFractionDigits: 2 }).format(Number(amount))
    }
    return amount
  },
  decodeCurrency: function (amount: string): number {
    return Number(amount.replaceAll(/[,\s]+/ig, ""))
  }
}