import { Rule } from "antd/lib/form";
import { FormHelper } from "./FormHelper";

interface IUserFormHelper {
  phoneCodeRequiredRules: Rule[]
  requiredAlphaRules: Rule[]
  requiredNumericRules: Rule[]
}

export const UserFormHelper: IUserFormHelper = {
  phoneCodeRequiredRules: [
    FormHelper.requiredRule,
    {
      message: "zadejte kód ve formátu 420, +420 nebo (420)",
      pattern: /^\+?\(?[0-9]*\)?$/,
      transform: FormHelper.trim
    }
  ],
  requiredAlphaRules: [
    FormHelper.requiredRule,
    {
      message: "zadejte pouze text bez mezer",
      pattern: /^([A-Za-z])+$/,
      transform: FormHelper.trim
    }
  ],
  requiredNumericRules: [
    FormHelper.requiredRule,
    {
      message: "zadejte pouze čísla",
      pattern: /^[\d\s]+$/,
      transform: FormHelper.trim
    }
  ]
}