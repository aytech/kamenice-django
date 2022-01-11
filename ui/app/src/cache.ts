import { InMemoryCache, makeVar } from "@apollo/client"
import { TimelineGroup } from "react-calendar-timeline";
import { TokenAuth_tokenAuth_settings } from "./lib/graphql/mutations/Token/__generated__/TokenAuth";
import { Guests_guests } from "./lib/graphql/queries/Guests/__generated__/Guests";
import { Suites_suites } from "./lib/graphql/queries/Suites/__generated__/Suites";
import { CustomGroupFields, MenuItemKey, OptionsType } from "./lib/Types";

export const appSettings = makeVar<TokenAuth_tokenAuth_settings | null>(null)
export const discountSuiteOptions = makeVar<OptionsType[]>([])
export const guestDrawerOpen = makeVar<boolean>(false)
export const pageTitle = makeVar<string>("")
export const reservationMealOptions = makeVar<OptionsType[]>([])
export const reservationModalOpen = makeVar<boolean>(false)
export const reservationTypeOptions = makeVar<OptionsType[]>([])
export const roommateOptions = makeVar<OptionsType[]>([])
export const selectedGuest = makeVar<Guests_guests | null>(null)
export const selectedPage = makeVar<MenuItemKey>("user")
export const selectedSuite = makeVar<Suites_suites | null>(null)
export const suiteOptions = makeVar<OptionsType[]>([])
export const timelineGroups = makeVar<TimelineGroup<CustomGroupFields>[]>([])
export const userColor = makeVar<string>("#ccc")
export const userName = makeVar<string>("")

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        appSettings: {
          read: () => appSettings()
        },
        discountSuiteOptions: {
          read: () => discountSuiteOptions()
        },
        guests: {
          merge: false
        },
        guestDrawerOpen: {
          read: () => guestDrawerOpen()
        },
        pageTitle: {
          read: () => pageTitle()
        },
        reservations: {
          merge: false
        },
        reservationMealOptions: {
          read: () => reservationMealOptions()
        },
        reservationModalOpen: {
          read: () => reservationModalOpen()
        },
        reservationTypeOptions: {
          read: () => reservationTypeOptions()
        },
        roommateOptions: {
          read: () => roommateOptions()
        },
        selectedPage: {
          read: () => selectedPage()
        },
        suiteOptions: {
          read: () => suiteOptions()
        },
        suiteReservations: {
          merge: false
        },
        suites: {
          merge: false
        },
        userColor: {
          read: () => userColor()
        },
        userName: {
          read: () => userName()
        }
      }
    },
    // Local store
    Guest: {
      fields: {
        selectedGuest: {
          read: () => selectedGuest()
        }
      }
    },
    Reservation: {
      fields: {
        roommates: { merge: false },
        timelineGroups: {
          read: () => timelineGroups()
        }
      }
    },
    Suite: {
      fields: {
        selectedSuite: {
          read: () => selectedSuite()
        }
      }
    }
  }
})