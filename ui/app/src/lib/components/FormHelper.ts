import { Rule } from "antd/lib/form"
import { Discount, IGuestForm, OptionsType } from "../Types"
import { NumberHelper } from "./NumberHelper"

interface PriceInput {
  accommodation: string
  meal: string
  municipality: string
}
interface PriceModel {
  priceAccommodation?: string
  priceMeal?: string
  priceMunicipality?: string
  priceTotal?: string
}
interface IFormHelper {
  discountValidator: (
    message: string,
    fields: () => Discount[]
  ) => Rule
  getGuestCitizenship: (formData: IGuestForm) => string | null
  guestAgeOptions: OptionsType[]
  numberRule: (message: string) => Rule
  pscRule: (message: string) => Rule
  requiredAlphaRule: (message: string) => Rule
  requiredRule: (message: string) => Rule
  searchFilter: (input?: any, option?: any) => boolean
  trim: (value: string | undefined) => string | undefined
  updatePrice: (price: PriceInput, excludeField: string) => PriceModel
}

export const FormHelper: IFormHelper = {
  discountValidator: (
    message: string,
    fields: () => Discount[]
  ) => {
    return {
      message: message,
      validator: (_rule: any, value: number): Promise<void | Error> => {
        const duplicate = fields().filter((discount: any) => {
          return discount !== undefined && discount.type === value
        })
        if (duplicate !== undefined && duplicate.length > 1) {
          return Promise.reject(new Error("Fail discount validation, duplicate value"))
        }
        return Promise.resolve()
      }
    }
  },
  getGuestCitizenship: (formData: IGuestForm) => {
    if (formData.citizenship?.new !== undefined) {
      return formData.citizenship.new
    }
    if (formData.citizenship?.selected !== undefined) {
      return formData.citizenship.selected
    }
    return null
  },
  guestAgeOptions: [
    {
      label: "12+",
      value: "YOUNG"
    },
    {
      label: "3-12 let",
      value: "CHILD"
    },
    {
      label: "Do 3 let",
      value: "INFANT"
    },
    {
      label: "Dospělý",
      value: "ADULT"
    }
  ],
  numberRule: (message: string) => {
    return { message, pattern: /^[0-9]+$/ }
  },
  pscRule: (message: string) => {
    return { message, pattern: /^(\d{0,5})$/ }
  },
  requiredAlphaRule: (message: string) => {
    return {
      message: message,
      pattern: /^([A-Za-z\sáÁčČďĎéÉěĚíÍňŇřŘšŠťŤúÚůŮýÝžŽóÓ])+$/,
      transform: FormHelper.trim
    }
  },
  requiredRule: (message: string) => {
    return { required: true, message }
  },
  searchFilter: (input?: string, option?: OptionsType) => {
    if (input !== undefined) {
      const match = option?.label?.toString().toLowerCase().indexOf(input.toLowerCase())
      return match !== undefined && match >= 0
    }
    return false
  },
  trim: (value: string | undefined): string | undefined => {
    return value === undefined ? value : value.trim()
  },
  updatePrice: (price: PriceInput, excludeField: string): PriceModel => {
    const model: PriceModel = {}
    const accommodation: number = Number(NumberHelper.decodeCurrency(price.accommodation))
    const meal: number = Number(NumberHelper.decodeCurrency(price.meal))
    const municipality: number = Number(NumberHelper.decodeCurrency(price.municipality))
    const total = NumberHelper.formatCurrency(accommodation + meal + municipality)
    if (excludeField !== "priceAccommodation") {
      model.priceAccommodation = NumberHelper.formatCurrency(accommodation)
    }
    if (excludeField !== "priceMeal") {
      model.priceMeal = NumberHelper.formatCurrency(meal)
    }
    if (excludeField !== "priceMunicipality" && municipality !== null) {
      model.priceMunicipality = NumberHelper.formatCurrency(municipality)
    }
    if (excludeField !== "priceTotal" && total !== null) {
      model.priceTotal = total
    }
    return model
  }
}