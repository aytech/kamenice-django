import { InMemoryCache, makeVar } from "@apollo/client"
import { TimelineGroup, TimelineItem } from "react-calendar-timeline"
import { CustomGroupFields, CustomItemFields, MenuItemKey, OptionsType, ISuite, IGuest, ISettings } from "./lib/Types"
import moment, { Moment } from "moment"

export const appSettings = makeVar<ISettings | null>(null)
export const canvasTimeEnd = makeVar<number>(moment().add(15, "day").valueOf())
export const canvasTimeStart = makeVar<number>(moment().subtract(15, "day").valueOf())
export const discountSuiteOptions = makeVar<OptionsType[]>([])
export const guestDrawerOpen = makeVar<boolean>(false)
export const pageTitle = makeVar<string>("")
export const reservationItems = makeVar<TimelineItem<CustomItemFields, Moment>[]>([])
export const reservationMealOptions = makeVar<OptionsType[]>([])
export const reservationModalOpen = makeVar<boolean>(false)
export const reservationTypeOptions = makeVar<OptionsType[]>([])
export const roommateOptions = makeVar<OptionsType[]>([])
export const selectedGuest = makeVar<IGuest | null>(null)
export const selectedPage = makeVar<MenuItemKey>("user")
export const selectedSuite = makeVar<ISuite | null>(null)
export const suiteOptions = makeVar<OptionsType[]>([])
export const suites = makeVar<ISuite[]>([])
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
        canvasTimeEnd: {
          read: () => canvasTimeEnd()
        },
        canvasTimeStart: {
          read: () => canvasTimeStart()
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
        reservationItems: {
          read: () => reservationItems()
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
        timelineGroups: {
          read: () => timelineGroups
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
        roommates: { merge: false }
      }
    },
    Suite: {
      fields: {
        selectedSuite: {
          read: () => selectedSuite()
        },
        suites: {
          read: () => suites()
        }
      }
    }
  }
})