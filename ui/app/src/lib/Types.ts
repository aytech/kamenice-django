import { Moment } from "moment"
import { DiscountSuiteType, Guest, GuestAge } from "./graphql/graphql"

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

export interface IGuest {
  addressMunicipality?: string | null,
  addressPsc?: number | null,
  addressStreet?: string | null,
  age?: GuestAge | null,
  citizenship?: string | null,
  color?: string | null,
  email?: string | null,
  gender?: GuestGender | null,
  id: string,
  identity?: string | null,
  name: string,
  phoneNumber?: string | null,
  surname: string,
  visaNumber?: string | null
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

export interface IGuestReportFile {
  created: any,
  driveId: string,
  id: string,
  name: string,
  pathDocx?: string | null,
  pathPdf?: string | null
}

export interface IToken {
  payload: any,
  refreshExpiresIn: number,
  refreshToken: string,
  settings?: ISettings,
  token: string
}

export interface GuestOption {
  id: string
  name: string
  surname: string
}

export interface ISettings {
  defaultArrivalTime: any,
  defaultDepartureTime: any,
  id: string,
  municipalityFee?: any | null,
  priceBreakfast?: any | null,
  priceBreakfastChild?: any | null,
  priceHalfboard?: any | null,
  priceHalfboardChild?: any | null,
  userAvatar?: string | null,
  userColor?: string | null,
  userName?: string | null
}

export interface ISuite {
  discountSuiteSet?: Array<{ type: DiscountSuiteType, value: number }>,
  id: string
  number?: number | null
  numberBeds: number
  numberBedsExtra: number
  priceBase?: string | null
  title?: string
}

export interface ReservationPrice {
  accommodation: string | null,
  meal: string | null,
  municipality: string | null,
  suite?: {
    id: string,
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
  priceSet?: Array<ReservationPrice>,
  purpose?: string | null
  roommates?: { id: string, fromDate: Moment }[]
  roommateSet?: { entity: { id: string, name: string, surname: string }, fromDate: string }[]
  suite?: ISuite
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
  id: string
  number?: number | null
  priceBase: string
  title: string
}

export interface CustomItemFields {
  color?: string
  expired?: Moment | null
  extraSuites: { id: string }[]
  guest?: Guest
  id: string
  meal?: ReservationMeal
  notes?: string | null
  payingGuest?: { id: string } | null
  price: ReservationPrice
  purpose?: string | null
  reservationId?: string | number
  roommates?: {
    id: string,
    name: string,
    surname: string,
    fromDate: Moment
  }[]
  suite?: ISuite
  type?: ReservationTypeKey
}

// export enum GuestAge {
//   ADULT = "ADULT",
//   CHILD = "CHILD",
//   INFANT = "INFANT",
//   YOUNG = "YOUNG",
// }

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
  accommodation?: string | null
  meal?: string | null
  municipality?: string | null
  total?: string | null
}

export interface ReservationInputExtended {
  guest?: Guest
  roommates?: Guest[]
  suite?: ISuite
}