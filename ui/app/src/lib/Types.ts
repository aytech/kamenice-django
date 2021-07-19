import { Day } from "react-modern-calendar-datepicker"
import { Moment } from "moment"

export type ReservationType = "Závazná Rezervace" | "Nezávazná Rezervace" | "Aktuálně Ubytování" | "Obydlený Termín"
export type ReservationTypeKey = "BINDING" | "NONBINDING" | "ACCOMMODATED" | "INHABITED"
export type ReserveDay = Day & { hour?: number, minute?: number }

export const Reservation = {
  getType: (key: ReservationTypeKey): ReservationType => {
    switch (key) {
      case "NONBINDING":
        return "Nezávazná Rezervace"
      case "ACCOMMODATED":
        return "Aktuálně Ubytování"
      case "INHABITED":
        return "Obydlený Termín"
      case "BINDING":
      default: return "Závazná Rezervace"
    }
  }
}

export type DrawerType = "guest" | "suite"

export interface ReservationRange {
  from: Moment
  to: Moment
}

export interface ReserveRange {
  id?: number
  from: ReserveDay
  to: ReserveDay
  type: ReservationTypeKey
}

export interface Room {
  id: number
  name: string
  reservedRanges: ReserveRange[]
}

interface Address {
  municipality?: string
  psc?: number
  street?: string
}

interface Citizenship {
  new?: string
  selected?: string
}

export interface GuestForm {
  age: string,
  address?: Address
  citizenship?: Citizenship
  email: string
  gender?: string
  id?: number
  name: string
  identity: string
  phone: string
  surname: string
  visa?: string
}

export interface GuestErrorResponse {
  email: Array<string>
  gender: Array<string>
  identity: Array<string>
  name: Array<string>
  phone_number: Array<string>
  surname: Array<string>
}

export interface SuiteForm {
  number: number,
  title: string
}

export interface OptionsType {
  label: string,
  value: string | number
}