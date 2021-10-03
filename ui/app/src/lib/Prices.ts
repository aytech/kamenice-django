import moment from "moment";
import { GuestAge, ReservationInput } from "./graphql/globalTypes";
import { Guests_guests } from "./graphql/queries/Guests/__generated__/Guests";
import { Suites_suites } from "./graphql/queries/Suites/__generated__/Suites";
import { PriceInfo, ReservationInputExtended, ReservationMeal } from "./Types";

interface IPrices {
  calculatePrice: (reservationInput: ReservationInput & ReservationInputExtended) => PriceInfo
  getAccomodationPrice: (numberOfDays: number, suite?: Suites_suites, guest?: Guests_guests | null, roommates?: Guests_guests[]) => number
  getMealPrice: (numberOfDays: number, mealOption?: ReservationMeal, guest?: Guests_guests | null, roommates?: Guests_guests[]) => number
  getPriceExtra: (suite?: Suites_suites, roommates?: Guests_guests[]) => number
  getMunicipalityFee: (numberOfDays: number, guest?: Guests_guests | null, roommates?: Guests_guests[]) => number
}

export const Prices: IPrices = {

  getMealPrice: (numberOfDays: number, mealOption?: ReservationMeal | null, guest?: Guests_guests | null, roommates?: Guests_guests[]) => {
    let finalPrice: number = 0

    const breakfastPrice: number = 80 // @TODO: make configurable
    const halfBoardPrice: number = 200 // TODO: make configurable
    const childDiscount: number = .40 // @TODO: 40%, make configurable
    const getPrice = (guestPrice: number) => {
      let roommatesPrice: number = 0
      roommates?.forEach((roommate: Guests_guests) => {
        switch (roommate.age) {
          case GuestAge.INFANT: // Child has no meal option
            break
          case GuestAge.CHILD: // Apply discount
            roommatesPrice = guestPrice - (guestPrice * childDiscount)
            break
          default: // 12+ and adults pay full price
            roommatesPrice += guestPrice
        }
      })
      if (guest !== undefined && guest !== null) {
        return guestPrice + roommatesPrice
      } else {
        return roommatesPrice
      }
    }

    switch (mealOption) {
      case "BREAKFAST":
        finalPrice = getPrice(breakfastPrice)
        break
      case "HALFBOARD":
        finalPrice = getPrice(halfBoardPrice)
        break
    }

    return finalPrice * numberOfDays
  },

  getMunicipalityFee: (numberOfDays: number, guest?: Guests_guests | null, roommates?: Guests_guests[]) => {
    const municipalityFee = 21 // @TODO: make configurable
    let numberOfGuests = 0

    if (guest !== undefined && guest !== null) {
      numberOfGuests++
    }

    if (roommates !== undefined) {
      numberOfGuests += roommates.length
    }

    return (municipalityFee * numberOfGuests) * numberOfDays
  },

  getAccomodationPrice: (numberOfDays: number, suite?: Suites_suites, guest?: Guests_guests | null, roommates?: Guests_guests[]) => {
    let accomodationPrice: number = 0
    if (suite !== undefined) {
      const basePrice = Number(suite.priceBase)
      accomodationPrice = basePrice

      if (numberOfDays < 3) {
        accomodationPrice = accomodationPrice * numberOfDays
      } else {
        accomodationPrice = (accomodationPrice * numberOfDays) - ((accomodationPrice * numberOfDays) * .12) // 12% discount. @TODO: make percent configurable
      }
    }

    if (roommates !== undefined && roommates.length > 0) {
      return accomodationPrice * (roommates.length + 1) // accounts for main guest
    }

    return accomodationPrice
  },

  getPriceExtra: (suite?: Suites_suites, roommates?: Guests_guests[]) => {
    let price: number = 0

    if (suite !== undefined) {
      roommates?.forEach((roommate, index: number) => {
        if ((index + 1) >= suite.numberBeds) { // Assuming +1 as roommate is an addition to a guest
          price += Number(suite.priceExtra)
        }
      })
    }

    return price
  },

  // Basic formula:
  // 1. Each room has price per day
  // 2. Room price can be divided per number of guests, if all guests are 12+ of age
  //    - Model: 2x room apartment is 1400 Kc, for 2 adult guests the price is 700 Kc each
  // 3. If one of the guests in a child or infant, price is not halved, but 10% discount is given. @TODO make that percent configurable
  // 4. If the stay is longer than 3 days, 12% discount is given for the price of the room. @TODO: make percent configurable 
  // 5. Meal:
  //    - Breakfast: 80 Kc per person per day. @TODO make the price configurable
  //    - Halfboard: 200 Kc per person per day. @TODO make the price configurable
  //    - No meal. Free. Children under 3 cannot have meal ordered
  //    - Discount: 40% for children 3-12 years of age. @TODO make the percent configurable
  // 6. Municipality fee: 21 Kc per day per person
  // Questions:
  // 1. Model calculation:
  //    - 4x room apartment, 2x adults, 1x child/infant?
  //    - 2x room apartment, 2x adults, 1child/infant, 1 extra bed?
  //    - 4x room apartment, 3 adults, 1 child/infant?
  //    - 4x room apartment, 1 adult, 1 child/infant?
  calculatePrice: (reservationInput: ReservationInput & ReservationInputExtended) => {

    let priceAccommodation: number = 0
    let priceMeal: number = 0
    let priceExtra: number = 0
    let priceMunicipality: number = 0
    let priceTotal: number = 0
    let numberOfDays: number = 0

    if (reservationInput.toDate !== undefined && reservationInput.toDate !== null) {
      const endDate = moment(reservationInput.toDate)
      const startDate = moment(reservationInput.fromDate)
      numberOfDays = Math.ceil(moment.duration(endDate.diff(startDate)).asDays())
    }

    priceAccommodation = Prices.getAccomodationPrice(numberOfDays, reservationInput.suite, reservationInput.guest, reservationInput.roommates)
    priceMeal = Prices.getMealPrice(numberOfDays, reservationInput.meal as ReservationMeal, reservationInput.guest, reservationInput.roommates)
    priceExtra = Prices.getPriceExtra(reservationInput.suite, reservationInput.roommates)
    priceTotal = priceAccommodation

    // Calculate meal price only if guest or roommates were selected
    // if (
    //   (reservationInput.guest !== undefined && reservationInput.guest !== undefined)
    //   || (reservationInput.roommates !== undefined && reservationInput.roommates.length > 0)) {
    //   priceMeal *= numberOfDays
    //   priceTotal += priceMeal
    // }

    if (priceExtra > 0) {
      priceExtra *= numberOfDays
    }

    if (numberOfDays > 0) {
      priceMunicipality = Prices.getMunicipalityFee(numberOfDays, reservationInput.guest, reservationInput.roommates)
    }

    priceTotal += (priceMeal + priceExtra + priceMunicipality)

    // Steps:
    // 1. Calculate base price for a room.
    // 2. Loop through roommates, apply formula:
    //    - If room capacity is 2 and 
    //    - Figure out the rest
    // 3. Apply discount if stay is longer than 3 days
    // 4. Add meal price
    // 5. Add municipality fee. For children also? ask

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
    // 2. Calculate prices permeal:
    //    - Just breakfast - + 80 Kc per person
    //    - Polopenze - 200 Kc per person
    //    - Deti - 40% sleva

    return { priceAccommodation, priceExtra, priceMeal, priceMunicipality, priceTotal }
  }
}