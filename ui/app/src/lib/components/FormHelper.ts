import { Rule } from "antd/lib/form"

interface IFormHelper {
  requiredRule: Rule
  trim: (value: string | undefined) => string | undefined
}
export const FormHelper: IFormHelper = {
  requiredRule: {
    required: true,
    message: "pole je povinné"
  },
  trim: (value: string | undefined): string | undefined => {
    return value === undefined ? value : value.trim()
  }
}