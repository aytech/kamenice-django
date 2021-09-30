import { InMemoryCache, makeVar } from "@apollo/client"
import { TimelineGroup } from "react-calendar-timeline";
import { CustomGroupFields } from "./lib/Types";

export const timelineGroupsVar = makeVar<TimelineGroup<CustomGroupFields>[]>([]);

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        guests: {
          merge: false
        },
        reservations: {
          merge: false
        },
        suiteReservations: {
          merge: false
        },
        suites: {
          merge: false
        }
      }
    },
    Reservation: {
      fields: {
        roommates: { merge: false },
        timelineGroups: {
          read: () => timelineGroupsVar()
        }
      }
    }
  }
})