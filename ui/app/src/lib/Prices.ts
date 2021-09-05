import moment from "moment";
import { Suites_suites } from "./graphql/queries/Suites/__generated__/Suites";
import { IReservation } from "./Types";

interface IPrices {
  calculatePrice: (suite: Suites_suites, reservation: IReservation) => string
}

export const Prices: IPrices = {
  calculatePrice: (suite: Suites_suites, reservation: IReservation) => {
    let finalPrice: number = 0
    const days = Math.ceil(moment.duration(reservation.toDate.diff(reservation.fromDate)).asDays())
    if (days > 0) {
      finalPrice = days * suite.priceBase
    }
    if (days >= 3) {
      finalPrice -= ((days * suite.priceBase) / 100) * 12
    }

    // @TODO
    // 1. Calculate price per roommate with scenarios:
    //    - 2x bed room with base price 1400
    //      2x adults = full price
    //      1x adult + 1x child = full price - 10%
    //      2x adults + 1x child = ???
    //    - 4x bed room with base price 2600
    //      1x adult + 1x child = ???
    //      2x adults + 1 child = ???
    //      2x adults + 2x child = ???
    //      extra bed calculation = ???
    // 2. Add city tax per number of guests
    return String(finalPrice)
  }
}