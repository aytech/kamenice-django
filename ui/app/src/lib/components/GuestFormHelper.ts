import { Rule } from "antd/lib/form";
import { OptionsType } from "../Types";
import { FormHelper } from "./FormHelper";

interface IGuestFormHelper {
  ageOptions: OptionsType[]
  requiredAlphaRule: (message: string) => Rule
}

export const GuestFormHelper: IGuestFormHelper = {
  ageOptions: [
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
  }
}