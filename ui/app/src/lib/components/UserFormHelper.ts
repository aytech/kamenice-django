import { Rule } from "antd/lib/form";
import { FormHelper } from "./FormHelper";

interface IUserFormHelper {
  getGuestResponseErrorList: (errorString: string) => Array<string>
  phoneCodeRequiredRules: Rule[]
  requiredAlphaRules: Rule[]
  requiredNumericRules: Rule[]
}

export const UserFormHelper: IUserFormHelper = {
  getGuestResponseErrorList: (errorString: string) => {
    try {
      return Array.from(
        Object.values(
          JSON.parse(errorString.replaceAll("'", "\""))
        ), ((list: any) => list[ 0 ])
      )
    } catch (error) {
      return [ "Chyba serveru, kontaktujte správce" ]
    }
  },
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