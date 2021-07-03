import { FormInstance, Rule } from "antd/lib/form";
import { OptionsType, Reservation, ReservationTypeKey } from "../Types";

interface OID {
  id: number
}

interface IReservationFormHelper {
  getRequiredRule: (message: string) => Rule
  guestValidators: (form: FormInstance) => Rule[]
  reservationOptions: (OptionsType & { value: ReservationTypeKey })[]
  roommateValidators: (form: FormInstance) => Rule[]
}

export const ReservationFormHelper: IReservationFormHelper = {
  reservationOptions: [
    {
      label: Reservation.getType("binding"),
      value: "binding"
    },
    {
      label: Reservation.getType("nonbinding"),
      value: "nonbinding"
    },
    {
      label: Reservation.getType("accommodated"),
      value: "accommodated"
    },
    {
      label: Reservation.getType("inhabited"),
      value: "inhabited"
    }
  ],
  getRequiredRule: (message: string): Rule => {
    return { required: true, message }
  },
  guestValidators: (form: FormInstance): Rule[] => {
    return [
      {
        message: "host nemůže být stejný jako spolubydlící",
        validator: (_rule, value: number): Promise<void | Error> => {
          const roommates: Array<OID> = form.getFieldValue("roommates")
          if (roommates === undefined || roommates.length === 0) {
            return Promise.resolve()
          }
          const duplicate = roommates.filter((id: OID | undefined) => {
            return id !== undefined && id.id === value
          })
          if (duplicate === undefined || duplicate.length === 0) {
            return Promise.resolve()
          }
          return Promise.reject(new Error("Fail guest validation, equals to roommate"))
        }
      },
      {
        message: "vyberte hosta",
        required: true
      }
    ]
  },
  roommateValidators: (form: FormInstance): Rule[] => {
    return [
      {
        message: "spolubydlící je již vybrán",
        validator: (_rule, value: number): Promise<void | Error> => {
          const duplicates: Array<OID> = form.getFieldValue("roommates").filter((id: OID | undefined) => {
            return id !== undefined && id.id === value
          })
          if (duplicates === undefined || duplicates.length <= 1) {
            return Promise.resolve()
          }
          return Promise.reject(new Error("Fail roommate validation, duplicate value"))
        }
      },
      {
        message: "spolubydlící nemůže být stejný jako host",
        validator: (_rule, value: number): Promise<void | Error> => {
          if (form.getFieldValue("guest") !== value) {
            return Promise.resolve()
          }
          return Promise.reject(new Error("Fail roommate validation, equals to guest"))
        }
      }
    ]
  },
}