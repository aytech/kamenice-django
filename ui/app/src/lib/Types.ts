import { Moment } from "moment"

export type AppReferrer = "/" | "/apartma" | "/guests"
export type ReservationType = "Závazná Rezervace" | "Nezávazná Rezervace" | "Aktuálně Ubytování" | "Obydlený Termín"
export type ReservationTypeKey = "BINDING" | "NONBINDING" | "ACCOMMODATED" | "INHABITED"

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

export type ReservationMeal = "BREAKFAST" | "HALFBOARD" | "NOMEAL"

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
  id?: number | string
  notes?: string | null
  purpose?: string | null
  roommates: Array<Guest>
  suite: Suite
  toDate: Moment
  type?: ReservationTypeKey
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
  number: number | null
  title: string
}

export interface CustomItemFields {
  color?: string
  guest: Guest
  meal: ReservationMeal
  notes: string | null
  purpose: string | null
  roommates: Guest[]
  suite: Suite
  type?: ReservationTypeKey
}

export enum GuestAge {
  ADULT = "ADULT",
  CHILD = "CHILD",
  INFANT = "INFANT",
  YOUNG = "YOUNG",
}

export enum GuestGender {
  F = "F",
  M = "M",
}

export interface ReservationGuest {
  __typename?: string;
  age?: GuestAge | null;
  addressMunicipality?: string | null;
  addressPsc?: number | null;
  addressStreet?: string | null;
  citizenship?: string | null;
  email?: string;
  gender?: GuestGender | null;
  identity?: string | null;
  id?: number | string;
  name: string;
  phoneNumber?: string | null;
  surname?: string;
  visaNumber?: string | null;
}