interface INumberHelper {
  formatCurrency: (amount?: number | string | null) => string | undefined
  decodeCurrency: (amount?: string | null) => string
}

export const NumberHelper: INumberHelper = {
  formatCurrency: function (amount?: number | string | null): string | undefined {
    if (amount !== undefined && amount !== null) {
      return Intl.NumberFormat("en-US", { style: "decimal", minimumFractionDigits: 2 }).format(Number(amount))
    }
    return "0.00"
  },
  decodeCurrency: function (amount?: string | null): string {
    return amount === undefined || amount === null ? "" : String(amount).replaceAll(/[,\s]+/ig, "")
  }

}