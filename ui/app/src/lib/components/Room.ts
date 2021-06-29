import { Day } from "react-modern-calendar-datepicker";
import { ReservationTypeKey } from "./Reservation";

export type ReserveDay = Day & { hour?: number, minute?: number }

export interface ReserveRange {
  id?: number,
  from: ReserveDay,
  to: ReserveDay,
  type: ReservationTypeKey
}

export interface Room {
  id: number,
  name: string,
  reservedRanges: ReserveRange[]
}