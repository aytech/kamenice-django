import { Rule } from "antd/lib/form"

interface IFormHelper {
  requiredRule: (message: string) => Rule
  trim: (value: string | undefined) => string | undefined
}
export const FormHelper: IFormHelper = {
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