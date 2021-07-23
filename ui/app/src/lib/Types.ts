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
export type ReservationMeal = "BREAKFAST" | "HALFBOARD" | "NOMEAL"

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

export interface Guest {
  id?: number | string
  name: string
  surname: string
}

export interface Suite {
  id: number | string
  number?: number | null
  title?: string
}

export interface IReservation {
  fromDate: Moment
  guest?: Guest
  meal?: ReservationMeal
  id?: number
  notes?: string | null
  purpose?: string | null
  roommates: Array<Guest>
  suite: Suite
  toDate: Moment
  type: ReservationTypeKey
}

export interface SuiteForm {
  number: number,
  title: string
}

export interface OptionsType {
  label: string,
  value: string | number
}

export interface CustomGroupFields {
  roomNumber: number | null
  suiteTitle: string
}

export interface CustomItemFields {
  color?: string
  type?: string
}