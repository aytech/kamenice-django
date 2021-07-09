import { Day } from "react-modern-calendar-datepicker"

export type DrawerType = "user"
export type ReservationType = "Závazná Rezervace" | "Nezávazná Rezervace" | "Aktuálně Ubytování" | "Obydlený Termín"
export type ReservationTypeKey = "binding" | "nonbinding" | "accommodated" | "inhabited"
export type ReserveDay = Day & { hour?: number, minute?: number }

export const Reservation = {
  getType: (key: ReservationTypeKey): ReservationType => {
    switch (key) {
      case "nonbinding":
        return "Nezávazná Rezervace"
      case "accommodated":
        return "Aktuálně Ubytování"
      case "inhabited":
        return "Obydlený Termín"
      case "binding":
      default: return "Závazná Rezervace"
    }
  }
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

interface Phone {
  code: number
  number: number
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
  address?: Address
  citizenship?: Citizenship
  email: string
  gender?: string
  id?: number
  name: string
  identity: string
  phone: Phone
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

export interface OptionsType {
  label: string,
  value: string | number
}