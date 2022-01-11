import { Moment } from "moment"
import { Guests_guests } from "./graphql/queries/Guests/__generated__/Guests"
import { Suites_suites } from "./graphql/queries/Suites/__generated__/Suites"

export type AppReferrer = "/" | "/apartma" | "/guests"
export type ReservationType = "Závazná Rezervace" | "Nezávazná Rezervace" | "Aktuálně Ubytování" | "Obydlený Termín"
export type ReservationTypeKey = "BINDING" | "NONBINDING" | "ACCOMMODATED" | "INHABITED" | "INQUIRY" | "SELECTED"
export type MenuItemKey = "reservation" | "guests" | "suites" | "user"

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

export interface IGuestForm {
  age: string,
  address?: Address
  citizenship?: Citizenship
  email?: string
  gender?: string
  id?: number
  name: string
  identity?: string
  phone?: string
  surname: string
  visa?: string
}

export interface IGuestData {
  age: string,
  addressMunicipality?: string
  addressPsc?: number
  addressStreet?: string
  citizenship?: string
  email?: string
  gender?: string
  id?: number
  name: string
  identity?: string
  phoneNumber?: string
  surname: string
  visaNumber?: string
}

export interface Guest {
  email: string | null
  id?: number | string
  name: string
  surname: string
}

export interface GuestOption {
  id: string
  name: string
  surname: string
}

export interface Suite {
  id: number | string
  number?: number | null
  numberBeds?: number | null
  numberBedsExtra?: number | null
  priceBase?: string | null
  title?: string
}

export interface Roommate extends Guest {
  age: string | null
}

export interface ReservationPrice {
  accommodation: string | null,
  meal: string | null,
  municipality: string | null,
  suite: {
    id: number | string,
    priceBase?: string | null
  },
  total: string | null
}

export interface IReservation {
  expired?: Moment | null
  extraSuites: { id: string }[]
  fromDate: Moment
  guest?: Guest
  meal?: ReservationMeal
  id?: number | string
  notes?: string | null
  payingGuest?: { id: string } | null
  price?: ReservationPrice
  purpose?: string | null
  roommates?: { id: string }[]
  suite: Suite
  toDate: Moment
  type?: ReservationTypeKey
}

export interface Discount {
  type: string
  value: number
}

export interface SettingsForm {
  discounts: Array<Discount>
  id: number
  municipality_fee: number
  price_breakfast: number
  price_halfboard: number
  user_avatar: string
  user_color: string
  user_name: string
}

export interface SuiteForm {
  beds: number
  beds_extra: number
  discounts: Array<Discount>
  number: number
  price_base: string
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
  id: number | string
  number: number | null
  priceBase: string
  title: string
}

export interface CustomItemFields {
  color?: string
  expired?: Moment | null
  extraSuites: { id: string }[]
  guest: Guest
  id: string
  meal: ReservationMeal
  notes: string | null
  payingGuest?: { id: string } | null
  price: ReservationPrice
  purpose: string | null
  reservationId: string
  roommates?: { id: string }[]
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
  gender?: GuestGender | null;
  identity?: string | null;
  id?: number | string;
  name: string;
  surname?: string;
}

export interface User {
  username: string
}

export interface PriceInfo {
  priceAccommodation: number
  priceMeal: number
  priceMunicipality?: number
  priceTotal?: number
}

export interface ReservationInputExtended {
  guest?: Guests_guests
  roommates?: Guests_guests[]
  suite?: Suites_suites
}