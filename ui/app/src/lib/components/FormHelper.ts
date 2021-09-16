import { Rule } from "antd/lib/form"
import { OptionsType } from "../Types"

interface IFormHelper {
  guestAgeOptions: OptionsType[]
  requiredAlphaRule: (message: string) => Rule
  requiredRule: (message: string) => Rule
  trim: (value: string | undefined) => string | undefined
}
export const FormHelper: IFormHelper = {
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
  requiredAlphaRule: (message: string) => {
    return {
      message: message,
      pattern: /^([A-Za-z\sáÁčČďĎéÉěĚíÍňŇřŘšŠťŤúÚůŮýÝžŽóÓ])+$/,
      transform: FormHelper.trim
    }
  },
  requiredRule: (message: string) => {
    return {
      required: true,
      message: message
    }
  },
  trim: (value: string | undefined): string | undefined => {
    return value === undefined ? value : value.trim()
  }
}