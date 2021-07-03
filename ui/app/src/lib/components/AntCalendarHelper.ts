import { ReserveRange } from "../Types"
import { Moment } from "moment"
import moment from "moment"

export const AntCalendarHelper = {
  getRangePickerDates: (range: ReserveRange | undefined): Array<Moment | null> => {
    if (range === undefined) {
      return []
    }
    const fromDate = [ range.from.year, range.from.month - 1, range.from.day ]
    const toDate = [ range.to.year, range.to.month - 1, range.to.day ]
    if (range.from.hour !== undefined) fromDate.push(range.from.hour)
    if (range.from.minute !== undefined) fromDate.push(range.from.minute)
    if (range.to.hour !== undefined) toDate.push(range.to.hour)
    if (range.to.minute !== undefined) toDate.push(range.to.minute)
    return [
      moment(fromDate),
      moment(toDate)
    ]
  }
}