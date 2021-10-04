import { InMemoryCache, makeVar } from "@apollo/client"
import { TimelineGroup } from "react-calendar-timeline";
import { TokenAuth_tokenAuth_user } from "./lib/graphql/mutations/Token/__generated__/TokenAuth";
import { Guests_guests } from "./lib/graphql/queries/Guests/__generated__/Guests";
import { Suites_suites } from "./lib/graphql/queries/Suites/__generated__/Suites";
import { CustomGroupFields, MenuItemKey } from "./lib/Types";

export const timelineGroups = makeVar<TimelineGroup<CustomGroupFields>[]>([]);
export const pageTitle = makeVar<string>("")
export const reservationModalOpen = makeVar<boolean>(false)
export const selectedGuest = makeVar<Guests_guests | null>(null)
export const selectedPage = makeVar<MenuItemKey>("user")
export const selectedSuite = makeVar<Suites_suites | null>(null)
export const appUser = makeVar<TokenAuth_tokenAuth_user | null>(null)

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        guests: {
          merge: false
        },
        pageTitle: {
          read: () => pageTitle()
        },
        reservations: {
          merge: false
        },
        selectedPage: {
          read: () => selectedPage()
        },
        suiteReservations: {
          merge: false
        },
        suites: {
          merge: false
        }
      }
    },
    // Local store
    App: {
      fields: {
        reservationModalOpen: {
          read: () => reservationModalOpen()
        }
      }
    },
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
    },
    User: {
      fields: {
        user: {
          read: () => appUser()
        }
      }
    }
  }
})