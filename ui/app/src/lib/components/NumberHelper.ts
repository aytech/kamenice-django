interface INumberHelper {
  formatCurrency: (amount: number | null) => string | null
  decodeCurrency: (amount: string) => number
}

export const NumberHelper: INumberHelper = {
  formatCurrency: function (amount: number | null): string | null {
    if (amount !== null) {
      return Intl.NumberFormat("en-US", { style: "decimal", minimumFractionDigits: 2 }).format(amount)
    }
    return amount
  },
  decodeCurrency: function (amount: string): number {
    return Number(amount.replaceAll(/[,\s]+/ig, ""))
  }
}