import { Day } from "react-modern-calendar-datepicker";
import { ReservationTypeKey } from "./Reservation";

export interface ReservedRange {
    id: number,
    from: Day,
    to: Day,
    type: ReservationTypeKey
}

export interface Room {
    id: number,
    name: string,
    reservedRanges: ReservedRange[]
}