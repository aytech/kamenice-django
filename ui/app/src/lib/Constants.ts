import moment from "moment"
import { IReservation } from "./Types"

export const defaultArrivalHour: number = 14
export const defaultDepartureHour: number = 10
export const emptyReservation: IReservation = {
  fromDate: moment(),
  roommates: [],
  toDate: moment().add(1, "day"),
  suite: { id: 0 },
  type: "NONBINDING"
}