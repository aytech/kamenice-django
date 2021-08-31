import { Rule } from "antd/lib/form";
import { OptionsType, Reservation, ReservationTypeKey } from "../Types";

interface IReservationFormHelper {
  getRequiredRule: (message: string) => Rule
  mealOptions: OptionsType[]
  reservationOptions: (OptionsType & { value: ReservationTypeKey })[]
}

export const ReservationFormHelper: IReservationFormHelper = {
  mealOptions: [
    {
      label: "Bez Stravy",
      value: "NOMEAL"
    },
    {
      label: "Jen Snídaně",
      value: "BREAKFAST"
    },
    {
      label: "Polopenze",
      value: "HALFBOARD"
    }
  ],
  reservationOptions: [
    {
      label: Reservation.getType("BINDING"),
      value: "BINDING"
    },
    {
      label: Reservation.getType("NONBINDING"),
      value: "NONBINDING"
    },
    {
      label: Reservation.getType("ACCOMMODATED"),
      value: "ACCOMMODATED"
    },
    {
      label: Reservation.getType("INHABITED"),
      value: "INHABITED"
    }
  ],
  getRequiredRule: (message: string): Rule => {
    return { required: true, message }
  }
}