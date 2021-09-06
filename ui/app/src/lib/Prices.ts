import moment from "moment";
import { ReservationInput } from "./graphql/globalTypes";
import { Suites_suites } from "./graphql/queries/Suites/__generated__/Suites";
import { GuestsAge, ReservationMeal } from "./Types";

interface IPrices {
  calculatePrice: (suite: Suites_suites, reservationInput: ReservationInput) => string
  getDailyPricePerGuest: (basePrice: number, mealOption: ReservationMeal) => number
  getDailyPricePerRoommate: (basePrice: number, age: GuestsAge, mealOption: ReservationMeal) => number

}

export const Prices: IPrices = {
  getDailyPricePerGuest: (basePrice: number, mealOption: ReservationMeal) => {
    let guestPrice = 0
    return guestPrice
  },
  getDailyPricePerRoommate: (basePrice: number, age: GuestsAge, mealOption: ReservationMeal) => {
    let roomamatePrice = 0
    return roomamatePrice
  },
  // calculateMealPricePerDay: (meal: ReservationMeal | undefined, guest: Guest | undefined, roommates: Roommate[]) => {
  //   let mealPrice = 0
  //   if (meal === undefined || guest === undefined) {
  //     return mealPrice
  //   }
  //   switch (meal) {
  //     case "BREAKFAST":
  //       mealPrice += 80
  //       break
  //     case "HALFBOARD":
  //       mealPrice += 200
  //       break
  //     default:
  //       break
  //   }
  //   roommates.forEach((roommate: Roommate) => {
  //     console.log("Roommate: ", roommate);

  //   })
  //   console.log("Meal price: ", mealPrice);

  //   return mealPrice
  // },
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
  calculatePrice: (suite: Suites_suites, reservationInput: ReservationInput) => {
    let finalPrice: number = 0
    let numberOfDays: number = 0
    const municipalityFee: number = 21 // replace with number from administration
    console.log('Input: ', reservationInput);

    if (reservationInput.toDate !== undefined && reservationInput.toDate !== null) {
      const endDate = moment(reservationInput.toDate)
      const startDate = moment(reservationInput.fromDate)
      numberOfDays = Math.ceil(moment.duration(endDate.diff(startDate)).asDays())
    }

    console.log(numberOfDays);

    // Steps:
    // 1. Calculate base price for a room.
    // 2. Loop through roommates, apply formula:
    //    - If room capacity is 2 and 
    //    - Figure out the rest
    // 3. Apply discount if stay is longer than 3 days
    // 4. Add meal price
    // 5. Add municipality fee. For children also? ask

    // const numberOfGuests: number = 1 + reservation.roommates.length // guest + roommates
    // if (numberOfDays > 0) {
    //   finalPrice = numberOfDays * suite.priceBase
    // }
    // if (numberOfDays >= 3) {
    //   finalPrice -= ((numberOfDays * suite.priceBase) / 100) * 12
    // }
    // // Calculate municipality fee
    // finalPrice += (numberOfGuests * municipalityFee) * numberOfDays
    // finalPrice += Prices.calculateMealPricePerDay(reservation.meal, reservation.guest, reservation.roommates)
    // console.log(reservation);

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
    return String(finalPrice)
  }
}