import { Moment } from "moment"
import { Guests_guests } from "./graphql/queries/Guests/__generated__/Guests"
import { Suites_suites } from "./graphql/queries/Suites/__generated__/Suites"

export type AppReferrer = "/" | "/apartma" | "/guests"
export type ReservationType = "Závazná Rezervace" | "Nezávazná Rezervace" | "Aktuálně Ubytování" | "Obydlený Termín"
export type ReservationTypeKey = "BINDING" | "NONBINDING" | "ACCOMMODATED" | "INHABITED"
export type MenuItemKey = "reservation" | "guests" | "suites" | "user"

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
export type GuestsAge = "ADULT" | "CHILD" | "INFANT" | "YOUNG"

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

export interface Roommate extends Guest {
  age: string | null
}

export interface IReservation {
  fromDate: Moment
  guest?: Guest
  meal?: ReservationMeal
  id?: number | string
  notes?: string | null
  priceAccommodation: string | null
  priceExtra: string | null
  priceMeal: string | null
  priceMunicipality: string | null
  priceTotal: string | null
  purpose?: string | null
  roommates: Array<Roommate>
  suite: Suite
  toDate: Moment
  type?: ReservationTypeKey
}

export interface SuiteForm {
  beds: number
  number: number
  price_base: number
  price_child: number
  price_extra: number
  price_infant: number
  title: string
}

export interface OptionsType {
  label: string
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
  priceAccommodation: string | null
  priceExtra: string | null
  priceMeal: string | null
  priceMunicipality: string | null
  priceTotal: string | null
  purpose: string | null
  roommates: Roommate[]
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

export interface User {
  username: string
}

export interface PriceInfo {
  priceAccommodation: number
  priceExtra: number
  priceMeal: number
  priceMunicipality?: number
  priceTotal?: number
}

export interface ReservationInputExtended {
  guest?: Guests_guests | null
  roommates?: Guests_guests[]
  suite?: Suites_suites
}