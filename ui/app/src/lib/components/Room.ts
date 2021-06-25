import { ReservationTypeKey } from "./Reservation";

export interface ReservedDay {
    year: number,
    month: number,
    day: number,
    type: ReservationTypeKey
}

export interface Room {
    id: number,
    name: string,
    reservedDays: ReservedDay[]
}